function simplifyCategory(category) {
  const simplified = {
    ProductType_Report: category.ProductType_Report,
    ProductType_XSD: category.ProductType_XSD,
    BaseCategory: category.BaseCategory,
    XSDFilePath:
      'https://images-na.ssl-images-amazon.com/images/G/01/rainier/help/xsd/release_1_9/' +
      category.XSDFilePath,
    requiredAttributes: [],
    optionalAttributes: [],
  };

  simplified.requiredAttributes = category.attributes
    .filter((attr) => attr.MAtUsage === 'required')
    .map((attr) => ({
      Label: attr.AttributeLabel,
      Attribute: attr.Attribute,
    }));

  simplified.optionalAttributes = category.attributes
    .filter((attr) => attr.MAtUsage === 'optional')
    .map((attr) => ({
      Label: attr.AttributeLabel,
      Attribute: attr.Attribute,
    }));

  return simplified;
}

module.exports = {
  simplifyCategory,
};
