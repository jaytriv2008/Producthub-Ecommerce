import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';

import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';

import {
  fetchAllProducts,
  fetchProductCategories,
} from '../services/productService';

import useDebounce from '../hooks/useDebounce';

import type { Product } from '../types/product';

import './Products.css';

type SortOption =
  | 'default'
  | 'price-low'
  | 'price-high'
  | 'rating';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // ========================================
  // URL PARAMETERS
  // ========================================

  const [searchParams, setSearchParams] = useSearchParams();

  // Read filter values directly from the URL.
  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? 'all';
  const minPrice = searchParams.get('minPrice') ?? '';
  const maxPrice = searchParams.get('maxPrice') ?? '';

  const validSortOptions: SortOption[] = [
    'default',
    'price-low',
    'price-high',
    'rating',
  ];

  const requestedSort = searchParams.get('sort');

  const sortBy: SortOption = validSortOptions.includes(
    requestedSort as SortOption,
  )
    ? (requestedSort as SortOption)
    : 'default';

  // Debounce search input.
  const debouncedSearch = useDebounce(search, 400);

  // Update URL parameters when filters change.
  const updateFilter = (key: string, value: string) => {
    const updatedParams = new URLSearchParams(searchParams);

    if (
      value.trim() === '' ||
      (key === 'category' && value === 'all') ||
      (key === 'sort' && value === 'default')
    ) {
      updatedParams.delete(key);
    } else {
      updatedParams.set(key, value);
    }

    setSearchParams(updatedParams, { replace: true });
  };

  // Clear all filters.
  const clearFilters = () => {
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilters =
    search.trim() !== '' ||
    category !== 'all' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    sortBy !== 'default';

  // ========================================
  // FETCH PRODUCTS AND CATEGORIES
  // ========================================

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError(null);

      try {
        const [productResponse, categoryResponse] = await Promise.all([
          fetchAllProducts(controller.signal),
          fetchProductCategories(controller.signal),
        ]);

        setProducts(productResponse.products);
        setCategories(categoryResponse);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load products. Please try again.',
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => controller.abort();
  }, [retryCount]);

  // ========================================
  // FILTER AND SORT PRODUCTS
  // ========================================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search by product title.
    const searchTerm = debouncedSearch.trim().toLowerCase();

    if (searchTerm) {
      result = result.filter((product) =>
        product.title.toLowerCase().includes(searchTerm),
      );
    }

    // Filter by category.
    if (category !== 'all') {
      result = result.filter(
        (product) => product.category === category,
      );
    }

    // Filter by minimum price.
    if (minPrice !== '') {
      const minimum = Number(minPrice);

      if (Number.isFinite(minimum)) {
        result = result.filter((product) => product.price >= minimum);
      }
    }

    // Filter by maximum price.
    if (maxPrice !== '') {
      const maximum = Number(maxPrice);

      if (Number.isFinite(maximum)) {
        result = result.filter((product) => product.price <= maximum);
      }
    }

    // Sort products.
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;

      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;

      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;

      default:
        break;
    }

    return result;
  }, [
    products,
    debouncedSearch,
    category,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  // ========================================
  // PAGE UI
  // ========================================

  return (
    <main className="products-page">
      <div className="container">

        {/* Page heading */}
        <div className="products-page-heading">
          <p className="eyebrow">THE PRODUCTHUB COLLECTION</p>
          <h1>All Products</h1>
          <p>Explore our collection of everyday essentials.</p>
        </div>

        {!loading && !error && (
          <>
            {/* Search and sorting */}
            <section className="products-toolbar">

              <div className="products-search">
                <Search size={19} />

                <input
                  type="search"
                  placeholder="Search products..."
                  value={search}
                  onChange={(event) =>
                    updateFilter('search', event.target.value)
                  }
                  aria-label="Search products"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => updateFilter('search', '')}
                    aria-label="Clear search"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>

              <div className="products-sort">
                <label htmlFor="sort-products">Sort by</label>

                <select
                  id="sort-products"
                  value={sortBy}
                  onChange={(event) =>
                    updateFilter('sort', event.target.value)
                  }
                >
                  <option value="default">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

            </section>

            {/* Filters */}
            <section className="products-filter-section">

              <div className="products-filter-heading">
                <div>
                  <SlidersHorizontal size={19} />
                  <h2>Filters</h2>
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    className="clear-filters-button"
                    onClick={clearFilters}
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div className="products-filter-grid">

                <div className="filter-field">
                  <label htmlFor="category-filter">Category</label>

                  <select
                    id="category-filter"
                    value={category}
                    onChange={(event) =>
                      updateFilter('category', event.target.value)
                    }
                  >
                    <option value="all">All Categories</option>

                    {categories.map((item) => (
                      <option value={item} key={item}>
                        {item
                          .split('-')
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1),
                          )
                          .join(' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-field">
                  <label htmlFor="min-price">Minimum Price ($)</label>

                  <input
                    id="min-price"
                    type="number"
                    min="0"
                    placeholder="Min price"
                    value={minPrice}
                    onChange={(event) =>
                      updateFilter('minPrice', event.target.value)
                    }
                  />
                </div>

                <div className="filter-field">
                  <label htmlFor="max-price">Maximum Price ($)</label>

                  <input
                    id="max-price"
                    type="number"
                    min="0"
                    placeholder="Max price"
                    value={maxPrice}
                    onChange={(event) =>
                      updateFilter('maxPrice', event.target.value)
                    }
                  />
                </div>

              </div>
            </section>

            {/* Product count */}
            <div className="products-results-heading">
              <p>
                Showing <strong>{filteredProducts.length}</strong> of{' '}
                <strong>{products.length}</strong> products
              </p>
            </div>
          </>
        )}

        {/* Loading */}
        {loading && <ProductSkeleton count={12} />}

        {/* Error */}
        {!loading && error && (
          <div className="products-message" role="alert">
            <h2>Couldn't load products</h2>
            <p>{error}</p>

            <button
              type="button"
              className="products-retry-button"
              onClick={() => setRetryCount((count) => count + 1)}
            >
              Try again
            </button>
          </div>
        )}

        {/* No products from API */}
        {!loading && !error && products.length === 0 && (
          <div className="products-message" role="status">
            <h2>No products available</h2>
            <p>Please check again later.</p>
          </div>
        )}

        {/* Filtered products */}
        {!loading && !error && products.length > 0 && (
          <>
            {filteredProducts.length > 0 ? (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <Link
                    to={`/products/${product.id}`}
                    key={product.id}
                    className="product-card-link"
                  >
                    <ProductCard product={product} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="products-message" role="status">
                <h2>No matching products found</h2>
                <p>
                  Try changing your search or adjusting your filters.
                </p>

                <button
                  type="button"
                  className="products-retry-button"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
};

export default Products;