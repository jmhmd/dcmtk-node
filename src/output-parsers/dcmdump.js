const parseDicomHeaderLine = require('./dicom-header-line');
const regexes = require('./regexes');

module.exports = function dcmdump(output) {
  const response = {};
  let multiLine;
  const lines = output.split(/\r?\n/);
  lines.forEach((line) => {
    if (!line) return true;
    // check if matched complete line
    const header = parseDicomHeaderLine(line);

    // complete line, add header and handle prior
    // multiline if present
    if (header && header.tag) {
      // add multiline header if present
      const multiHeader = parseDicomHeaderLine(multiLine);
      if (multiHeader && multiHeader.tag) {
        response[multiHeader.tag] = multiHeader;
        multiLine = undefined;
      }
      // add current line header
      response[header.tag] = header;
      return true;
    }

    // no match on complete line, may be incomplete line with newline in value
    if (regexes.hasTag.test(line)) {
      // first line of multiline header
      multiLine = line;
    } else if (multiLine) {
      multiLine += `\n${line}`;
    }
    return true;
  });

  if (multiLine) {
    // add multiline header if present
    const multiHeader = parseDicomHeaderLine(multiLine);
    if (multiHeader && multiHeader.tag) {
      response[multiHeader.tag] = multiHeader;
      multiLine = undefined;
    }
  }

  return response;
};
