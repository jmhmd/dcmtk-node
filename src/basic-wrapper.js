const spawn = require('cross-spawn');
const outputParsers = require('./output-parsers');
const path = require('path');
const regexes = require('./output-parsers/regexes');

module.exports = (_options) => {
  const {
    command, platform, settings,
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

    // If we are scanning a directory (i.e. dumping multiple files at once), then include a flag to
    // print the dumped filename ahead of each result so we can parse them appropriately
    if (args.includes('--scan-directories') || args.includes('+sd')) {
      if (!(args.includes('--print-filename') || args.includes('+F'))) {
        args.unshift('--print-filename');
      }
    }

    if (options.verbose || settings.verbose) {
      console.log('Executing:', binaryString, args.join(' '));
    }

    const child = spawn(binaryString, args, { env });
    let combined = '';

    /**
     * Spawn will return a stream, but we want to just collect all the data and return it
     * when it's done for the basic-wrapper. For true streaming output, i.e. processes that
     * might take a while and have periodic updates (moving files, etc), use streaming-wrapper.
     */
    /* eslint no-return-assign: ["error", "except-parens"] */
    child.stdout.on('data', (data) => {
      combined += data;
    });
    child.stderr.on('data', (data) => {
      combined += data;
    });
    child.on('error', callback);
    child.on('close', (code) => {
      if (options.verbose || settings.verbose) {
        console.log('Process closed with code:', code);
      }

      // Only return without parsing if exit code is non-zero AND we haven't set the
      // --scan-directories flag. --scan-directories with dcmdump will return a non-zero exit code
      // if corrputed or non-dicom files are encountered, but we want to go ahead and process this
      // output
      if (code && code !== 0 && !args.includes('--scan-directories') && !args.includes('+sd')) {
        // find any error messages in stdout or stderr -- should be lines beginning
        // with 'E: ...' or 'F: ...'
        let err = '';
        const lines = combined.split(/\r?\n/);
        lines.forEach((l) => {
          if (regexes.errorRegex.test(l)) err += `${l}\n`;
        });
        return callback(err.length ? err : `Unknown error\nSTDOUT/STDERR: ${combined}`);
      }

      // Pass the combined stdout and stderr output to the parser, as sometimes the errors are
      // useful in determining what happened to a given file or block of output
      return callback(null, {
        parsed:
          outputParsers[command] && combined ? outputParsers[command](combined, args) : combined,
        output: combined,
      });
    });
    return true;
  };
};
