import { Router } from 'express';
import { getProducts, getProductById } from '../controllers/product.controller';

const router = Router();

// @route   GET /api/products
// @desc    Get all products
router.get('/', getProducts);

// @route   GET /api/products/:id
// @desc    Get a single product by its ID
router.get('/:id', getProductById);

// We will add admin routes (create, update, delete) later
// router.post('/', createProduct); 
// router.put('/:id', updateProduct);
// router.delete('/:id', deleteProduct);

export default router;