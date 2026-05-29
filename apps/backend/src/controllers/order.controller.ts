import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Order from '../models/order.model';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// 1. Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

// @desc    Create a new order and get Razorpay order ID
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req: AuthRequest, res: Response) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;
  const user = req.user!; // We know user exists due to 'protect' middleware

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  // 1. Create the order in *our* database first (as unpaid)
  const order = new Order({
    user: user._id,
    orderItems: orderItems, // Just pass the array directly
    shippingAddress: shippingAddress,
    totalPrice: totalPrice,
    paymentMethod: 'Razorpay',
  });

  const createdOrder = await order.save();

  // 2. Create the order in Razorpay
  const options = {
    amount: Number(totalPrice) * 100, // Amount in paise
    currency: 'INR',
    receipt: createdOrder._id.toString(), // Use our order ID as the receipt
  };

  try {
    const razorpayOrder = await razorpay.orders.create(options);
    
    // 3. Update our order with the Razorpay order ID
    createdOrder.razorpay_order_id = razorpayOrder.id;
    await createdOrder.save();
    
    // 4. Send back our DB order and Razorpay order details
    res.status(201).json({
      dbOrder: createdOrder,
      razorpayOrder: razorpayOrder,
    });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error creating Razorpay order', error: error.message });
  }
};

// @desc    Verify payment and update order to paid
// @route   POST /api/orders/:id/verify
// @access  Private
export const verifyPayment = async (req: AuthRequest, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  try {
    // 1. Find the order in our database
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // 2. Verify the Razorpay signature
    const body = order.razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // 3. Payment is successful! Update our database.
      order.isPaid = true;
      order.paidAt = new Date();
      order.razorpay_payment_id = razorpay_payment_id;
      order.razorpay_signature = razorpay_signature;

      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } else {
      // 4. Payment verification failed
      res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user!._id });
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    // Find the order and also populate the 'user' field with name and email
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Security check: Make sure the logged-in user is the one who made this order
    // (We'll skip this for admin access later, but it's good for users)
    if (order.user._id.toString() !== req.user!._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to view this order' });
    }

    res.status(200).json(order);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching order' });
  }
};