"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ICartItem } from '@/types';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cartItems, addToCart, removeFromCart } = useCart();

  // Calculate the total price
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.qty,
    0
  );
    const router = useRouter();  
  // Calculate the total number of items
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleQtyChange = (item: ICartItem, newQty: number) => {
    // Ensure quantity is at least 1 and not more than in stock
    if (newQty < 1 || newQty > item.product.countInStock) return;
    addToCart(item.product, newQty); // addToCart also handles updates
    
  };
 const handleCheckout = () => {
    // 3. This will be the handler for our button
    router.push('/shipping');
  };
  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center p-8 bg-white shadow rounded-lg">
          <p className="text-xl text-gray-600">Your cart is empty.</p>
          <Link 
            href="/" 
            className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="md:col-span-2">
            <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex items-center p-4">
                  {/* Image Placeholder */}
                  <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0"></div>
                  
                  <div className="flex-grow mx-4">
                    <Link 
                      href={`/product/${item.product._id}`} 
                      className="font-semibold text-gray-800 hover:text-blue-600"
                    >
                      {item.product.name}
                    </Link>
                    <div className="text-gray-600">${item.product.price.toFixed(2)}</div>
                  </div>
                  
                  {/* Quantity Selector */}
                  <div className="w-24">
                    <select
                      value={item.qty}
                      onChange={(e) => handleQtyChange(item, Number(e.target.value))}
                      className="p-2 border rounded w-full"
                    >
                      {[...Array(item.product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFromCart(item.product._id)}
                    className="ml-4 text-gray-500 hover:text-red-600"
                  >
                    {/* Using a simple 'X' for remove */}
                    &#x2715; 
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Summary Card */}
          <div className="md:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
                Order Summary
              </h2>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal ({totalItems} items):</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              {/* Add shipping, tax, etc. here later */}
              <div className="flex justify-between font-bold text-xl mt-4 pt-4 border-t">
                <span>Total:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className="w-full mt-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
              >
                Proceed to Checkout
              </button>
              {/* --- ADD THIS LINK --- */}
              <Link 
                href="/" 
                className="mt-4 inline-block w-full text-center text-blue-600 hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}