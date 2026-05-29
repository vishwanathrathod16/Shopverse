"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import axios from "axios";
import ProtectedRoute from "@/components/ProtectedRoute";
import Script from "next/script"; // 1. To load Razorpay SDK

// Define the structure of the Razorpay order
interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

// Define the window object to include Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

function PaymentPage() {
  const { cartItems, shippingAddress } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.qty,
    0
  );

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    if (!shippingAddress) {
      setError("Shipping address is missing.");
      setLoading(false);
      return;
    }

    try {
      // 1. Call backend to create the order
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        {
          orderItems: cartItems.map((item) => ({
            // We need to explicitly send all the product data
            name: item.product.name,
            image: item.product.image,
            price: item.product.price,
            qty: item.qty,
            product: item.product._id, // Just the ID for the 'product' field
          })),
          shippingAddress: shippingAddress,
          totalPrice: subtotal,
        },
        { withCredentials: true } // CRITICAL for auth
      );

      const { dbOrder, razorpayOrder }: { dbOrder: any, razorpayOrder: RazorpayOrder } = data;

      // 2. Configure Razorpay payment options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // We need to create this env var
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "ShopVerse",
        description: "Payment for your order",
        order_id: razorpayOrder.id,
        // This handler function is called after payment
        handler: async (response: any) => {
          // 3. Verify the payment on our backend
          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/orders/${dbOrder._id}/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            { withCredentials: true }
          );

          // 4. Redirect to a success page
          router.push(`/order/${dbOrder._id}`);
          // We also need to clear the cart here
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          // We can add contact number here if we collect it
        },
        notes: {
          address: shippingAddress.address,
        },
        theme: {
          color: "#3399cc",
        },
      };

      // 5. Open the Razorpay payment modal
      const rzp = new window.Razorpay(options);
      rzp.open();
      
      setLoading(false);

    } catch (err: any) {
      setError("Payment failed. Please try again.");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <>
      {/* 1. Load the Razorpay SDK script */}
      <Script
        id="razorpay-sdk"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      
      <div className="container mx-auto mt-8 p-4 max-w-lg">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
            Confirm Order
          </h2>
          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2">Shipping To:</h3>
            <p className="text-gray-600">{shippingAddress?.address}</p>
            <p className="text-gray-600">
              {shippingAddress?.city}, {shippingAddress?.postalCode}
            </p>
            <p className="text-gray-600">{shippingAddress?.country}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2">Order Summary:</h3>
            {/* We could list items here, but for simplicity, just show total */}
            <div className="flex justify-between font-bold text-xl mt-4 pt-4 border-t">
              <span>Total:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>

          {error && <p className="mb-4 text-center text-red-500">{error}</p>}

          <button
            onClick={handlePayment}
            disabled={loading || cartItems.length === 0}
            className="w-full py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Processing..." : `Pay $${subtotal.toFixed(2)} with Razorpay`}
          </button>
          <Link 
            href="/shipping" 
            className="mt-4 inline-block w-full text-center text-blue-600 hover:underline"
          >
            Back to Shipping
          </Link>
        </div>
      </div>
    </>
  );
}

// 6. Wrap the whole component in ProtectedRoute
export default function ProtectedPaymentPage() {
  return (
    <ProtectedRoute>
      <PaymentPage />
    </ProtectedRoute>
  );
}