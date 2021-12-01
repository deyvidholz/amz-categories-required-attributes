const path = require('path');
const { readFile } = require('../helpers/files');

function loadAttributes() {
  const attributesFilePath = path.join(
    __dirname,
    '..',
    'json',
    'attributes.json'
  );
  return readFile(attributesFilePath);
}

module.exports = { loadAttributes };
