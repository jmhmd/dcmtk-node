const path = require('path');
const { dcmdump } = require('../../')({
  libPath: path.resolve(__dirname, '..', '..', 'lib'),
});

const genericFileToDump = path.join(__dirname, '../data/dicom-input/space in path/01.dcm');

test('dumps a dicom file and returns parsed results, using passed `libPath` option', (done) => {
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
