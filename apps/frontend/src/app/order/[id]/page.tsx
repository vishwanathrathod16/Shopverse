"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useCart } from '@/context/CartContext';
import { IOrder } from '@/types'; // We need to add IOrder to types

function OrderPage() {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const params = useParams();
  const orderId = params.id;
  const { clearCart } = useCart();

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        try {
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
            { withCredentials: true }
          );
          setOrder(data);
          setLoading(false);
          // Order is successful, so clear the cart
          clearCart();
        } catch (err: any) {
          setError("Failed to fetch order details.");
          setLoading(false);
        }
      }
    };
    fetchOrder();
  }, [orderId, clearCart]);

  if (loading) return <div className="text-center mt-8">Loading order...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!order) return null;

  return (
    <div className="container mx-auto mt-8 p-4 max-w-2xl">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4 text-green-600">
          Thank you for your order!
        </h1>
        <p className="text-lg mb-6">
          Your order <span className="font-semibold">#{order._id}</span> has been placed.
        </p>

        <div className="border-t pt-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
          <p>{order.user.name}</p>
          <p>{order.shippingAddress.address}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
        </div>

        <div className="border-t pt-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">Payment Status</h2>
          <p className="text-green-600 font-semibold">
            {order.isPaid ? `Paid on ${new Date(order.paidAt!).toLocaleDateString()}` : "Not Paid"}
          </p>
        </div>

        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">Order Items</h2>
          <div className="divide-y divide-gray-200">
            {order.orderItems.map((item) => (
              <div key={item.product} className="flex py-2">
                <div className="w-16 h-16 bg-gray-200 rounded mr-4"></div>
                <div className="flex-grow">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.qty} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-right mt-4 text-2xl font-bold">
            Total: ${order.totalPrice.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap in ProtectedRoute
export default function ProtectedOrderPage() {
  return (
    <ProtectedRoute>
      <OrderPage />
    </ProtectedRoute>
  );
}