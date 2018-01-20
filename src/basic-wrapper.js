const spawn = require('cross-spawn');
const outputParsers = require('./output-parsers');
const path = require('path');
const regexes = require('./output-parsers/regexes');

module.exports = (_options) => {
  const {
    command, platform, settings, outputInStderr,
  } = _options;

  const binaryString = path.join(platform.binaryPath, command);

  return function basicWrapper(_options2, _callback) {
    let callback = _callback;
    let options = _options2;
    // let execString = `${binaryString}`;
    const env = settings.env || {};

    if (!callback && typeof options === 'function') {
      callback = options;
      options = {};
    }

    if (!callback) {
      throw new Error('Callback function required');
    }

    let { args } = options;
    if (!args) args = [];
    if (!Array.isArray(args)) {
      return callback('Parameter "args" must be array of strings');
    }

    if (settings.loglevel) {
      args.unshift('--log-level', settings.loglevel);
    }

    if (options.verbose || settings.verbose) {
      console.log('Executing:', binaryString, args.join(' '));
    }

    const child = spawn(binaryString, args, { env });
    let stdout = '';
    let stderr = '';

    /**
     * Spawn will return a stream, but we want to just collect all the data and return it
     * when it's done for the basic-wrapper. For true streaming output, i.e. processes that
     * might take a while and have periodic updates (moving files, etc), use streaming-wrapper.
     */
    /* eslint no-return-assign: ["error", "except-parens"] */
    child.stdout.on('data', data => (stdout += data));
    child.stderr.on('data', data => (stderr += data));
    child.on('error', callback);
    child.on('close', (code) => {
      if (options.verbose || settings.verbose) {
        console.log('Process closed with code:', code);
      }
      if (code && code !== 0) {
        // find any error messages in stdout or stderr -- should be lines beginning
        // with 'E: ...' or 'F: ...'
        let err = '';
        const lines = stdout.split(/\r?\n/).concat(stderr.split(/\r?\n/));
        lines.forEach((l) => {
          if (regexes.errorRegex.test(l)) err += `${l}\n`;
        });
        return callback(err.length ? err : `Unknown error\nSTDOUT: ${stdout}\nSTDERR: ${stderr}`);
      }
      const output = outputInStderr ? stderr : stdout;
      return callback(null, {
        parsed: outputParsers[command] && output ? outputParsers[command](output) : output,
        stdout,
        stderr,
      });
    });
    return true;
  };
};
