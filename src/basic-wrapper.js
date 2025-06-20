const spawn = require('cross-spawn');
const outputParsers = require('./output-parsers');
const path = require('path');
const regexes = require('./output-parsers/regexes');

module.exports = (_options) => {
  const { command, platform, settings } = _options;
  const binaryString = path.join(platform.binaryPath, command);

  return function basicWrapper(_options2, _callback) {
    let callback = _callback;
    let options = _options2;
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

    if (settings.loglevel &&
        !args.includes('-v') &&
        !args.includes('--verbose') &&
        !args.includes('--debug') &&
        !args.includes('--quiet')) {
      args.unshift('--log-level', settings.loglevel);
    }

    // Add --print-filename if scanning directories
    if (args.includes('--scan-directories') || args.includes('+sd')) {
      if (!(args.includes('--print-filename') || args.includes('+F'))) {
        args.unshift('--print-filename');
      }
    }

    if (options.verbose || settings.verbose) {
      console.log('🟢 Executing:', binaryString, args.join(' '));
    }

    // Spawn the command
    const child = spawn(binaryString, args, { env });

    let combined = '';

    // Event: process starts
    child.on('spawn', () => {
      console.log(`🚀 ${command} process started.`);
    });

    // Event: standard output
    child.stdout.on('data', (data) => {
      const output = data.toString();
      combined += output;
      console.log(`📤 STDOUT (${command}):\n`, output);
    });

    // Event: standard error
    child.stderr.on('data', (data) => {
      const error = data.toString();
      combined += error;
      console.error(`🐛 STDERR (${command}):\n`, error);
    });

    // Event: process error (e.g. spawn failed)
    child.on('error', (err) => {
      console.error(`❌ Failed to start ${command}:`, err.message || err);
      return callback(err.message || err);
    });

    // Event: process exit
    child.on('close', (code) => {
      console.log(`🚪 ${command} exited with code: ${code}`);

      // Only error out if exit code is non-zero and no ignore flag is set
      if (
        code !== 0 &&
        !args.includes('--scan-directories') &&
        !args.includes('+sd') &&
        !args.includes('--ignore-errors') &&
        !args.includes('+E')
      ) {
        let err = '';
        const lines = combined.split(/\r?\n/);
        lines.forEach((l) => {
          if (regexes.errorRegex.test(l)) err += `${l}\n`;
        });
        return callback(err || `Unknown error\nOutput:\n${combined}`);
      }

      return callback(null, {
        parsed: outputParsers[command] && combined
          ? outputParsers[command](combined, args)
          : combined,
        output: combined,
      });
    });

    return true;
  };
};
