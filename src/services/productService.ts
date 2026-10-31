import type { ProductApiResponse } from '../types/product';

const API_BASE_URL = 'https://dummyjson.com/products';

export async function fetchProducts(
  limit = 12,
  skip = 0,
  signal?: AbortSignal,
): Promise<ProductApiResponse> {
  const url = new URL(API_BASE_URL);

  url.searchParams.set('limit', String(limit));
  url.searchParams.set('skip', String(skip));

  const response = await fetch(url.toString(), { signal });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch products. Server returned ${response.status}.`,
    );
  }

  const data: unknown = await response.json();

  if (
    typeof data !== 'object' ||
    data === null ||
    !('products' in data) ||
    !Array.isArray(data.products) ||
    !('total' in data) ||
    typeof data.total !== 'number' ||
    !('skip' in data) ||
    typeof data.skip !== 'number' ||
    !('limit' in data) ||
    typeof data.limit !== 'number'
  ) {
    throw new Error('The API returned an invalid product response.');
  }

  return data as ProductApiResponse;
}

// Fetch every product, including products beyond the first 100.
export async function fetchAllProducts(
  signal?: AbortSignal,
): Promise<ProductApiResponse> {
  const pageSize = 100;
  const firstPage = await fetchProducts(pageSize, 0, signal);
  const allProducts = [...firstPage.products];

  for (
    let skip = pageSize;
    skip < firstPage.total;
    skip += pageSize
  ) {
    const page = await fetchProducts(pageSize, skip, signal);
    allProducts.push(...page.products);
  }

  return {
    products: allProducts,
    total: firstPage.total,
    skip: 0,
    limit: allProducts.length,
  };
}

// Fetch all available product categories.
export async function fetchProductCategories(
  signal?: AbortSignal,
): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/category-list`, { signal });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch categories. Server returned ${response.status}.`,
    );
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data) || !data.every((item) => typeof item === 'string')) {
    throw new Error('The API returned invalid category data.');
  }

  return data;
}