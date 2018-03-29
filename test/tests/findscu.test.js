const { findscu } = require('../../')();
const harness = require('../external-pacs-harness');

beforeAll((done) => {
  harness.start(done);
});

afterAll(() => harness.stop());

test('finds patient with Accession match', (done) => {
  findscu(
    {
      args: [
        '--study',
        '-k',
        'QueryRetrieveLevel=STUDY',
        '-aet',
        'NONE',
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
    },
  );
});

test('finds patient with Accession match and gets Modality', (done) => {
  findscu(
    {
      args: [
        '--study',
        '-k',
        'QueryRetrieveLevel=STUDY',
        '-aet',
        'NONE',
        '-aec',
        'TEST',
        '-k',
        'AccessionNumber=7777777',
        '-k',
        'PatientName',
        '-k',
        'Modality',
        'localhost',
        '4141',
      ],
    },
    (err, output) => {
      expect(err).toBe(null);
      expect(output.parsed.results.length).toBe(1);
      expect(output.parsed.results[0]['0008,0060'].value.trim()).toBe('CT');
      done();
    },
  );
});

test('finds patient with partial patient name match', (done) => {
  findscu(
    {
      args: [
        '--study',
        '-k',
        'QueryRetrieveLevel=STUDY',
        '-aet',
        'NONE',
        '-aec',
        'TEST',
        '-k',
        'AccessionNumber',
        '-k',
        'PatientName=Anon Holy*',
        'localhost',
        '4141',
      ],
    },
    (err, output) => {
      expect(err).toBe(null);
      expect(output.parsed.results.length).toBe(1);
      expect(output.parsed.results[0]['0008,0050'].value.trim()).toBe('7777777');
      done();
    },
  );
});

test('fails on string arguments', (done) => {
  findscu(
    {
      args:
        '--study -k QueryRetrieveLevel=STUDY -aet NONE -aec TEST -k AccessionNumber -k PatientName=Anon Holy* localhost 4141',
    },
    (err, output) => {
      expect(err).toBe('Parameter "args" must be array of strings');
      expect(output).toBe(undefined);
      done();
    },
  );
});
