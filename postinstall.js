const path = require('path');
const fs = require('fs');
const { platform, BINARIES } = require('./src/check-platform')();

const binariesToKeep = [
  'dcmdump',
  'echoscu',
  'findscu',
  'storescp',
  'dcmqrscp',
  'movescu',
  'dcmqridx',
  'dcmconv',
];

const installedAsModule = path.basename(path.resolve(__dirname, '..')) === 'node_modules';

Object.keys(BINARIES).forEach((os) => {
  if (os != platform) {
    const files = fs.readdirSync(BINARIES[os]);
    files.forEach((file) => {
      const filename = path.basename(file, '.exe');
      if (!binariesToKeep.includes(filename)) {
        const filePath = path.resolve(BINARIES[os], file);
        if (fs.accessSync(filePath) === undefined) {
          if (installedAsModule) {
            fs.unlinkSync(filePath);
          } else {
            console.log('Delete', filePath);
          }
        }
      }
    });
  }
});
