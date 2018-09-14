const { fork } = require('child_process');
const mergeStream = require('merge-stream');
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

    // const child = spawn(execString, args, { env });
    /**
     * We're using child_process.fork here to start the spawn wrapper module, which then actually
     * calls spawn on the external function rather than calling spawn directly here. The reason for
     * doing this is so that we can handle crashes of the parent process gracefully and clean up any
     * orphaned child processes. Apparently, when the parent process exits with SIGKILL or some
     * other non-graceful exit, child processes are orphaned and adopted by the `init` process (pid
     * = 1). So then we don't have a way of killing that process after our parent app crashed. The
     * solution here is to wrap that spawn call in a forked node process, which has an IPC channel
     * with the parent. We can listen for the 'disconnect' event when that channel closes, and
     * gracefully exit the child processes.
     */
    // { silent: true } pipes stdio from the forked process to the parent.
    const child = fork(path.resolve(__dirname, './spawn-wrapper.js'), [], {
      stdio: 'pipe',
      execArgv: [], // prevents crash when --inspect flag set on parent node process
    });
    child.send({
      signal: 'spawn',
      execString,
      args,
      env,
    });

    const combinedOutputStream = mergeStream(child.stdout, child.stderr);

    if (outputParsers[command]) {
      // child.parsed = {
      //   stderr: outputParsers[command](child.stderr, 'stderr'),
      //   stdout: outputParsers[command](child.stdout, 'stdout'),
      //   output: outputParsers[command](combinedOutputStream),
      // };
      child.parsed = outputParsers[command](combinedOutputStream);
    }

    function handleErrors(line) {
      if (regexes.errorRegex.test(line) || regexes.cMoveErrorStatus.test(line)) {
        if (errLog.length > logLength) {
          errLog.shift();
        }
        errLog.push(line);
      }
    }

    // keep fixed length recent log to find error messages if needed
    // child.stdout.pipe(split2()).on('data', handleErrors);
    // child.stderr.pipe(split2()).on('data', handleErrors);
    combinedOutputStream.pipe(split2()).on('data', handleErrors);

    child.on('close', (code, signal) => {
      // Cannot rely on the exit code to know whether or not there was an error in the operation -
      // for instance, movescu coordinates move operations between two other servers. If the
      // connection between the two other servers is faulty, an error will be reported in output but
      // the operation will otherwise complete successfully with exit code 0
      if (errLog.length > 0 || code !== 0) {
        child.emit(
          'error',
          new Error(errLog.length ? errLog : `Unknown error, code: ${code}, signal: ${signal}`),
        );
      }
    });

    process.on('exit', () => child.kill());

    return child;
  };
};
