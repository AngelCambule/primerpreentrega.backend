import { Router } from 'express'
import { productModel } from "../models/models.js";

const router = Router();

router.get('/', async (req, res) => {
  const { page, limit } = req.query
  const products = await productModel.paginate({},{ page: page || 1, limit: limit || 10 , sort: {precio: 1}})
  res.render('index',{
    title: 'Products',
    products: products,
    fileCss: 'styles.css'
  })
  console.log();
})

export default router
