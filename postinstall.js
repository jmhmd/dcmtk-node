const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
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
  // on our platform, delete unnecessary binaries. on other platforms, delete all binaries
  // compare only the first 3 characters, so win32 and win64 will both match on windows
  if (os.slice(0,3) == platform.slice(0,3)) {
    const files = fs.readdirSync(BINARIES[os]);
    files.forEach((file) => {
      // only delete .exe on windows, not .dll
      if (os == 'win32' || os == 'win64') {
        if (file.slice(-3) !== 'exe') {
          if (!installedAsModule) {
            console.log('Not .exe, do not delete:', file);
          }
          return true;
        }
      }
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
  } else {
    const dirPath = path.resolve(BINARIES[os], '..');
    if (installedAsModule) {
      rimraf.sync(dirPath);
    } else {
      console.log('Delete', dirPath);
    }
  }
});
