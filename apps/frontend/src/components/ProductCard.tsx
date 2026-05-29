import Link from 'next/link';
import React from 'react';
import { IProduct } from '@/types'; // Import our new type

// We will add an Image component later. For now, <img> is fine.
// We'll also add a Rating component.

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border rounded-lg shadow-md overflow-hidden bg-white">
      {/* Product Image (using a placeholder for now) */}
      <Link href={`/product/${product._id}`}>
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          {/* We'll replace this with <Image /> later */}
          <span className="text-gray-500">(Product Image)</span>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link
          href={`/product/${product._id}`}
          className="block text-lg font-semibold text-gray-800 hover:text-blue-600 truncate"
        >
          {product.name}
        </Link>

        {/* We'll add a <Rating /> component here */}
        <div className="my-2 text-sm text-gray-500">
          {product.numReviews} reviews
        </div>

        <h3 className="text-2xl font-bold text-gray-900">${product.price}</h3>
      </div>
    </div>
  );
}