const { storescp } = require('../../')();
const { onListenerUp } = require('./util');
const fs = require('fs-extra');
const path = require('path');

let storeServer;
const localOutputDir = path.join(__dirname, '../data/output');

beforeAll(() => fs.ensureDir(localOutputDir));

afterAll((done) => {
  storeServer.kill();
  done();
});

test('starts a dicom listener', () => {
  storeServer = storescp({
    args: ['-od', localOutputDir, '-su', 'PB', '-aet', 'TEST', '--fork', '4242'],
  });
  storeServer.on('error', (err) => {
    console.log(`Error on storescu server: ${err}`);
  });

  return onListenerUp('4242');
});
