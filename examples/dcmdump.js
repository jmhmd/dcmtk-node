const path = require('path');
const dcmtk = require('../')({ verbose: true });

/**
 * Basic file dump
 */
dcmtk.dcmdump(
  {
    args: [
      path.join(__dirname, '../test/data/dicom-input/space in path/01.dcm'),
      // path.join(__dirname, 'dicom/first/notvalid'),
    ],
  },
  (err, output) => {
    console.log('ERR:', err);
    console.log('OUTPUT:', output);
    console.log('PARSED:', output.parsed);
  },
);

/**
 * search directory
 */
dcmtk.dcmdump(
  {
    args: [
      '--scan-directories',
      path.join(__dirname, '../test/data/dicom-input/cspine mri'),
    ],
  },
  (err, output) => {  
    console.log('ERR:', err);
    console.log('OUTPUT:', output);
    console.log('PARSED:', output.parsed);
  },
);

/**
 * Invalid file
 */
dcmtk.dcmdump(
  {
    args: [path.join(__dirname, '../test/data/dicom-input/first/notvalid')],
  },
  (err, output) => {
    console.log('ERR:', err);
    console.log('OUTPUT:', output);
    console.log('PARSED:', output.parsed);
  },
);
