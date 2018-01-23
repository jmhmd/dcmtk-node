const path = require('path');
const checkPlatform = require('./src/check-platform');
const basicWrapper = require('./src/basic-wrapper');
const streamingWrapper = require('./src/streaming-wrapper');

const platform = checkPlatform();

const DCMDICTPATH = path.join(platform.binaryPath, '..', 'share', 'dcmtk', 'dicom.dic');

module.exports = (settings = {}) => {
  Object.assign(settings, {
    loglevel: 'info',
    env: {
      DCMDICTPATH,
    },
  });
  function getWrapper(command, _options) {
    const options = _options;

    // It seems that on windows all output goes to stdout while on macOS, output of some
    // tools goes to stderr. This has not been thoroughly tested.
    if (options && platform.platform.indexOf('win') === 0) {
      options.outputInStderr = false;
    }

    let wrapper;
    switch (command) {
      case 'storescp':
        wrapper = streamingWrapper({
          command,
          platform,
          settings,
        });
        break;

      case 'dcmqrscp':
        wrapper = streamingWrapper({
          command,
          platform,
          settings,
        });
        break;

      case 'movescu':
        wrapper = streamingWrapper({
          command,
          platform,
          settings,
        });
        break;

      default:
        wrapper = basicWrapper({
          command,
          platform,
          settings,
          outputInStderr: options && options.outputInStderr,
        });
        break;
    }
    return wrapper;
  }

  return {
    dcmdump: getWrapper('dcmdump'),
    echoscu: getWrapper('echoscu', { outputInStderr: true }),
    findscu: getWrapper('findscu', { outputInStderr: true }),
    storescp: getWrapper('storescp'),
    dcmqrscp: getWrapper('dcmqrscp'),
    movescu: getWrapper('movescu'),
    dcmqridx: getWrapper('dcmqridx'),
    dcmconv: getWrapper('dcmconv'),
  };
};
