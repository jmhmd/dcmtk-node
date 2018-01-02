const path = require('path');
const checkPlatform = require('./src/check-platform');
const basicWrapper = require('./src/basic-wrapper');

const platform = checkPlatform();

module.exports = (settings) => {
  return {
    dcmdump: basicWrapper({
        command: 'dcmdump',
        platform,
        settings,
      })
  }
};
