const childProcess = require('child_process');
// const shellEscape = require('shell-escape');
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
    if (typeof args === 'string') args = args.split(' ');

    if (settings.loglevel) {
      args.unshift('--log-level', settings.loglevel);
    }

    if (options.verbose || settings.verbose) {
      console.log('Executing:', [execString].concat(args).join(' '));
    }
    const child = childProcess.spawn(execString, args, { env });

    if (outputParsers[command]) {
      child.parsed = {
        stderr: outputParsers[command](child.stderr, 'stderr'),
        stdout: outputParsers[command](child.stdout, 'stdout'),
      };
    }

    return child;
  };
};
