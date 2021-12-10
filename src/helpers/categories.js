function simplifyCategory(category) {
  let XSDFilePath =
    'https://images-na.ssl-images-amazon.com/images/G/01/rainier/help/xsd/release_1_9/';

  const XSDFileName = category.XSDFilePath?.match(/\w+\.xsd$/)[0] || '';
  XSDFilePath = XSDFileName ? XSDFilePath.concat(XSDFileName) : null;

  const simplified = {
    ProductType_Report: category.ProductType_Report,
    ProductType_XSD: category.ProductType_XSD,
    ProductData: category.BaseCategory|| null,
    XSDFilePath,
    requiredAttributes: [],
    optionalAttributes: [],
  };
  simplified.requiredAttributes = category.attributes
    .filter((attr) => attr.MAtUsage === 'required')
    .map((attr) => ({
      Label: attr.AttributeLabel,
      Attribute_XSD: attr.Attribute,
      Attribute_FlatFile: attr.MAtAttribute,
    }));

  simplified.optionalAttributes = category.attributes
    .filter((attr) => attr.MAtUsage === 'optional')
    .map((attr) => ({
      Label: attr.AttributeLabel,
      Attribute_XSD: attr.Attribute,
      Attribute_FlatFile: attr.MAtAttribute,
    }));

  return simplified;
}

module.exports = {
  simplifyCategory,
};

// In this file you can replace left attributes name for showing on json