const dcmtk = require('../../')();
const split2 = require('split2');

/**
 * Test movescu command. Storescp server must be running
 */
const movescu = dcmtk.movescu({
  args: [
    '--study',
    '-k',
    'QueryRetrieveLevel=STUDY',
    '-aet',
    'Pacsbin',
    '--call',
    'Horos',
    '-k',
    'AccessionNumber=11250670',
    '-k',
    'PatientID',
    '-k',
    'PatientName',
    '--move',
    'Pacsbin',
    'localhost',
    '4444',
  ],
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
