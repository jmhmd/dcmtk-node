const { echoscu } = require('../../')();
const harness = require('../external-pacs-harness');

describe('online server to echo', () => {
  beforeAll((done) => {
    harness.start(done);
  });

  afterAll(() => harness.stop());

  test('send echo to pacs server', (done) => {
    echoscu(
      {
        args: ['-aet', 'TEST', '-aec', 'TEST', 'localhost', '4141'],
      },
      (err, output) => {
        expect(output.parsed.accepted).toBe(true);
        done();
      },
    );
  });
});

describe('offline server to echo', () => {
  test('send echo to offline pacs server', (done) => {
    echoscu(
      {
        args: ['-aet', 'TEST', '-aec', 'TEST', 'localhost', '4141'],
      },
      (err, output) => {
        expect(err).toEqual(expect.stringContaining('Association Request Failed: 0006:031b Failed to establish association'));
        expect(output).toBe(undefined);
        done();
      },
    );
  });
});
