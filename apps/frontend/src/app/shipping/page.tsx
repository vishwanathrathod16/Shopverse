"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute"; // 1. Import
import { IShippingAddress } from "@/types";
import Link from 'next/link';

function ShippingPage() {
  const { shippingAddress, saveShippingAddress } = useCart();
  const router = useRouter();

  // Pre-fill form if address is already in context, otherwise use empty strings
  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const addressData: IShippingAddress = { address, city, postalCode, country };
    saveShippingAddress(addressData);
    router.push("/payment"); // 2. Send to payment page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white rounded shadow-md w-96"
      >
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          Shipping Address
        </h2>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full px-3 py-2 text-gray-700 border rounded focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="w-full px-3 py-2 text-gray-700 border rounded focus:outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Postal Code</label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
            className="w-full px-3 py-2 text-gray-700 border rounded focus:outline-none"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-700">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            className="w-full px-3 py-2 text-gray-700 border rounded focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
        >
          Continue to Payment
        </button>
        {/* --- ADD THIS LINK --- */}
        <Link 
          href="/cart" 
          className="mt-4 inline-block w-full text-center text-blue-600 hover:underline"
        >
          Back to Cart
        </Link>
      </form>
    </div>
  );
}

// 3. Wrap the whole component in ProtectedRoute
export default function ProtectedShippingPage() {
  return (
    <ProtectedRoute>
      <ShippingPage />
    </ProtectedRoute>
  );
}