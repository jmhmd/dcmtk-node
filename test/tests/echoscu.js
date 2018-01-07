const dcmtk = require('../../')({ verbose: true });

/**
 * Echo DICOM server at localhost:4444
 */
dcmtk.echoscu(
  {
    args: ['localhost', '4444'],
  },
  (err, output) => {
    console.log('ERR:', err);
    console.log('OUT:', output);
  },
);

/**
 * Echo nonexistent DICOM server
 */
// dcmtk.echoscu(
//   {
//     args: ['localhost', '4321'],
//   },
//   (err, output) => {
//     console.log('ERR:', err);
//     console.log('OUT:', output);
//   },
// );
