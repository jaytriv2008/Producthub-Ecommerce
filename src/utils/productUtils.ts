
export function calculateDiscountedPrice(
  price: number,
  discountPercentage: number,
): number {
  return price - (price * discountPercentage) / 100;
}

export function calculateSubtotal(
  price: number,
  quantity: number,
): number {
  return price * quantity;
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function formatCategory(category: string): string {
  return category
    .split('-')
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' ');
}
