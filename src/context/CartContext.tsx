
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import type { Product } from '../types/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'producthub-cart';

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(STORAGE_KEY);

      if (!savedCart) return [];

      const parsed: unknown = JSON.parse(savedCart);

      if (!Array.isArray(parsed)) return [];

      return parsed.filter(
        (item): item is CartItem =>
          item !== null &&
          typeof item === 'object' &&
          'product' in item &&
          'quantity' in item &&
          typeof item.quantity === 'number' &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0 &&
          typeof item.product === 'object' &&
          item.product !== null &&
          'id' in item.product &&
          typeof item.product.id === 'number',
      );
    } catch {
      return [];
    }
  });

  // Save cart whenever it changes.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Add product to cart.
  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0 || quantity <= 0) return;

    const safeQuantity = Math.min(
      Math.floor(quantity),
      product.stock,
    );

    setCartItems((previousItems) => {
      const existingItem = previousItems.find(
        (item) => item.product.id === product.id,
      );

      if (existingItem) {
        return previousItems.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + safeQuantity,
                  product.stock,
                ),
              }
            : item,
        );
      }

      return [
        ...previousItems,
        {
          product,
          quantity: safeQuantity,
        },
      ];
    });
  };

  // Remove product from cart.
  const removeFromCart = (productId: number) => {
    setCartItems((previousItems) =>
      previousItems.filter(
        (item) => item.product.id !== productId,
      ),
    );
  };

  // Update product quantity.
  const updateQuantity = (
    productId: number,
    quantity: number,
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((previousItems) =>
      previousItems.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: Math.min(
                Math.floor(quantity),
                item.product.stock,
              ),
            }
          : item,
      ),
    );
  };

  // Clear entire cart.
  const clearCart = () => {
    setCartItems([]);
  };

  // Total quantity of all products.
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // Total cart price.
  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + item.product.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook.
export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart must be used inside CartProvider',
    );
  }

  return context;
};
