import express from 'express';

import { addToCart, getCartProducts, removeAllFromCart, updateProductQuantity } from '../controllers/cart.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router()

router.get("/" , protectRoute , getCartProducts)
router.post("/" , protectRoute ,addToCart)
router.delete("/" , protectRoute , removeAllFromCart)
router.put("/:id" , protectRoute , updateProductQuantity)

export default router;