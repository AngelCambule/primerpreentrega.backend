const express = require('express');
const CartManager = require('./CartManager');

const cartsRouter = express.Router();
const cartManager = new CartManager('cart.json');

cartsRouter.post('/', (req, res) => {
  const newCart = req.body;
  const cartId = cartManager.createCart(newCart);
  res.status(201).json({ cartId });
});

cartsRouter.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  const cart = cartManager.getCartById(cartId);
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = parseInt(req.params.pid);
  const success = cartManager.addToCart(cartId, productId);
  
  if (success) {
    res.json({ message: 'Producto agregado al carrito' });
  } else {
    res.status(404).json({ error: 'Carrito o producto no encontrado' });
  }
});

module.exports = cartsRouter;
