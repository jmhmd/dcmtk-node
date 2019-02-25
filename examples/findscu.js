const dcmtk = require('../')({ verbose: true });

/* Test callback error */
dcmtk.findscu(
  {
    args: [
      '--study',
      '-k',
      'QueryRetrieveLevel="STUDY"',
      '-aet',
      'Pacsbin',
      '--call',
      'Horos',
      '-k',
      'PatientID',
      '-k',
      'PatientName',
      '--verbose',
      '--cancel',
      '10',
      'localhost',
      '4444',
    ],
  },
  (err, output) => {
    console.log('ERR:', err);
    console.log('OUT:', output);
    console.log('RESULTS:', output.parsed.results);
  },
);

/* Test findscu */
dcmtk.findscu(
  {
    args: [
      '--study',
      '-k',
      'QueryRetrieveLevel=STUDY',
      '-aet',
      'DEEPLEARN',
      '--call',
      'ORTHANC',
      '-k',
      'PatientID',
      '-k',
      'PatientName',
      '-k',
      'AccessionNumber=7777777',
      '-k',
      'StudyInstanceUID',
      '--cancel',
      '10',
      'localhost',
      '4242',
    ],
  },
  (err, output) => {
    console.log('ERR:', err);
    console.log('OUT:', output);
    console.log('RESULTS:', output.parsed.results);
  },
);

dcmtk.findscu(
  {
    args: [
      '--study',
      '-k',
      'QueryRetrieveLevel=STUDY',
      '-aet',
      'Pacsbin',
      '-aec',
      'Horos',
      '-k',
      'AccessionNumber=21254202',
      '-k',
      'PatientName',
      '-k',
      'ModalitiesInStudy', // STUDY level only
      '-k',
      '(0020,1208)',
      '-k',
      'StudyInstanceUID=1.2.840.114350.2.331.2.798268.2.27600021.1',
      'localhost',
      '4444',
    ],
  },
  (err, output) => {
    console.log(output.stderr);
  },
);

// find one patient
dcmtk.findscu(
  {
    args: [
      '--study',
      '-k',
      'QueryRetrieveLevel=STUDY',
      '-aet',
      'Pacsbin',
      '--call',
      'Horos',
      '-k',
      'PatientID=fake-patient-id',
      '-k',
      'PatientName',
      '--cancel',
      '10',
      'localhost',
      '4444',
    ],
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
    args: [
      '--study',
      '-k',
      'QueryRetrieveLevel=STUDY',
      '-aet',
      'Pacsbin',
      '--call',
      'Horos',
      '-k',
      'PatientID',
      '-k',
      'PatientName',
      '-k',
      'AccessionNumber',
      '--cancel',
      '10',
      'localhost',
      '4444',
    ],
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
    args: [
      '--study',
      '-k',
      'QueryRetrieveLevel=STUDY',
      '-aet',
      'Pacsbin',
      '--call',
      'Horos',
      '-k',
      'PatientID=doesnt-exist',
      '-k',
      'PatientName',
      '--cancel',
      '10',
      'localhost',
      '4444',
    ],
  },
  (err, output) => {
    console.log('ERR:', err);
    console.log('OUT:', output);
  },
);
