# dcmtk-node

Node.js wrapper for the OFFIS dcmtk DICOM library with parsed output. Bundles the pre-compiled binaries for Windows, macOS, and Linux.

Included commands so far:

```
dcmdump
echoscu
findscu
storescp
dcmqrscp
movescu
dcmqridx
dcmconv
```

## Usage
`yarn`
or
`npm install`

```js
const dcmtk = require('dcmtk-node')({
  verbose: true, // default: false
});


/**
 * echoscu
 */
dcmtk.echoscu(
  {
    args: ['-aet', 'TEST', '-aec', 'TEST', 'localhost', '4141'],
  },
  (err, output) => {
    expect(output.parsed.accepted).toBe(true);
    done();
  }
);


/**
 * dcmdump
 */
dcmtk.dcmdump(
  {
    args: ['path/to/dicom/file.dcm'],
  },
  (err, output) => {
    console.log('ERR:', err);
    console.log('STDOUT:', output.stdout);
    console.log('STDERR:', output.stderr);
    console.log('PARSED:', output.parsed); // output parsed into JSON object
  }
);


/**
 * findscu
 */
dcmtk.findscu(
  {
    args: [
      '--study',
      '-k',
      'QueryRetrieveLevel=STUDY',
      '-aet',
      'TESTLISTENER',
      '-aec',
      'TEST',
      '-k',
      'AccessionNumber=7777777',
      '-k',
      'PatientName',
      'localhost',
      '4141',
    ],
  },
  (err, output) => {
    expect(err).toBe(null);
    expect(output.parsed.results.length).toBe(1);
    expect(output.parsed.results[0]['0008,0050'].value.trim()).toBe('7777777');
    done();
  }
);


/**
 * movescu
 */
const movescu = dcmtk.movescu({
  args: [
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
});

movescu.on('close', (code, signal) => {
  console.log(`Closed movescu with code ${code} and signal ${signal}`);
});

movescu.on('error', err => {
  console.log(`Error on movescu: ${err}`);
});

mover.parsed.on('response', response => {
  responses.push(response); // responses emitted in real time as JSON objects
});


/**
 * storescp
 */
const storeServer = dcmtk.storescp({
  args: ['-od', localOutputDir, '-su', 'PB', '-aet', 'TEST', '--fork', storeServerPort],
});
storeServer.on('error', err => {
  console.log(`Error on storescu server: ${err}`);
});

storeServer.on('close', (code, signal) => {
  console.log(`Closed storescu server with code ${code} and signal ${signal}`);
});

storeServer.stdout.pipe(split2()).on('data', data => {
  console.log(`STDOUT: ${data}`);
});

storeServer.stderr.pipe(split2()).on('data', data => {
  console.log(`STDERR: ${data}`);
});
```
