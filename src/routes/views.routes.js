import { Router } from "express";
import { cartModel } from "../models/models.js";

const router = Router()

router.get('/', (req, res) => {
    res.json({message: 'Hola'})
})

export default router