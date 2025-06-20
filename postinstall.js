const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const { execSync } = require('child_process');
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
  'storescu',
  'getscu',
  'dcmodify'
];
 
const installedAsModule = path.basename(path.resolve(__dirname, '..')) === 'node_modules';
 
Object.keys(BINARIES).forEach((os) => {
  if (os.slice(0, 3) === platform.slice(0, 3)) {
    const files = fs.readdirSync(BINARIES[os]);
    files.forEach((file) => {
      const filename = path.basename(file, path.extname(file));
 
      // Filter out files not in our keep list
      if (!binariesToKeep.includes(filename)) {
        const filePath = path.resolve(BINARIES[os], file);
        if (fs.existsSync(filePath)) {
          if (installedAsModule) {
            fs.unlinkSync(filePath);
          } else {
            console.log('Delete', filePath);
          }
        }
      } else {
        // ✅ Make sure all kept binaries are executable and unquarantined (on macOS)
        const fullPath = path.resolve(BINARIES[os], file);
        if (platform === 'darwin') {
          try {
            execSync(`chmod +x "${fullPath}"`);
            execSync(`xattr -rd com.apple.quarantine "${fullPath}"`);
            console.log(`✅ Fixed permissions for ${file}`);
          } catch (err) {
            console.warn(`⚠️ Couldn't fix ${file}:`, err.message);
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
 
 