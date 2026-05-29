"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import axios from "axios";
// Define the shape of the user object
interface IUser {
  _id: string;
  name: string;
  email: string;
}

// Define the shape of the context
interface IAuthContext {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  loading: boolean;
}

// Create the context
const AuthContext = createContext<IAuthContext | undefined>(undefined);

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  // In a real app, you would add a useEffect here
  // to check if the user is already logged in
  // by calling the backend's '/api/auth/me' endpoint.

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        // Call the 'getMe' endpoint.
        // withCredentials: true is CRITICAL for sending the httpOnly cookie
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          { withCredentials: true }
        );
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false); // Stop loading once check is complete
      }
    };

    checkUserLoggedIn();
  }, []); // Empty array means this runs only once

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {/* 5. Don't render the app until the check is done */}
      {!loading && children}
    </AuthContext.Provider>
  );
};


// Create a custom hook for easy context consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};