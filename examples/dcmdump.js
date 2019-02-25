const path = require('path');
const dcmtk = require('../')({ verbose: true });

/**
 * Basic file dump
 */
dcmtk.dcmdump(
  {
    args: [
      path.join(__dirname, '../data/dicom-input/space in path/01.dcm'),
      // path.join(__dirname, 'dicom/first/notvalid'),
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
    args: [path.join(__dirname, '../dicom/first/notvalid')],
  },
  (err, output) => {
    console.log('ERR:', err);
    console.log('STDOUT:', output.stdout);
    console.log('STDERR:', output.stderr);
    console.log('PARSED:', output.parsed);
  },
);
