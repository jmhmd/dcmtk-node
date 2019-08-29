const path = require('path');
const os = require('os');

const platform = os.platform();

const SUPPORTED_PLATFORMS = [
  'win32',
  'win64',
  'darwin', // macOS, OSX
  'linux',
];

module.exports = (libPath = path.resolve(__dirname, '..', 'lib')) => {
  const supported = SUPPORTED_PLATFORMS.includes(platform);
  if (!supported) throw new Error(`The current platform "${platform}" is not supported.`);

  const BINARIES = {
    win32: path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.2-win32-dynamic', 'bin').replace('app.asar', 'app.asar.unpacked'),
    win64: path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.2-win32-dynamic', 'bin').replace('app.asar', 'app.asar.unpacked'),
    darwin: path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.0-darwin', 'bin').replace('app.asar', 'app.asar.unpacked'),
    linux: path.resolve(libPath, 'dcmtk', 'dcmtk-3.6.2-linux-x86_64-static', 'bin').replace('app.asar', 'app.asar.unpacked'),
  };

  const binaryPath = BINARIES[platform];

  const DCMDICTPATH = path.resolve(binaryPath, '..', 'share', 'dcmtk', 'dicom.dic');

  return {
    platform,
    DCMDICTPATH,
    BINARIES,
    binaryPath,
  };
};
