const path = require('path');
const os = require('os');

const SUPPORTED_PLATFORMS = [
  'win32',
  'win64',
  'darwin', // macOS, OSX
  'linux',
]

const BINARIES = {
  win32: path.join(__dirname, '..', 'lib', 'dcmtk', 'dcmtk-3.6.2-win32-dynamic', 'bin'),
  win64: path.join(__dirname, '..', 'lib', 'dcmtk', 'dcmtk-3.6.2-win32-dynamic', 'bin'),
  darwin: path.join(__dirname, '..', 'lib', 'dcmtk', 'dcmtk-3.6.0-darwin', 'bin'),
  linux: path.join(__dirname, '..', 'lib', 'dcmtk', 'dcmtk-3.6.2-linux-x86_64-static', 'bin'),
}

module.exports = () => {
  const platform = os.platform();
  const supported = SUPPORTED_PLATFORMS.includes(platform);
  if (!supported) throw new Error(`The current platform "${platform}" is not supported.`);
  return {
    platform: platform,
    binaryPath: BINARIES[platform],
  }
}
