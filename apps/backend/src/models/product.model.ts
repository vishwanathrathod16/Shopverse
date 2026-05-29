import mongoose, { Document, Schema, Types } from 'mongoose';

// Interface for a product
export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  image: string; // URL to the image (from Cloudinary/S3)
  brand: string;
  category: string;
  price: number;
  countInStock: number;
  rating: number; // Average rating
  numReviews: number; // Number of reviews
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;