const lineMatch = /\(([0-9A-Za-z]+,[0-9A-Za-z]+)\) (..) (?:\((.*)\)|\[(.*)\]|((?:.|\n)*?)) *# *(.*)/; // correctly handle newlines in value

module.exports = function parseLine(line) {
  /* eslint no-cond-assign: 0 */
  let m;
  let result;
  if ((m = lineMatch.exec(line)) !== null) {
    // The result can be accessed through the `m`-variable.
    result = {
      tag: m[1].toLowerCase(),
      vr: m[2],
      value: m[3] || m[4] || m[5],
      description: m[6],
    };
    if (result.value && result.value === 'no value available') {
      result.value = '';
    }
  }
  return result;
};
