const { simplifyCategory } = require('../helpers/categories');
const { loadAttributes } = require('../services/load-attributes');

function getCategories(req, res) {
  const categories = loadAttributes();
  return res.json(categories.map((category) => simplifyCategory(category)));
}

function getCategory(req, res) {
  const categories = loadAttributes();
  const productTypeColumnName =
    'ProductType_XSD' || columnReplacers['ProductType'] || 'ProductType';
  const categoryName = req.params.category;
  const category = categories.find(
    (category) =>
      category[productTypeColumnName].toLowerCase() ===
      categoryName.toLowerCase()
  );

  if (!category) {
    return res
      .status(404)
      .json({ message: `Category "${categoryName}" not found` });
  }

  return res.json(simplifyCategory(category));
}

function searchCategory(req, res) {
  const categories = loadAttributes();
  const productTypeColumnName =
    'ProductType_XSD' || columnReplacers['ProductType'] || 'ProductType';
  const categoryName = req.params.category;
  const regex = new RegExp(`${categoryName}`, 'gi');
  const filteredCategories = categories.filter((category) =>
    category[productTypeColumnName].match(regex)
  );

  if (!filteredCategories) {
    return res
      .status(404)
      .json({ message: `There are no categories with this name` });
  }

  return res.json(
    filteredCategories.map((category) => simplifyCategory(category))
  );
}

module.exports = {
  getCategories,
  getCategory,
  searchCategory,
};
