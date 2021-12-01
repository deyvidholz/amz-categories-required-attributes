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
  fileName.match(/\.xlsx?$/)
);

// Converting all [xls, xlsx] files to JSON
for (const fileName of xlsFiles) {
  const filePath = `src/${xlsFilesFolder}/${fileName}`;
  readAndConvertXSLToJSON(filePath);
}

console.log('Step 2: converting metadata from array to object');
/**
 * Step 2 will reduce time to run this script
 */
const parsedMetadata = {};
const xpathIndexName = columnReplacers['X-Path'] || 'X-Path';
const metadataFilePath = path.join(__dirname, 'json', 'metadata.json');
let metadata = readFile(metadataFilePath);

for (const index in metadata) {
  const metadataValue = { ...metadata[index] };
  const xpath = metadataValue[xpathIndexName];
  parsedMetadata[xpath] = metadataValue;
}

const metadataParsedFilePath = path.join(
  __dirname,
  'json',
  'metadata-parsed.json'
);
const metadataXPaths = Object.keys(parsedMetadata);

saveJSONToFile(parsedMetadata, metadataParsedFilePath);

console.log('Step 3: grouping attributes based on ProductType');

const attributesFilePath = path.join(__dirname, 'json', 'attributes.json');
const data = readFile(attributesFilePath);
const groupedAttributes = {};

const indexName = columnReplacers['ProductType'] || 'ProductType';
const XSDFileNameIndexName = columnReplacers['XSDFileName'] || 'XSDFileName';
// const attributeIndexName = columnReplacers['XSD ATRIBUTE'] || 'XSD ATRIBUTE';

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

  // Finding XSD information
  const regex = new RegExp(`${groupedAttribute.ProductType_XSD}`);
  const metadataIndex = metadataXPaths.find((xpath) => xpath.match(regex));

  groupedAttribute.BaseCategory = null;
  groupedAttribute.XSDFilePath = null;

  if (metadataIndex) {
    const metadataValue = parsedMetadata[metadataIndex];
    groupedAttribute.BaseCategory = getBaseCategory(
      metadataValue[xpathIndexName]
    );
    groupedAttribute.XSDFilePath = metadataValue[XSDFileNameIndexName];
  }

  // console.log(
  //   'metadataIndex',
  //   groupedAttribute.ProductType_XSD,
  //   metadataIndex,
  //   regex
  // );

  // const attributeMetadata = metadata.find(
  //   (md) =>
  //     md[indexName].toLowerCase() === groupedAttribute.ProductType_XSD ||
  //     md[xpathIndexName].match(
  //       new RegExp(`${groupedAttribute.ProductType_XSD}`)
  //     )
  // );

  // const XSDFileNameIndexName = columnReplacers['XSDFileName'] || 'XSDFileName';

  // if (attributeMetadata) {
  //   groupedAttribute.BaseCategory = getBaseCategory(
  //     attributeMetadata[xpathIndexName]
  //   );

  //   groupedAttribute.XSDFilePath = attributeMetadata[XSDFileNameIndexName];
  // } else {
  //   // XSD file was not found
  //   groupedAttribute.BaseCategory = null;
  //   groupedAttribute.XSDFilePath = null;
  // }
}

saveJSONToFile(Object.values(groupedAttributes), attributesFilePath);
console.log('');
