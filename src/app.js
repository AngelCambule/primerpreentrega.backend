const express = require('express');
const productsRouter = require('./router/productRouter');
const cartsRouter = require('./router/cartRouter');

const app = express();
const PORT = 8080;

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
