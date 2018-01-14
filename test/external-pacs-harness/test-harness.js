const dcmtk = require('../../')();
const harness = require('../external-pacs-harness');

harness.start((err) => {
  if (!err) {
    console.log('harness started');
  }

  setTimeout(() => {
    dcmtk.findscu(
      {
        args:
          '--study -k QueryRetrieveLevel=STUDY -aet TEST -aec TEST -k AccessionNumber -k PatientName localhost 4141',
      },
      (finderr, output) => {
        console.log('FINDERR:', finderr);
        console.log(output);
        // expect(output.parsed.results[0].)
      },
    );
  }, 1000);
});

