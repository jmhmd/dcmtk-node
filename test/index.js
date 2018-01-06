const dcmtk = require('../')({ verbose: true });
const path = require('path');

// dcmtk.dcmdump({
//   args: [
//     path.join(__dirname, 'dicom/minimal/first/01.dcm'),
//     // path.join(__dirname, 'dicom/minimal/first/notvalid'),
//   ],
// }, (err, output) => {
//   console.log('ERR:', err);
//   console.log('STDOUT:', output.stdout);
//   console.log('STDERR:', output.stderr);
//   console.log('PARSED:', output.parsed);
// })

// dcmtk.echoscu({
//   args: ['--verbose', 'localhost', '4444'],
// }, (err, output) => {
//   console.log('ERR:', err);
//   console.log('OUT:', output);
// });

/* Test callback error */
// dcmtk.findscu({
//   args: '--study -k QueryRetrieveLevel="STUDY" -aet Pacsbin --call Horos -k PatientID -k PatientName --verbose --cancel 10 localhost 4444',
// });

/* Test findscu */
// // find one patient
// dcmtk.findscu({
//   args: '--study -k QueryRetrieveLevel=STUDY -aet Pacsbin --call Horos -k PatientID=fake-patient-id -k PatientName --verbose --cancel 10 localhost 4444',
// }, (err, output) => {
//   console.log('ERR:', err);
//   console.log('OUT:', output);
//   console.log('RESULTS:', output.parsed.results);
// })

// find multiple patients
dcmtk.findscu({
  args: '--study -k QueryRetrieveLevel=STUDY -aet Pacsbin --call Horos -k PatientID -k PatientName -k AccessionNumber --verbose --cancel 10 localhost 4444',
}, (err, output) => {
  console.log('ERR:', err);
  console.log('OUT:', output);
  console.log('RESULTS:', output.parsed.results);
})

// // find no patients
// dcmtk.findscu({
//   args: '--study -k QueryRetrieveLevel=STUDY -aet Pacsbin --call Horos -k PatientID=doesnt-exist -k PatientName --verbose --cancel 10 localhost 4444',
// }, (err, output) => {
//   console.log('ERR:', err);
//   console.log('OUT:', output);
// })
