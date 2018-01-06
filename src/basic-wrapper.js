const childProcess = require('child_process');
const shellEscape = require('shell-escape');
const outputParsers = require('./output-parsers');
const path = require('path');

module.exports = (_options) => {
  const {
    command, platform, settings, outputInStderr,
  } = _options;

  const binaryString = path.join(platform.binaryPath, command);
  let execString = `${binaryString}`;

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
    if (typeof args === 'string') args = args.split(' ');

    if (settings.loglevel) {
      args.unshift('--log-level', 'debug');
    }

    execString += ` ${shellEscape(args)}`;

    if (options.verbose || settings.verbose) {
      console.log('Executing:', execString);
    }
    childProcess.exec(execString, { env }, (err, stdout, stderr) => {
      const output = outputInStderr ? stderr : stdout;
      callback(err, {
        parsed: outputParsers[command] && output ? outputParsers[command](output) : output,
        stdout,
        stderr,
      });
    });
  };
};
