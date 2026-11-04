
import { describe, it, expect } from 'vitest';

import {
  calculateDiscountedPrice,
  calculateSubtotal,
  formatPrice,
  formatCategory,
} from '../utils/productUtils';

describe('Product utility functions', () => {
  it('calculates discounted price correctly', () => {
    expect(calculateDiscountedPrice(100, 20)).toBe(80);
  });

  it('returns original price for zero discount', () => {
    expect(calculateDiscountedPrice(100, 0)).toBe(100);
  });

  it('calculates product subtotal', () => {
    expect(calculateSubtotal(50, 3)).toBe(150);
  });

  it('formats price correctly', () => {
    expect(formatPrice(69.9)).toBe('$69.90');
  });

  it('formats product category correctly', () => {
    expect(formatCategory('mens-shirts')).toBe('Mens Shirts');
  });
});
