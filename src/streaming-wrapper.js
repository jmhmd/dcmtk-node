const spawn = require('cross-spawn');
const outputParsers = require('./output-parsers');
const path = require('path');

module.exports = (_options) => {
  const { command, platform, settings } = _options;

  const binaryString = path.join(platform.binaryPath, command);

  return function streamingWrapper(_options2) {
    const options = _options2;
    const execString = binaryString;
    const env = settings.env || {};

    let { args } = options;
    if (!args) args = [];
    if (!Array.isArray(args)) {
      return new Error('Parameter "args" must be array of strings');
    }

    if (options.loglevel || settings.loglevel) {
      const loglevel = options.loglevel || settings.loglevel;
      args.unshift('--log-level', loglevel);
    }

    if (options.verbose || settings.verbose) {
      console.log('Executing:', [execString].concat(args).join(' '));
    }
    const child = spawn(execString, args, { env });

    if (outputParsers[command]) {
      child.parsed = {
        stderr: outputParsers[command](child.stderr, 'stderr'),
        stdout: outputParsers[command](child.stdout, 'stdout'),
      };
    }

    process.on('exit', () => child.kill());

    return child;
  };
};
