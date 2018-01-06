const dcmtk = require('../../')({ verbose: true });

/* Test callback error */
dcmtk.findscu({
  args:
    '--study -k QueryRetrieveLevel="STUDY" -aet Pacsbin --call Horos -k PatientID -k PatientName --verbose --cancel 10 localhost 4444',
});

/* Test findscu */

// find one patient
dcmtk.findscu(
  {
    args:
      '--study -k QueryRetrieveLevel=STUDY -aet Pacsbin --call Horos -k PatientID=fake-patient-id -k PatientName --verbose --cancel 10 localhost 4444',
  },
  (err, output) => {
    console.log('ERR:', err);
    console.log('OUT:', output);
    console.log('RESULTS:', output.parsed.results);
  },
);

// find multiple patients
dcmtk.findscu(
  {
    args:
      '--study -k QueryRetrieveLevel=STUDY -aet Pacsbin --call Horos -k PatientID -k PatientName -k AccessionNumber --verbose --cancel 10 localhost 4444',
  },
  (err, output) => {
    console.log('ERR:', err);
    console.log('OUT:', output);
    console.log('RESULTS:', output.parsed.results);
  },
);

// find no patients
dcmtk.findscu(
  {
    args:
      '--study -k QueryRetrieveLevel=STUDY -aet Pacsbin --call Horos -k PatientID=doesnt-exist -k PatientName --verbose --cancel 10 localhost 4444',
  },
  (err, output) => {
    console.log('ERR:', err);
    console.log('OUT:', output);
  },
);
