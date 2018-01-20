const dcmtk = require('../../')();

const split2 = require('split2');
const path = require('path');
const fs = require('fs');
const async = require('async');
const { promisify } = require('util');

let child;
const unlink = promisify(fs.unlink);
const each = promisify(async.each);
const access = promisify(fs.access);

const indexDir = path.join(__dirname, 'data');
const indexPath = path.join(indexDir, 'index.dat');

const spike = async () => {
  // delete old index
  try {
    await access(indexPath);
    await unlink(indexPath);
  } catch (e) {
    // console.log('No index to delete');
  }

  // create new index and preload with a few images
  return each(
    [
      path.join(__dirname, 'data', 'study1', '01.dcm'),
      path.join(__dirname, 'data', 'study1', '02.dcm'),
      path.join(__dirname, 'data', 'study1', '03.dcm'),
    ],
    (filepath, callback) => {
      dcmtk.dcmqridx(
        {
          args: [indexDir, filepath],
        },
        callback,
      );
    },
  );
};

/**
 * Start dcmqrscp server and log output
 */
const start = async (cb) => {
  const p = new Promise(async (resolve, reject) => {
    await spike();

    try {
      child = dcmtk.dcmqrscp({
        args: ['--config', path.join(__dirname, 'dcmqrscp.cfg')],
        loglevel: 'debug',
      });

      child.on('close', (code, signal) => {
        // console.log(`Closed dcmqrscp server with code ${code} and signal ${signal}`);
      });

      child.on('error', (err) => {
        console.log(`Error on dcmqrscp server: ${err}`);
      });

      child.stdout.pipe(split2()).on('data', (data) => {
        // console.log(`STDOUT: ${data}`);
        if (/D: $/.test(data)) {
          resolve(null);
        }
      });

      child.stderr.pipe(split2()).on('data', (data) => {
        // console.log(`STDERR: ${data}`);
        if (/D: $/.test(data)) {
          resolve(null);
        }
      });
    } catch (e) {
      reject(e);
    }
  });

  if (cb && typeof cb === 'function') {
    p.then(cb, cb);
  }

  return p;
};

const stop = () => {
  child.kill();
};

module.exports = {
  start,
  stop,
  spike,
};
