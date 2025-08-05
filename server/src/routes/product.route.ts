import { Router } from "express";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/product.controller";

const router = Router();

router.route('/').get(getProducts).post(createProduct)
router.route('/:id').get(getProductById).put(updateProduct).delete(deleteProduct);

export default router;