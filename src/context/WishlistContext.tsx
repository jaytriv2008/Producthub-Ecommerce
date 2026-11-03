
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import type { Product } from '../types/product';

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
}

const WishlistContext = createContext<
  WishlistContextType | undefined
>(undefined);

const WISHLIST_STORAGE_KEY = 'producthub-wishlist';

const getStoredWishlist = (): Product[] => {
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is Product =>
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        typeof item.id === 'number' &&
        'title' in item &&
        typeof item.title === 'string' &&
        'price' in item &&
        typeof item.price === 'number',
    );
  } catch {
    return [];
  }
};

export const WishlistProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [wishlistItems, setWishlistItems] =
    useState<Product[]>(getStoredWishlist);

  useEffect(() => {
    localStorage.setItem(
      WISHLIST_STORAGE_KEY,
      JSON.stringify(wishlistItems),
    );
  }, [wishlistItems]);

  const addToWishlist = (product: Product) => {
    setWishlistItems((items) =>
      items.some((item) => item.id === product.id)
        ? items
        : [...items, product],
    );
  };

  const removeFromWishlist = (productId: number) => {
    setWishlistItems((items) =>
      items.filter((item) => item.id !== productId),
    );
  };

  const toggleWishlist = (product: Product) => {
    setWishlistItems((items) =>
      items.some((item) => item.id === product.id)
        ? items.filter((item) => item.id !== product.id)
        : [...items, product],
    );
  };

  const isInWishlist = (productId: number) =>
    wishlistItems.some((item) => item.id === productId);

  const clearWishlist = () => setWishlistItems([]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount: wishlistItems.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      'useWishlist must be used inside WishlistProvider',
    );
  }

  return context;
};
