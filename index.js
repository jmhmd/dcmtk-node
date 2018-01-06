const path = require('path');
const checkPlatform = require('./src/check-platform');
const basicWrapper = require('./src/basic-wrapper');

const platform = checkPlatform();

module.exports = (settings) => {
  function getWrapper(command, options) {
    return basicWrapper({
      command,
      platform,
      settings,
      outputInStderr: options && options.outputInStderr,
    })
  }

  return {
    dcmdump: getWrapper('dcmdump'),
    echoscu: getWrapper('echoscu', { outputInStderr: true }),
    findscu: getWrapper('findscu', { outputInStderr: true }),
    dcm2json: getWrapper('dcm2json'),
  };
};
