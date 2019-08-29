const split2 = require('split2');
const path = require('path');
const dcmtk = require('../')({ verbose: true });

const outputdir = path.join(__dirname, '../test/data/output');

/**
 * Start storescp server and log output
 */
const storescp = dcmtk.storescp({
  args: ['-od', outputdir, '-su', 'PB', '-aet', 'TESTLISTENER', '--fork', '4242'],
});

storescp.on('close', (code, signal) => {
  console.log(`Closed storescu server with code ${code} and signal ${signal}`);
});

storescp.on('error', (err) => {
  console.log(`Error on storescu server: ${err}`);
});

storescp.stdout.pipe(split2()).on('data', (data) => {
  console.log(`STDOUT: ${data}`);
});

storescp.stderr.pipe(split2()).on('data', (data) => {
  console.log(`STDERR: ${data}`);
});
