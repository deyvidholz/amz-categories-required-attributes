const path = require('path');

function upperEveryFirstLetter(string) {
  // Dealing with uncommon cases
  switch (string) {
    case '3D_PRINTER':
      return '3DPrinter';
  }

  return string
    .toLowerCase()
    .replace(/(^\w{1})|(_+\w{1})/g, (letter) => letter.toUpperCase())
    .replace(/_/g, '');
}

function getFilePath(filePath, splitBy = '/') {
  return path.join(__dirname, '..', '..', ...filePath.split(splitBy));
}

function getBaseCategory(xpath) {
  // Example of XPath: Message/Product/ProductData/Outdoors/ProductType/CyclingEquipment/MfrWarrantyDescriptionType
  return xpath.split('/')[3];
}

module.exports = {
  upperEveryFirstLetter,
  getFilePath,
  getBaseCategory,
};
