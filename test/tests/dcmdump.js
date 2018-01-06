const dcmtk = require('../../')({ verbose: true });
const path = require('path');

/**
 * Basic file dump
 */
dcmtk.dcmdump(
  {
    args: [
      path.join(__dirname, '../dicom/minimal/first/01.dcm'),
      // path.join(__dirname, 'dicom/minimal/first/notvalid'),
    ],
  },
  (err, output) => {
    console.log('ERR:', err);
    console.log('STDOUT:', output.stdout);
    console.log('STDERR:', output.stderr);
    console.log('PARSED:', output.parsed);
  },
);

/**
 * Invalid file
 */
dcmtk.dcmdump(
  {
    args: [
      path.join(__dirname, '../dicom/minimal/first/notvalid'),
    ],
  },
  (err, output) => {
    console.log('ERR:', err);
    console.log('STDOUT:', output.stdout);
    console.log('STDERR:', output.stderr);
    console.log('PARSED:', output.parsed);
  },
);
