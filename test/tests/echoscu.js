const dcmtk = require('../../')({ verbose: true });

/**
 * Echo DICOM server at localhost:4444
 */
dcmtk.echoscu(
  {
    args: ['--verbose', 'localhost', '4444'],
  },
  (err, output) => {
    console.log('ERR:', err);
    console.log('OUT:', output);
  },
);
