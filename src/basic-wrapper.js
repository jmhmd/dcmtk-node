const childProcess = require('child_process');
const shellEscape = require('shell-escape');
const outputParsers = require('./output-parsers');
const path = require('path');

module.exports = (_options) => {
  const { command, platform, settings } = _options;

  const binaryString = path.join(platform.binaryPath, command);
  let execString = `${binaryString}`;

  return function (options, callback) {
    if (!callback && typeof options === 'function') {
      callback = options;
      options = {};
    }

    const { args } = options;
    if (!args) args = [];

    execString += ` ${shellEscape(args)}`;

    if (options.verbose || settings.verbose) {
      console.log(execString);
    }
    childProcess.exec(execString, (err, stdout, stderr) => callback(err, {
      parsed: outputParsers[command] && stdout ? outputParsers[command](stdout) : stdout,
      stdout,
      stderr }));
  };
};
