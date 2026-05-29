"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ICartItem, IProduct } from "@/types";
import { IShippingAddress } from "@/types";

// Define the shape of the cart state and methods
interface ICartContext {
  cartItems: ICartItem[];
  shippingAddress: IShippingAddress | null;
  addToCart: (product: IProduct, qty: number) => void;
  removeFromCart: (productId: string) => void;
  saveShippingAddress: (address: IShippingAddress) => void;
  clearCart: () => void;
}

// Create the context
const CartContext = createContext<ICartContext | undefined>(undefined);

// Create the provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState<IShippingAddress | null>(null);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
    const storedAddress = localStorage.getItem("shippingAddress");
    if (storedAddress) {
      setShippingAddress(JSON.parse(storedAddress));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const saveShippingAddress = (address: IShippingAddress) => {
    setShippingAddress(address);
    localStorage.setItem("shippingAddress", JSON.stringify(address));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const addToCart = (product: IProduct, qty: number) => {
    const existItem = cartItems.find((x) => x.product._id === product._id);

    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x.product._id === product._id ? { ...x, qty: qty } : x
        )
      );
    } else {
      setCartItems([...cartItems, { product, qty }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter((x) => x.product._id !== productId));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        shippingAddress,
        addToCart,
        removeFromCart,
        saveShippingAddress,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Create a custom hook for easy context consumption
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
