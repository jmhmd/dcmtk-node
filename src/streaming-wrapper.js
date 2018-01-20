const spawn = require('cross-spawn');
const outputParsers = require('./output-parsers');
const path = require('path');
const split2 = require('split2');
const regexes = require('./output-parsers/regexes');

const logLength = 100;

module.exports = (_options) => {
  const { command, platform, settings } = _options;

  const binaryString = path.join(platform.binaryPath, command);

  return function streamingWrapper(_options2) {
    const options = _options2;
    const execString = binaryString;
    const env = settings.env || {};
    const errLog = [];

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

    function handleErrors(line) {
      if (regexes.errorRegex.test(line)) {
        if (errLog.length > logLength) {
          errLog.shift();
        }
        errLog.push(line);
      }
    }

    // keep fixed length recent log to find error messages if needed
    child.stdout.pipe(split2()).on('data', handleErrors);
    child.stderr.pipe(split2()).on('data', handleErrors);

    child.on('close', (code, signal) => {
      if (code !== 0) {
        child.emit('error', new Error(errLog));
      }
    });

    process.on('exit', () => child.kill());

    return child;
  };
};
