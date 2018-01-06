const parseDicomHeaderLine = require('./dicom-header-line');
const regexes = require('./regexes');

module.exports = function findscu(output) {
  const response = {};
  let multiLine;
  const lines = output.split(/\r?\n/);

  // get all the lines that represent actual find results
  const responseLines = lines.filter(l => regexes.isResponseLine.test(l));
  // get all the lines that represent query info
  const infoLines = lines.filter(l => regexes.isInfoLine.test(l));

  /**
   * Parse response lines
   */
  response.results = [];
  let currentItem;
  responseLines.forEach((line) => {
    if (regexes.matchResponseNumber.test(line)) {
      // start new item
      const [, responseNumber] = regexes.matchResponseNumber.exec(line);
      currentItem = { responseNumber };
      response.results.push(currentItem);
      return true;
    }

    if (regexes.matchTransferSyntax.test(line)) {
      [, currentItem.transferSyntax] = regexes.matchTransferSyntax.exec(line);
      return true;
    }

    // check if matched complete line
    const header = parseDicomHeaderLine(line);

    // if complete line, add header and handle prior multiline if present
    if (header && header.tag) {
      // add multiline header if present
      const multiHeader = parseDicomHeaderLine(multiLine);
      if (multiHeader && multiHeader.tag) {
        currentItem[multiHeader.tag] = multiHeader;
        multiLine = undefined;
      }
      // add current line header
      currentItem[header.tag] = header;
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

  // clean up after all lines parsed, if there is multiline data left, append it
  if (multiLine) {
    // add multiline header if present
    const multiHeader = parseDicomHeaderLine(multiLine);
    if (multiHeader && multiHeader.tag) {
      currentItem[multiHeader.tag] = multiHeader;
      multiLine = undefined;
    }
  }

  /**
   * Parse query info lines
   */
  infoLines.forEach((line) => {
    if (!line) return true;

    if (regexes.dimseStatus.test(line)) {
      [, response.dimseStatus] = regexes.dimseStatus.exec(line);
    }

    return true;
  });

  return response;
};
