const fs = require('fs-extra');
const path = require('path');
const { dcmconv } = require('../../')();

const localOutputDir = path.join(__dirname, '../data/output');
const genericFileToConvert = path.join(__dirname, '../data/dicom-input/space in path/01.dcm');
const outputFilePath = path.join(localOutputDir, '01-out.dcm');

beforeAll(() => fs.ensureDir(localOutputDir));

afterAll(() => fs.emptyDir(localOutputDir));

test('converts a dicom file to another transfer syntax', (done) => {
  dcmconv(
    {
      args: ['--write-xfer-implicit', genericFileToConvert, outputFilePath],
    },
    async (err) => {
      expect(err).toBeFalsy();
      // check the output file exists
      expect(await fs.pathExists(path.join(outputFilePath))).toBe(true);
      done();
    },
  );
});

test('throws error for nonexistent file', (done) => {
  dcmconv(
    {
      args: ['--write-xfer-implicit', './non-existent-file.dcm', outputFilePath],
    },
    async (err) => {
      expect(err).not.toBeFalsy();
      done();
    },
  );
});
