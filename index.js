const checkPlatform = require('./src/check-platform');
const basicWrapper = require('./src/basic-wrapper');
const streamingWrapper = require('./src/streaming-wrapper');


module.exports = (settings = {}) => {
  const { libPath } = settings;
  const platform = checkPlatform(libPath);

  Object.assign(settings, {
    loglevel: 'info',
    env: {
      DCMDICTPATH: platform.DCMDICTPATH,
    },
  });
  function getWrapper(command) {
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
          settings: Object.assign({}, settings, { loglevel: 'debug' }),
        });
        break;

      default:
        wrapper = basicWrapper({
          command,
          platform,
          settings,
        });
        break;
    }
    return wrapper;
  }

  return {
    dcmdump: getWrapper('dcmdump'),
    echoscu: getWrapper('echoscu'),
    findscu: getWrapper('findscu'),
    storescp: getWrapper('storescp'),
    dcmqrscp: getWrapper('dcmqrscp'),
    movescu: getWrapper('movescu'),
    dcmqridx: getWrapper('dcmqridx'),
    dcmconv: getWrapper('dcmconv'),
    platform,
  };
};
