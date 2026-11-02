import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';

import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';

import {
  fetchProductsPage,
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

const PRODUCTS_PER_PAGE = 12;

const validSortOptions: SortOption[] = [
  'default',
  'price-low',
  'price-high',
  'rating',
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') ?? '';
  const category = searchParams.get('category') ?? 'all';
  const minPrice = searchParams.get('minPrice') ?? '';
  const maxPrice = searchParams.get('maxPrice') ?? '';

  const requestedSort = searchParams.get('sort');

  const sortBy: SortOption = validSortOptions.includes(
    requestedSort as SortOption,
  )
    ? (requestedSort as SortOption)
    : 'default';

  const requestedPage = Number(searchParams.get('page') ?? '1');

  const currentPage =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const debouncedSearch = useDebounce(search, 400);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Update URL filter parameters.
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

    // Reset pagination whenever a filter changes.
    updatedParams.delete('page');

    setSearchParams(updatedParams, { replace: true });
  };

  // Update current page.
  const changePage = (page: number) => {
    const updatedParams = new URLSearchParams(searchParams);

    if (page <= 1) {
      updatedParams.delete('page');
    } else {
      updatedParams.set('page', String(page));
    }

    setSearchParams(updatedParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear all filters.
  const clearFilters = () => {
    setSearchParams({}, { replace: true });
  };

  // Load categories.
  useEffect(() => {
    const controller = new AbortController();

    fetchProductCategories(controller.signal)
      .then(setCategories)
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          console.error('Category loading failed:', err);
        }
      });

    return () => controller.abort();
  }, []);

  // Fetch the current product page.
  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchProductsPage(
          {
            page: currentPage,
            search: debouncedSearch,
            category,
            sortBy,
            minPrice,
            maxPrice,
          },
          controller.signal,
        );

        if (controller.signal.aborted) return;

        setProducts(response.products);
        setTotalProducts(response.total);
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
  }, [
    currentPage,
    debouncedSearch,
    category,
    sortBy,
    minPrice,
    maxPrice,
    retryCount,
  ]);

  // Correct invalid page numbers after fetching total results.
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  useEffect(() => {
    if (!loading && totalPages > 0 && currentPage > totalPages) {
      changePage(totalPages);
    }
  }, [loading, totalPages, currentPage]);

  const pageNumbers = useMemo(() => {
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    return Array.from(
      { length: end - start + 1 },
      (_, index) => start + index,
    );
  }, [currentPage, totalPages]);

  const hasActiveFilters =
    search.trim() !== '' ||
    category !== 'all' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    sortBy !== 'default';

  return (
    <main className="products-page">
      <div className="container">

        {/* Page heading */}
        <div className="products-page-heading">
          <p className="eyebrow">THE PRODUCTHUB COLLECTION</p>
          <h1>All Products</h1>
          <p>Explore our collection of everyday essentials.</p>
        </div>

        {/* Search, sorting and filters */}
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
        {!loading && !error && (
          <div className="products-results-heading">
            Showing <strong>{products.length}</strong> of{' '}
            <strong>{totalProducts}</strong> products
          </div>
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

        {/* Empty API result */}
        {!loading && !error && totalProducts === 0 && (
          <div className="products-message" role="status">
            <h2>No matching products found</h2>
            <p>Try changing your search or adjusting your filters.</p>

            <button
              type="button"
              className="products-retry-button"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Product listing */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="product-grid">
              {products.map((product) => (
                <Link
                  to={`/products/${product.id}`}
                  key={product.id}
                  className="product-card-link"
                >
                  <ProductCard product={product} />
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                className="pagination"
                aria-label="Product pagination"
              >
                <button
                  type="button"
                  className="pagination-button"
                  disabled={currentPage === 1}
                  onClick={() => changePage(currentPage - 1)}
                >
                  Previous
                </button>

                <div className="pagination-numbers">
                  {pageNumbers.map((page) => (
                    <button
                      type="button"
                      key={page}
                      className={`pagination-number ${
                        currentPage === page ? 'active' : ''
                      }`}
                      aria-current={
                        currentPage === page ? 'page' : undefined
                      }
                      onClick={() => changePage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="pagination-button"
                  disabled={currentPage === totalPages}
                  onClick={() => changePage(currentPage + 1)}
                >
                  Next
                </button>
              </nav>
            )}

            {/* Page information */}
            {totalPages > 0 && (
              <p className="pagination-info">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Products;