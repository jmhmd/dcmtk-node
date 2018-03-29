module.exports = {
  hasTag: /^\s*\([0-9A-Za-z]+,[0-9A-Za-z]+\)/,
  matchResponseNumber: /Find Response: ([0-9]+)/,
  matchTransferSyntax: /# Used TransferSyntax: ([a-zA-Z ]+)/,
  dimseStatus: /DIMSE Status +: (.+)$/,
  errorRegex: /^E: |^F: |^error: /,
  nullByte: /\0/g,
};
