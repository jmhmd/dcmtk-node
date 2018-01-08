const regexes = {
  accepted: /Association Accepted/,
};

module.exports = function echoscu(output) {
  const response = {
    accepted: false,
  };
  const lines = output.split(/\r?\n/);
  if (lines.some(l => regexes.accepted.test(l))) {
    response.accepted = true;
  }

  return response;
};
