const express = require('express');
const ProductManager = require('./ProductManager');

const productsRouter = express.Router();
const productManager = new ProductManager('products.json');

productsRouter.get('/', (req, res) => {
  const products = productManager.getProducts();
  res.json(products);
});

productsRouter.get('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = productManager.getProductById(productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

productsRouter.post('/', (req, res) => {
  const newProduct = req.body;
  productManager.addProduct(newProduct);
  res.status(201).json({ message: 'Producto agregado' });
});

productsRouter.put('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedProduct = req.body;
  productManager.updateProduct(productId, updatedProduct);
  res.json({ message: 'Producto actualizado correctamente' });
});

productsRouter.delete('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  productManager.deleteProduct(productId);
  
    res.json({ message: 'Producto borrado exitosamente' });
  
});

module.exports = productsRouter;
