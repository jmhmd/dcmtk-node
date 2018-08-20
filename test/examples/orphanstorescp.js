/**
 * We should not be able to create an orphan process by killing the parent due to wrapping the spawn
 * call in a forked process, then listening for 'disconnect'
 */
const { storescp } = require('../..')();
const { onListenerUp } = require('../tests/util');
const path = require('path');
const ps = require('ps-node');

const storeServerPort = '4002';
const localOutputDir = path.join(__dirname, '../data/output');

const storeServer = storescp({
  args: ['-od', localOutputDir, '-su', 'PB', '-aet', 'TEST', '--fork', storeServerPort],
});
storeServer.on('error', (err) => {
  console.log(`Error on storescu server: ${err}`);
});
onListenerUp(storeServerPort).then(() => {
  console.log('up!');
  console.log('killing process');
  setTimeout(() => {
    process.kill(process.pid, 'SIGKILL');
  }, 2000);
});

// async function findOrphans() {
//   return new Promise((resolve, reject) => {
//     ps.lookup(
//       {
//         command: 'storescp',
//       },
//       (err, processes) => {
//         if (err) {
//           return reject(err);
//         }
//         const orphans = processes.filter(p => p.ppid === '1');
//         return resolve(orphans);
//       },
//     );
//   });
// }

// findOrphans();
