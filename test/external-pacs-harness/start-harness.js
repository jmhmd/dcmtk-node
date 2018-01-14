const harness = require('./');

harness.start((err) => {
  if (!err) {
    console.log('harness started');
  }
});
