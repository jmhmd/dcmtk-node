const split2 = require('split2');
const { EventEmitter } = require('events');

const regexes = {
  responseStart: /INCOMING DIMSE MESSAGE/,
  responseEnd: /END DIMSE MESSAGE/,
  completed: /Completed Suboperations +: ([0-9]+)/,
  failed: /Failed Suboperations +: ([0-9]+)/,
  remaining: /Remaining Suboperations +: ([0-9]+)/,
  warning: /Warning Suboperations +: ([0-9]+)/,
  dimseStatus: /DIMSE Status +: ([0-9a-zA-Z]{6}): (.+$)/,
};

module.exports = function movescu(stream, outputType) {
  const emitter = new EventEmitter();

  let currentResponse;
  stream.pipe(split2()).on('data', (line) => {
    if (regexes.responseStart.test(line)) {
      currentResponse = {};
      return true;
    }

    if (regexes.completed.test(line)) {
      [, currentResponse.completed] = regexes.completed.exec(line);
      return true;
    }

    if (regexes.failed.test(line)) {
      [, currentResponse.failed] = regexes.failed.exec(line);
      return true;
    }

    if (regexes.remaining.test(line)) {
      [, currentResponse.remaining] = regexes.remaining.exec(line);
      return true;
    }

    if (regexes.warning.test(line)) {
      [, currentResponse.warning] = regexes.warning.exec(line);
      return true;
    }

    if (regexes.dimseStatus.test(line)) {
      [, currentResponse.status, currentResponse.statusCode] = regexes.dimseStatus.exec(line);
      return true;
    }

    if (regexes.responseEnd.test(line)) {
      emitter.emit('response', currentResponse);
      currentResponse = undefined;
      return true;
    }

    return true;
  });

  return emitter;
};
