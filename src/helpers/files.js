const fs = require('fs');

function readFile(filePath) {
  const buffer = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(buffer);
  return data;
}

function saveJSONToFile(data, fileName, minified = false) {
  if (minified) {
    fs.writeFileSync(fileName, JSON.stringify(data, null));
    return;
  }

  fs.writeFileSync(fileName, JSON.stringify(data, null, '\t'));
}

module.exports = {
  readFile,
  saveJSONToFile,
};
