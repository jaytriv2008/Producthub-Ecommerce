import type { Product, ProductApiResponse } from '../types/product';

const API_BASE_URL = 'https://dummyjson.com/products';

// Fetch products with pagination.
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

// Fetch all products in batches.
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

// Fetch product categories.
export async function fetchProductCategories(
  signal?: AbortSignal,
): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/category-list`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch categories. Server returned ${response.status}.`,
    );
  }

  const data: unknown = await response.json();

  if (
    !Array.isArray(data) ||
    !data.every((item) => typeof item === 'string')
  ) {
    throw new Error('The API returned invalid category data.');
  }

  return data;
}

// Fetch one product using its ID.
export async function fetchProductById(
  id: number,
  signal?: AbortSignal,
): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    signal,
  });

  if (response.status === 404) {
    throw new Error('Product not found. This product does not exist.');
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch product. Server returned ${response.status}.`,
    );
  }

  const data: unknown = await response.json();

  if (
    typeof data !== 'object' ||
    data === null ||
    !('id' in data) ||
    typeof data.id !== 'number' ||
    !('title' in data) ||
    typeof data.title !== 'string' ||
    !('price' in data) ||
    typeof data.price !== 'number'
  ) {
    throw new Error('The API returned invalid product details.');
  }

  return data as Product;
}

export interface ProductQuery {
  page: number;
  search: string;
  category: string;
  sortBy: 'default' | 'price-low' | 'price-high' | 'rating';
  minPrice: string;
  maxPrice: string;
}

export async function fetchProductsPage(
  query: ProductQuery,
  signal?: AbortSignal,
): Promise<ProductApiResponse> {
  const limit = 12;
  const skip = (query.page - 1) * limit;

  const hasPriceFilter =
    query.minPrice !== '' || query.maxPrice !== '';

  const hasSearch = query.search.trim() !== '';
  const hasCategory = query.category !== 'all';

  // Use the complete matching collection when combining
  // filters that the API cannot apply together.
  if (
    hasPriceFilter ||
    (hasSearch && hasCategory)
  ) {
    const response = await fetchAllProducts(signal);

    let result = [...response.products];

    if (hasSearch) {
      const term = query.search.trim().toLowerCase();

      result = result.filter((product) =>
        product.title.toLowerCase().includes(term),
      );
    }

    if (hasCategory) {
      result = result.filter(
        (product) => product.category === query.category,
      );
    }

    if (query.minPrice !== '') {
      result = result.filter(
        (product) => product.price >= Number(query.minPrice),
      );
    }

    if (query.maxPrice !== '') {
      result = result.filter(
        (product) => product.price <= Number(query.maxPrice),
      );
    }

    sortProductResults(result, query.sortBy);

    return {
      products: result.slice(skip, skip + limit),
      total: result.length,
      skip,
      limit,
    };
  }

  // Use the API directly for normal browsing,
  // search, category and sorting.
  let endpoint = API_BASE_URL;

  if (hasSearch) {
    endpoint += '/search';
  } else if (hasCategory) {
    endpoint += `/category/${encodeURIComponent(query.category)}`;
  }

  const url = new URL(endpoint);

  if (hasSearch) {
    url.searchParams.set('q', query.search.trim());
  }

  url.searchParams.set('limit', String(limit));
  url.searchParams.set('skip', String(skip));

  if (query.sortBy !== 'default') {
    const sortMap = {
      'price-low': ['price', 'asc'],
      'price-high': ['price', 'desc'],
      rating: ['rating', 'desc'],
    } as const;

    const [sortField, order] = sortMap[query.sortBy];

    url.searchParams.set('sortBy', sortField);
    url.searchParams.set('order', order);
  }

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

function sortProductResults(
  products: Product[],
  sortBy: ProductQuery['sortBy'],
) {
  switch (sortBy) {
    case 'price-low':
      products.sort((a, b) => a.price - b.price);
      break;

    case 'price-high':
      products.sort((a, b) => b.price - a.price);
      break;

    case 'rating':
      products.sort((a, b) => b.rating - a.rating);
      break;
  }
}