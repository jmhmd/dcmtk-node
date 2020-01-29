const spawn = require('cross-spawn');

let child;

function killSpawnAndExit() {
  if (child) {
    child.kill();
  }
  process.exit();
}

process.on('message', (message) => {
  if (message.signal === 'spawn') {
    // { stdio: 'inherit' } makes the spawned process share the parent's stdios (i.e. this script)
    child = spawn(message.execString, message.args, { env: message.env, stdio: 'inherit' });
    child.on('exit', code => process.exit(code));
  }
});

process.on('exit', () => {
  killSpawnAndExit();
});

process.on('SIGTERM', () => {
  killSpawnAndExit();
});

process.on('SIGINT', () => {
  killSpawnAndExit();
});

process.on('disconnect', () => {
  killSpawnAndExit();
});
