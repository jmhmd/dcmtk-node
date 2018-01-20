const { echoscu } = require('../../')();
const harness = require('../external-pacs-harness');

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
