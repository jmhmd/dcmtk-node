module.exports = {
  hasTag: /^\s*\([0-9A-Za-z]+,[0-9A-Za-z]+\)/,
  matchResponseNumber: /Find Response: ([0-9]+)/,
  matchTransferSyntax: /# Used TransferSyntax: ([a-zA-Z ]+)/,
  dimseStatus: /DIMSE Status +: (.+)$/,
  errorRegex: /^E: |^F: |^error: /,
  cMoveErrorStatus: /DIMSE Status.+: (?:0xa|0xc)/i, // ftp://dicom.nema.org/medical/Dicom/2013/output/chtml/part04/sect_C.4.html#table_C.4-2
  captureErrors: /(?:^E: |^F: |^error: )(.+$)/gm,
  nullByte: /\0/g,
};
