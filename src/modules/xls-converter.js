const xlsx = require('node-xlsx');
const { saveJSONToFile } = require('../helpers/files');
const { getFilePath } = require('../helpers/general');

const columnReplacers = {
  'X-Path': 'XPath',
  'IMDS-PTD': 'IMDSPTD',
  'XSD ATRIBUTE': 'Attribute',
  ProductType: 'ProductType_Report',
  'MAtAttribute  FLAT_FILE': 'MAtAttribute',
  'MAtAttributeLabel NOME DO ATRIBUTE EM MAT': 'AttributeLabel',
};

function readXlsFile(filePath) {
  if (!filePath.match(/\.\w+$/)) {
    filePath = `${filePath}.xls`;
  }

  return xlsx.parse(filePath);
}

function readAndConvertXSLToJSON(filePath, page = 0) {
  // Making sure filePath is a valid path
  filePath = getFilePath(filePath);

  const xmlData = readXlsFile(filePath)[page].data;

  // Getting columns
  const columns = xmlData[0];
  const objectTemplate = {};

  for (const column of columns) {
    const columnName = columnReplacers[column] || column;
    objectTemplate[columnName] = null;
  }

  // Removing columns from xmlData
  xmlData.splice(0, 1);

  // Adding xmlData to object
  const data = [];

  for (const values of xmlData) {
    const object = { ...objectTemplate };

    for (const index in values) {
      let value = values[index];
      let columnName = columns[index];

      columnName = columnReplacers[columnName] || columnName;
      object[columnName] = value;
    }

    const column = columnReplacers['ProductType'] || 'ProductType';

    if (!object[column]) {
      continue;
    }

    data.push(object);
  }

  // Getting file path for JSON file
  const jsonFilePath = filePath
    .replace(/\\xls\\/, '\\json\\')
    .replace(/\/xls\//, '/json/')
    .replace(/\.\w+$/, '.json');

  // Saving xls converted data to json
  console.log('saving', jsonFilePath);
  saveJSONToFile(data, jsonFilePath);
}

module.exports = {
  readXlsFile,
  readAndConvertXSLToJSON,
  columnReplacers,
};
