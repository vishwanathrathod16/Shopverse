"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    // Wait for the loading check to finish
    if (!loading) {
      // If not loading and no user, redirect to login
      if (!user) {
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  // If we are loading, or if there is no user (and we are redirecting),
  // show a simple loading text.
  if (loading || !user) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  // If loading is false AND we have a user, show the children
  return <>{children}</>;
};

export default ProtectedRoute;