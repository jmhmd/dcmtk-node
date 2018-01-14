const { echoscu } = require('../../')();

function pingListener(port, callback) {
  echoscu(
    {
      args: ['localhost', port],
    },
    (err, output) => callback(err, output.parsed.accepted),
  );
}

// listener process doesn't return a success message when starting, so we just need
// to ping it until it responds to know it's up.
function onListenerUp(port) {
  return new Promise((resolve, reject) => {
    let maxTries = 2;
    const sleepTime = 500; // 0.5 s
    function checkListener() {
      if (maxTries === 0) return reject(new Error('Error starting listener'));
      return pingListener(port, (err, connected) => {
        if (!err && connected) return resolve();
        maxTries -= 1;
        return setTimeout(checkListener, sleepTime);
      });
    }
    checkListener();
  });
}

module.exports = {
  pingListener,
  onListenerUp,
};
