"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";

// --- THIS LINE IS THE FIX ---
export default function Navbar() {
  const { user, setUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      
      // Clear the user from global state
      setUser(null);
      // Redirect to home
      router.push("/");
    } catch (err) {
      console.error("Failed to log out", err);
    }
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md">
      <Link href="/" className="text-2xl font-bold text-blue-600">
        ShopVerse
      </Link>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-gray-700">Welcome, {user.name}</span>
            {/* 1. Add link to My Orders */}
            <Link 
              href="/myorders" 
              className="px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
            >
              My Orders
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="px-4 py-2 text-gray-700 rounded hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}