module.exports.dcmdump = function dcmdump(output) {
  const lineMatch = /\(([0-9A-Za-z]+,[0-9A-Za-z]+)\) (..) (?:\((.*)\)|\[(.*)\]|((?:.|\n)*?)) *# *(.*)/; // correctly handle newlines in value
  const hasTag = /^\s*\([0-9A-Za-z]+,[0-9A-Za-z]+\)/;

  function parseLine(line) {
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
  }

  const response = {};
  let multiLine;
  const lines = output.split(/\r?\n/);
  lines.forEach((line) => {
    if (!line) return true;
    // check if matched complete line
    const header = parseLine(line);

    // complete line, add header and handle prior
    // multiline if present
    if (header && header.tag) {
      // add multiline header if present
      const multiHeader = parseLine(multiLine);
      if (multiHeader && multiHeader.tag) {
        response[multiHeader.tag] = multiHeader;
        multiLine = undefined;
      }
      // add current line header
      response[header.tag] = header;
      return true;
    }

    // no match on complete line, may be incomplete line with newline in value
    if (hasTag.test(line)) {
      // first line of multiline header
      multiLine = line;
    } else if (multiLine) {
      multiLine += `\n${line}`;
    }
    return true;
  });

  if (multiLine) {
    // add multiline header if present
    const multiHeader = parseLine(multiLine);
    if (multiHeader && multiHeader.tag) {
      response[multiHeader.tag] = multiHeader;
      multiLine = undefined;
    }
  }

  return response;
};
