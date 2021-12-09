console.log('');
const fs = require('fs');
const path = require('path');
const { readFile, saveJSONToFile } = require('./helpers/files');
const { upperEveryFirstLetter, getBaseCategory } = require('./helpers/general');
const {
  readAndConvertXSLToJSON,
  columnReplacers,
} = require('./modules/xls-converter');

console.log('Step 1: convert xls(x) files to JSON');

// Getting all files in src/xls directory in order to convert them to JSON
const xlsFilesFolder = 'xls';
const xlsDirectory = path.join(__dirname, xlsFilesFolder);
const filesInXlsDirectory = fs.readdirSync(xlsDirectory);

// Filtering only xls and xlsx files
const xlsFiles = filesInXlsDirectory.filter((fileName) =>
  fileName.match(/\.(xlsx?|csv)$/)
);

// Converting all [xls, xlsx] files to JSON
for (const fileName of xlsFiles) {
  const filePath = `src/${xlsFilesFolder}/${fileName}`;
  readAndConvertXSLToJSON(filePath);
}

console.log('Step 3: grouping attributes based on ProductType');

const attributesFilePath = path.join(
  __dirname,
  'json',
  'BASE_UNIFICADA_V2.json'
);
const data = readFile(attributesFilePath);
const groupedAttributes = {};

const indexName = columnReplacers['ProductType'] || 'ProductType';
const XSDFileNameIndexName = columnReplacers['XSDFileName'] || 'XSDFileName';

const xsds = readFile(path.join(__dirname, 'xsds.json'));

for (const attribute of data) {
  const productType = attribute[indexName];
  let groupedAttribute = groupedAttributes[productType];

  if (!groupedAttribute) {
    groupedAttribute = { attributes: [] };
    groupedAttributes[productType] = groupedAttribute;
  }

  groupedAttribute[indexName] = productType;
  groupedAttribute.ProductType_XSD = upperEveryFirstLetter(productType);
  groupedAttribute.attributes.push(attribute);

  // Finding XSD
  const xsdFilename = String(attribute.XSDFileName).replace(/\.xsd$/, '');

  if (xsds[xsdFilename]) {
    groupedAttribute.BaseCategory = xsdFilename;
    groupedAttribute.XSDFilePath = xsds[xsdFilename];
  }
}

saveJSONToFile(Object.values(groupedAttributes), attributesFilePath);
console.log('');
