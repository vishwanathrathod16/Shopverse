// This will match the backend IProduct model
export interface IProduct {
  _id: string;
  name: string;
  description: string;
  image: string; // URL
  brand: string;
  category: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
  createdAt: string; // Mongoose timestamps
  updatedAt: string;
}
export interface ICartItem {
  product: IProduct; // The full product object
  qty: number;       // The quantity they want to buy
}
export interface IShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}
export interface IOrderItem {
  name: string;
  qty: number;
  image: string;
  price: number;
  product: string; // This will be the ID
}

export interface IOrder {
  _id: string;
  user: { name: string; email: string };
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  totalPrice: number;
  razorpay_order_id: string;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
}