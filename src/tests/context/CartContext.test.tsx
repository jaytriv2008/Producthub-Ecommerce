
import { describe, it, expect, beforeEach } from 'vitest';

import {
  renderHook,
  act,
} from '@testing-library/react';

import type { ReactNode } from 'react';

import {
  CartProvider,
  useCart,
} from '../../context/CartContext';

import type { Product } from '../../types/product';

const mockProduct: Product = {
  id: 1,
  title: 'Classic Sneakers',
  description: 'Comfortable everyday sneakers',
  category: 'mens-shoes',
  price: 100,
  rating: 4.5,
  discountPercentage: 10,
  thumbnail: 'https://example.com/shoes.webp',
  images: [],
  stock: 10,
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with an empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.cartItems).toHaveLength(0);
    expect(result.current.cartCount).toBe(0);
    expect(result.current.cartTotal).toBe(0);
  });

  it('adds a product to the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartCount).toBe(1);
  });

  it('adds the requested quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 3);
    });

    expect(result.current.cartCount).toBe(3);
  });

  it('increases quantity when adding an existing product', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 2);
      result.current.addToCart(mockProduct, 2);
    });

    expect(result.current.cartItems[0].quantity).toBe(4);
  });

  it('does not exceed available stock', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 20);
    });

    expect(result.current.cartItems[0].quantity).toBe(10);
  });

  it('calculates cart total correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 2);
    });

    expect(result.current.cartTotal).toBe(200);
  });

  it('updates product quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 2);
      result.current.updateQuantity(1, 5);
    });

    expect(result.current.cartItems[0].quantity).toBe(5);
    expect(result.current.cartTotal).toBe(500);
  });

  it('removes a product from the cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.removeFromCart(1);
    });

    expect(result.current.cartItems).toHaveLength(0);
  });

  it('clears the entire cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 2);
      result.current.clearCart();
    });

    expect(result.current.cartItems).toHaveLength(0);
    expect(result.current.cartTotal).toBe(0);
  });

  it('does not add out-of-stock products', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const outOfStockProduct = {
      ...mockProduct,
      stock: 0,
    };

    act(() => {
      result.current.addToCart(outOfStockProduct);
    });

    expect(result.current.cartItems).toHaveLength(0);
  });

  it('removes product when quantity is updated to zero', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct);
      result.current.updateQuantity(1, 0);
    });

    expect(result.current.cartItems).toHaveLength(0);
  });
});
