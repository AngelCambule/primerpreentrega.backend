const express = require('express');
const fs = require('fs');

const app = express();
const port = 8080;

app.use(express.json())

const productsFilePath = 'products.json';
const cartFilePath = 'cart.json';

// Leer datos del archivo JSON

const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Escribir datos en el archivo JSON

const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error al escribir en el archivo:', error);
  }
};

// Manejo de productos

const productsRouter = express.Router();
app.use('/api/products', productsRouter);

productsRouter.get('/', (req, res) => {
  const { limit } = req.query;
  const products = readData(productsFilePath);

  if (limit && !isNaN(limit)) {
    res.json(products.slice(0, parseInt(limit)));
  } else {
    res.json(products);
  }
});

productsRouter.get('/:pid', (req, res) => {
  const { pid } = req.params;
  const products = readData(productsFilePath);
  const product = products.find(p => p.id === parseInt(pid));

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  res.json(product);
});

productsRouter.post('/', (req, res) => {
  const newProduct = req.body;
  const products = readData(productsFilePath);

  if (!newProduct.title || !newProduct.description || !newProduct.price ||
      !newProduct.code || !newProduct.stock || newProduct.status === undefined ||
      !newProduct.category) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios, excepto thumbnails' });
  }

  newProduct.id = products.length + 1;
  products.push(newProduct);
  writeData(productsFilePath, products);
  res.json(newProduct);
});

productsRouter.put('/:pid', (req, res) => {
  const { pid } = req.params;
  const updatedProductData = req.body;
  const products = readData(productsFilePath);
  const existingProduct = products.find(p => p.id === parseInt(pid));

  if (!existingProduct) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const updatedProduct = { ...existingProduct, ...updatedProductData };
  writeData(productsFilePath, products.map(p => (p.id === parseInt(pid) ? updatedProduct : p)));
  res.json(updatedProduct);
});

productsRouter.delete('/:pid', (req, res) => {
  const { pid } = req.params;
  const products = readData(productsFilePath);
  const deletedProduct = products.find(p => p.id === parseInt(pid));

  if (!deletedProduct) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  writeData(productsFilePath, products.filter(p => p.id !== parseInt(pid)));
  res.json({ message: 'Producto eliminado exitosamente' });
});

// Manejo de carritos

const cartsRouter = express.Router();
app.use('/api/carts', cartsRouter);

cartsRouter.post('/', (req, res) => {
  const newCart = { id: JSON.parse(Date.now()), products: [] };
  writeData(cartFilePath, [newCart]);
  res.json(newCart);
});

cartsRouter.get('/:cid', (req, res) => {
  const { cid } = req.params;
  const carts = readData(cartFilePath);
  const cart = carts.find(c => c.id === parseInt(cid));

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  res.json(cart.products);
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const { cid, pid } = req.params;
  const carts = readData(cartFilePath);
  const cartIndex = carts.findIndex(c => c.id === parseInt(cid));
  const productIndex = carts[cartIndex].products.findIndex(p => p.product === parseInt(pid));

  if (productIndex !== -1) {
    carts[cartIndex].products[productIndex].quantity++;
  } else {
    carts[cartIndex].products.push({ product: parseInt(pid), quantity: 1 });
  }

  writeData(cartFilePath, carts);
  res.json(carts[cartIndex]);
});

app.listen(port, () => {
  console.log(`El servidor está en funcionamiento en http://localhost:${port}`);
});
