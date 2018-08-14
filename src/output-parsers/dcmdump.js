const parseDicomHeaderLine = require('./dicom-header-line');
const regexes = require('./regexes');

function parseFileDumpBlock(output) {
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
}

function splitByFile(output) {
  // split output into blocks of lines by filename
  const fileSplitRegex = /^# dcmdump \(([0-9]+)\/([0-9]+)\): (.+)$/gm;
  const lines = output.split(fileSplitRegex).filter(Boolean); // split output by capture groups
  const chunks = [];
  const size = 4;
  // split result array by file (4 capture groups per file)
  while (lines.length > 0) chunks.push(lines.splice(0, size));
  const fileDumps = chunks.map((chunk) => {
    // check for parsing errors for the file
    let errors = chunk[3].match(regexes.captureErrors);
    if (errors) errors = errors.filter(Boolean);
    return {
      fileNumber: chunk[0],
      totalFilesDumped: chunk[1],
      filePath: chunk[2],
      raw: chunk[3],
      parsed: errors && errors.length > 0 ? {} : parseFileDumpBlock(chunk[3]),
      errors,
    };
  });
  return fileDumps;
}

module.exports = function dcmdump(output, args) {
  if (args.includes('--print-filename') || args.includes('+F')) {
    return splitByFile(output);
  }
  return parseFileDumpBlock(output);
};
