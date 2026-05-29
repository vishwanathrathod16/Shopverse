import mongoose, { Document, Schema, Types } from 'mongoose';

// Interface for a single item in the order
export interface IOrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
  product: Types.ObjectId; // Reference to IProduct
}

// Interface for the shipping address
export interface IShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

// Interface for the main Order document
export interface IOrder extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId; // Reference to IUser
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  totalPrice: number;
  
  // Razorpay-specific fields
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;

  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true, default: 'Razorpay' },
    totalPrice: { type: Number, required: true, default: 0.0 },

    // Razorpay IDs
    razorpay_order_id: { type: String, unique: true, sparse: true },
    razorpay_payment_id: { type: String },
    razorpay_signature: { type: String },

    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;