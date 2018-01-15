const { movescu, storescp } = require('../../')();
const { onListenerUp } = require('./util');
const harness = require('../external-pacs-harness');
const path = require('path');
const fs = require('fs-extra');

let storeServer;
const localOutputDir = path.join(__dirname, '../data/output');

beforeAll(async (done) => {
  await fs.ensureDir(localOutputDir);

  // start storescp server
  storeServer = storescp({
    args: ['-od', localOutputDir, '-su', 'PB', '-aet', 'TEST', '--fork', '4242'],
  });
  storeServer.on('close', (code, signal) => {
    // console.log(`Closed storescu server with code ${code} and signal ${signal}`);
  });
  storeServer.on('error', (err) => {
    console.log(`Error on storescu server: ${err}`);
  });

  await onListenerUp('4242');
  await harness.start();
  await fs.emptyDir(localOutputDir);
  done();
});

afterAll(async (done) => {
  harness.stop();
  storeServer.kill();
  await fs.emptyDir(localOutputDir);
  done();
});

test('moves a series of images from pacs to local', (done) => {
  const mover = movescu({
    args: [
      '--study',
      '-k',
      'QueryRetrieveLevel=STUDY',
      '-aet',
      'TESTLISTENER',
      '--call',
      'TEST',
      '-k',
      'AccessionNumber=7777777',
      '-k',
      'PatientID',
      '-k',
      'PatientName',
      '--move',
      'TESTLISTENER',
      'localhost',
      '4141',
    ],
  });

  mover.on('close', async (code, signal) => {
    // console.log(`Closed movescu with code ${code} and signal ${signal}`);

    expect(await fs.pathExists('test/data/output/PB_2.25.5118880879501548101496826410298115715314/CT.1.2.826.0.1.3680043.2.1143.1563480613904460876041307875247925092')).toBe(true);
    expect(await fs.pathExists('test/data/output/PB_2.25.5118880879501548101496826410298115715314/CT.1.2.826.0.1.3680043.2.1143.3086950219072753190511793613081870134')).toBe(true);
    expect(await fs.pathExists('test/data/output/PB_2.25.5118880879501548101496826410298115715314/CT.1.2.826.0.1.3680043.2.1143.4391742151522474134629769548169430042')).toBe(true);
    done();
  });

  mover.on('error', (err) => {
    throw new Error(`Error on movescu: ${err}`);
  });

  // mover.parsed.stderr.on('response', (response) => {
  //   console.log('RESPONSE:', response);
  // });
});
