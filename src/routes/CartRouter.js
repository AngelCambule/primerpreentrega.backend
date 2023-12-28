import { Router } from 'express'
import { cartModel } from '../models/models.js';
 
const router = Router();

router.get('/', async (req, res) => {
  const cart = await cartModel.find().populate('products.product')
  let totalCarrito = 0
  cart.forEach((c) => {
    c.products.forEach((c1) => {
      totalCarrito += c1.product.precio*c1.qty
    })
  })
  res.render('cart',{
    title: 'Cart',
    fileCss: 'styles.css',
    cart,
    totalCarrito
  })
})
router.get('/:cid', async (req, res) => {
  const idCart = req.params.cid

  const cart = await cartModel.findById(idCart)

  res.render('cart', {
    title: 'Cart',
    cart
  })
})
router.put('/:cid', async (req, res) => {
  const idCart = req.params.cid
  const newProducts = req.body

  const cart = cartModel.findByAndUpdate(idCart,{$set: {products: newProducts}})
  console.log(cart);

  res.json(await cartModel.find())
})

router.put('/:cid/products/:pid', async (req, res) => {
  const idCart = req.params.cid
  const idProduct = req.params.pid
  const newQty = req.body

  const aa = await cartModel.updateOne({_id: idCart, 'products.product': idProduct},{$set: {'products.$.qty': newQty}})
  
  res.json(await cartModel.find())
})

router.put('/:cid/add/products/:pid', async (req, res) => {
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

router.delete('/:cid', async (req, res) => {
  const idCart = req.params.cid

  const delCarr = await cartModel.updateOne({_id: idCart},{$set: {products: []}})

  res.json(delCarr)
})



export default router
