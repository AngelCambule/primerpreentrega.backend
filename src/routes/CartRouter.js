import { Router } from 'express'
import { cartModel } from '../models/models.js';
 
const router = Router();

router.get('/', async (req, res) => {
  const carts = await cartModel.find().populate('products.product')
  let totalCarrito = 0
  carts.forEach((c) => {
    c.products.forEach((c1) => {
      totalCarrito += c1.product.precio*c1.qty
    })
  })
  res.render('cart',{
    title: 'Cart',
    fileCss: 'styles.css',
    carts,
    totalCarrito
  })
})

router.put('/:cid', async (req, res) => {
  const cartId = req.params.cid
  const newProducts = req.body

  const cart = cartModel.findByAndUpdate(cartId,{$set: {products: newProducts}})
  console.log(cart);
  res.json(await cartModel.find())
})

router.put('/:cid/products/:pid', async (req, res) => {
  const idCart = req.params.cid
  const idProduct = req.params.pid
  const newQty = req.body

  const cart = await cartModel.findById(idCart)
  const newProducts = cart.products.find((p) => p.product == idProduct)
  newProducts.qty = newQty
  const aa = await cartModel.findByIdAndUpdate(idCart, {$set: {products: {...newProducts}}})
  console.log(newProducts);
  res.json(await cartModel.find())
})

router.post('/:cid/add/products/:pid', async (req, res) => {
  const idCart = req.params.cid
  const idProduct = req.params.pid

  const newProducts = {
    product: idProduct,
    qty: 1
  }
  
  const aa = await cartModel.findByIdAndUpdate(idCart, {$push: {products: {...newProducts}}})
  console.log(aa);
  res.json(await cartModel.find())

})

router.delete('/:cid/products/:pid', async (req, res) => {
  const idCart = req.params.cid
  const idProduct = req.params.pid

  const cart = await cartModel.findById(idCart)
  const newProducts = cart.products.find((p) => p.product != idProduct)
  const aa = await cartModel.findByIdAndUpdate(idCart, {$set: {products: newProducts}})
  console.log(aa);
  res.json(await cartModel.find())
})



export default router
