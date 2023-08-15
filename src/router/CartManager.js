const fs = require('fs');

class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
  }

  createCart() {
    const newCart = {
      id: this.generateCartId(),
      products: [],
    };

    this.carts.push(newCart);
    this.saveCartsToFile();
    return newCart.id;
  }

  getCartById(cartId) {
    this.loadCartsFromFile();
    const cart = this.carts.find(c => c.id === parseInt(cartId));

    if (cart) {
      return cart
    }
  
  }

  addToCart(cartId, productId) {
    const cart = this.getCartById(cartId);
    if (!cart) {
      return false;
    }
    const cartIndex = this.carts.findIndex(c => c.id === parseInt(cartId));
    const productIndex = this.carts[cartIndex].products.findIndex(p => p.product === parseInt(productId));

  if (productIndex !== -1) {
    this.carts[cartIndex].products[productIndex].quantity++;
  } else {
    this.carts[cartIndex].products.push({ product: parseInt(productId), quantity: 1 });
  }
    this.saveCartsToFile();
    return true;
  }

  loadCartsFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.carts = JSON.parse(data);
    } catch (error) {
      this.carts = [];
    }
  }

  saveCartsToFile() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.carts, null, '\t'), 'utf8');
    } catch (error) {
      console.error("Error al intentar guardar los carritos en el archivo:", error);
    }
  }

  generateCartId() {
    const existingIds = this.carts.map((cart) => cart.id);
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    return maxId + 1;
  }
}

module.exports = CartManager;
