const { dcmdump } = require('../../')();
const path = require('path');

const genericFileToDump = path.join(__dirname, '../data/dicom-input/space in path/01.dcm');
const newlineFileToDump = path.join(__dirname, '../data/dicom-input/newline series desc/624.dcm');

test('dumps a dicom file and returns parsed results', (done) => {
  dcmdump(
    {
      args: [genericFileToDump],
    },
    (err, output) => {
      expect(err).toBeFalsy();
      // check a few headers
      expect(output.parsed['0008,0022'].value).toBe('20150513');
      expect(output.parsed['0008,0050'].value).toBe('b72779a5-bb3e-414e-b75d-584c52e25db6');
      done();
    },
  );
});

test('handles newline in header value appropriately', (done) => {
  dcmdump(
    {
      args: [newlineFileToDump],
    },
    (err, output) => {
      expect(err).toBeFalsy();
      expect(output.parsed['0008,103e'].value).toBe('[CXR with\nnewline]');
      done();
    },
  );
});
