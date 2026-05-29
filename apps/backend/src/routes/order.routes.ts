import { Router } from 'express';
import { createOrder, verifyPayment, getMyOrders,getOrderById, } from '../controllers/order.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All these routes are protected
router.route('/').post(protect, createOrder);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/verify').post(protect, verifyPayment);

export default router;