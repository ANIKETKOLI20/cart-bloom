import express from 'express'
import { createProduct, deleteProduct, featuredProducts, getAllProduct, getProductsByCategory, getRecommendedProducts, toggleFeaturedProduct } from '../controllers/product.controller.js'
import { protectRoute } from '../middleware/protectRoute.js'
import { adminRoute } from '../middleware/adminRoutes.js'

const router = express.Router()

router.get("/", protectRoute, adminRoute , getAllProduct )
router.get("/featured",  featuredProducts )
router.get("/recommendations", getRecommendedProducts);
router.get("/category/:category", getProductsByCategory);
router.post("/", protectRoute, adminRoute , createProduct )
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectRoute, adminRoute , deleteProduct )

export default router