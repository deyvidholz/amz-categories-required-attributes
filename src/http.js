const express = require('express');
const {
  getCategories,
  getCategory,
  searchCategory,
} = require('./controllers/categories');
const port = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/categories/search/:category', searchCategory);
app.get('/categories/:category', getCategory);
app.get('/categories', getCategories);

app.listen(port, () =>
  console.log(`Server listening on http://localhost:${port}`)
);
