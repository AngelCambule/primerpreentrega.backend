const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.nextId = 1;
  }

  addProduct(productData) {
    if (!this.isCodeUnique(productData.code)) {
      console.log("Error: El codigo del producto ya existe.");
      return;
    }

    if (!this.areAllFieldsPresent(productData)) {
      console.log("Error: Todos los campos son obligatorios.");
      return;
    }

    const product = {
      id: this.nextId = this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0) + 1,
      ...productData,
    };

    this.products.push(product);
    this.nextId++;

    this.saveProductsToFile();
  }

  getProducts() {
    this.loadProductsFromFile();
    return this.products;
  }

  getProductById(id) {
    this.loadProductsFromFile();
    const product = this.products.find((p) => p.id === id);
    if (product) {
      return product;
    } else {
      console.log("No Encontrado");
    }
  }

  updateProduct(id, updatedProduct) {
    this.loadProductsFromFile();
    const index = this.products.findIndex((p) => p.id === id);
    if (index !== -1) {
      const product = this.products[index];
      this.products[index] = { ...product, ...updatedProduct };
      this.saveProductsToFile();
    } else {
      console.log("Producto no encontrado");
    }
  }

  deleteProduct(id) {
    this.loadProductsFromFile();
    this.products = this.products.filter((p) => p.id !== id);
    
    this.saveProductsToFile();
  }

  isCodeUnique(code) {
    return !this.products.some((product) => product.code === code);
  }

  areAllFieldsPresent(productData) {
    return (
      productData.title &&
      productData.description &&
      productData.price &&
      productData.thumbnail &&
      productData.code &&
      productData.stock
    );
  }

  loadProductsFromFile() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  saveProductsToFile() {
    try {
      fs.writeFileSync(this.path, JSON.stringify(this.products, null, `\t`), 'utf8');
    } catch (error) {
      console.error("Error al intentar guardar los productos en el archivo:", error);
    }
  }
}


module.exports = ProductManager;