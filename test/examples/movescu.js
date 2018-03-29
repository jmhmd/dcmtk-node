const dcmtk = require('../../')();
const split2 = require('split2');

/**
 * Test movescu command. Storescp server must be running
 */
const movescu = dcmtk.movescu({
  args: [
    '--log-level',
    'debug',
    '--study',
    '-k',
    'QueryRetrieveLevel=STUDY',
    '-aet',
    'TESTLISTENER',
    '--call',
    'TEST',
    '-k',
    'AccessionNumber=7777777',
    '-k',
    'PatientID',
    '-k',
    'PatientName',
    '--move',
    'TESTLISTENER',
    'localhost',
    '4141',
  ],
  verbose: true,
});

movescu.on('close', (code, signal) => {
  console.log(`Closed movescu with code ${code} and signal ${signal}`);
});

movescu.on('error', (err) => {
  console.log(`Error on movescu: ${err}`);
});

// movescu.stdout.pipe(split2()).on('data', (data) => {
//   console.log(`STDOUT: ${data}`);
// });

// movescu.stderr.pipe(split2()).on('data', (data) => {
//   console.log(`STDERR: ${data}`);
// });

movescu.parsed.stderr.on('response', (response) => {
  console.log('RESPONSE:', response);
});
