# dcmtk-node
Node.js wrapper for the OFFIS dcmtk DICOM library

## Usage
```js
const dcmtk = require('dcmtk-node')({
  verbose: true, // default: false
});

/**
 * echoscu
 */
dcmtk.echoscu(
  {
    args: 'localhost 4444', // can also pass array of arguments, i.e. ['localhost', '4444']
  },
  (err, output) => {
    console.log('ERR:', err);
    console.log('OUT:', output);
  },
);

/**
 * dcmdump
 */
dcmtk.dcmdump(
  {
    args: [
      'path/to/dicom/file.dcm',
    ],
  },
  (err, output) => {
    console.log('ERR:', err);
    console.log('STDOUT:', output.stdout);
    console.log('STDERR:', output.stderr);
    console.log('PARSED:', output.parsed); // output parsed into JSON object
  },
);

/**
 * findscu
 */
dcmtk.findscu(
  {
    args:
      '--study -k QueryRetrieveLevel=STUDY -aet CALLING_AET --call CALLED_AET -k PatientID=patient-id -k PatientName localhost 4444',
  },
  (err, output) => {
    console.log('ERR:', err);
    console.log('OUT:', output);
    console.log('RESULTS:', output.parsed.results); // results parsed as JSON object
  },
);

/**
 * movescu
 */
const movescu = dcmtk.movescu({
  args:
    '--study -k QueryRetrieveLevel=STUDY -aet CALLING_AET --call CALLED_AET -k AccessionNumber=111111111 -k PatientID -k PatientName --move RECEIVING_AET localhost 4444',
});

movescu.on('close', (code, signal) => {
  console.log(`Closed movescu with code ${code} and signal ${signal}`);
});

movescu.on('error', (err) => {
  console.log(`Error on movescu: ${err}`);
});

movescu.stdout.pipe(split2()).on('data', (data) => {
  console.log(`STDOUT: ${data}`);
});

movescu.stderr.pipe(split2()).on('data', (data) => {
  console.log(`STDERR: ${data}`);
});

movescu.parsed.stderr.on('response', (response) => {
  console.log('RESPONSE:', response); // responses emitted in real time as JSON objects
});

/**
 * storescp
 */
const storescp = dcmtk.storescp({
  args: `-od output/dir -aet CALLING_AET --fork 4242`,
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
```
