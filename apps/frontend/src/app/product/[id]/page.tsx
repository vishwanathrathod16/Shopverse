"use client";

import { useEffect, useState } from 'react';
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useParams } from 'next/navigation';
import axios from 'axios';
import { IProduct } from '@/types';
import Link from 'next/link';

export default function ProductDetailsPage() {
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1); // State for the quantity selector

  // useParams() gets the dynamic part of the URL, e.g., { id: '...' }
  const params = useParams();
  const productId = params.id;
  const router = useRouter();
  const { addToCart } = useCart();
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, qty);
      // Redirect to the cart page
      router.push("/cart");
    }
  };
  

  // --- Start Copying Here ---

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          //
          // THIS IS THE CORRECTED AXIOS CALL
          //
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`
          );
          //
          //
          //
          setProduct(data);
          setLoading(false);
        } catch (err: any) {
          setError("Product not found.");
          console.error(err);
          setLoading(false);
        }
      };
      
      fetchProduct();
    }
  }, [productId]); // Re-run effect if productId changes

  // --- Stop Copying Here --- effect if productId changes

  // --- Render Logic ---
  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-500">{error}</p>
        <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
          Go Back Home
        </Link>
      </div>
    );
  }

  if (!product) {
    return null; // Should be covered by loading/error states
  }

  // --- Page Content ---
  return (
    <div className="container mx-auto mt-8 p-4">
      <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Go Back
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Col 1: Image */}
        <div className="lg:col-span-1">
          <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg shadow-md">
            <span className="text-gray-500">(Product Image)</span>
          </div>
        </div>

        {/* Col 2: Details */}
        <div className="lg:col-span-1">
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
          {/* We'll add Rating component here */}
          <div className="mb-4 text-gray-600">{product.numReviews} reviews</div>
          <hr className="my-4" />
          <p className="text-lg text-gray-700 mb-4">{product.description}</p>
        </div>

        {/* Col 3: Cart Card */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg shadow-md p-4 bg-white">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Price:</span>
              <span className="text-2xl font-bold">${product.price}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Status:</span>
              <span className={product.countInStock > 0 ? 'text-green-600' : 'text-red-500'}>
                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity Selector (only if in stock) */}
            {product.countInStock > 0 && (
              <div className="mb-4">
                <label htmlFor="qty" className="font-semibold mr-2">Qty:</label>
                <select
                  id="qty"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="p-2 border rounded"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
             onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}