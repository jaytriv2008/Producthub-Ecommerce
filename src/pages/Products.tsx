
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import { fetchProducts } from '../services/productService';
import type { Product } from '../types/product';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchProducts(12, 0, controller.signal);
        setProducts(response.products);
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

  return (
    <main className="products-page">
      <div className="container">
        <div className="products-page-heading">
          <p className="eyebrow">THE PRODUCTHUB COLLECTION</p>
          <h1>All Products</h1>
          <p>Explore our collection of everyday essentials.</p>
        </div>

        {!loading && !error && products.length > 0 && (
          <p className="products-count">
            Showing {products.length} products
          </p>
        )}

        {loading && <ProductSkeleton count={12} />}

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

        {!loading && !error && products.length === 0 && (
          <div className="products-message" role="status">
            <h2>No products available</h2>
            <p>Please check again later.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
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
        )}
      </div>
    </main>
  );
};

export default Products;
