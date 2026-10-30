
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Headphones,
  Shirt,
  Smartphone,
  Watch,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import ProductLoadingPlaceholder from '../components/ProductSkeleton';
import { fetchProducts } from '../services/productService';
import type { Product } from '../types/product';

import './Home.css';

const categories = [
  { name: 'Electronics', icon: Smartphone },
  { name: 'Fashion', icon: Shirt },
  { name: 'Accessories', icon: Watch },
  { name: 'Audio', icon: Headphones },
];

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchProducts(
          12,
          0,
          controller.signal,
        );

        setProducts(data.products);
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong while loading products.',
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void loadProducts();

    return () => {
      controller.abort();
    };
  }, [retryCount]);

  return (
    <main>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">
              <span /> THE EVERYDAY UPGRADE
            </span>

            <h1>
              Discover more.
              <br />
              Shop <span>smarter.</span>
            </h1>

            <p>
              Thoughtfully selected essentials for your everyday life.
              Find your next favourite, all in one place.
            </p>

            <div className="hero-actions">
              <Link to="/products">
                <Button>
                  Shop products <ArrowRight size={18} />
                </Button>
              </Link>

              <Link to="/products" className="hero-secondary-link">
                Explore collection
              </Link>
            </div>

            <div className="hero-note">
              <span className="hero-note-star">★</span>
              A better way to discover what you love.
            </div>
          </div>

          <div
            className="hero-art"
            aria-label="Decorative product showcase"
          >
            <div className="hero-art-glow" />

            <div className="hero-art-card hero-art-card-back">
              <span className="art-label">DESIGNED FOR EVERYDAY</span>
              <div className="art-circle">
                <ShoppingBagFallback />
              </div>
            </div>

            <div className="hero-art-card hero-art-card-front">
              <span className="art-mini-label">THE EDIT</span>

              <div className="art-product-shape">
                <div className="art-product-top" />
                <div className="art-product-body" />
              </div>

              <div className="art-product-caption">
                <span>Modern essentials</span>
                <strong>01 / 04</strong>
              </div>
            </div>

            <div className="hero-floating-tag">
              CURATED <span>✦</span> FOR YOU
            </div>
          </div>
        </div>
      </section>

      <section className="container category-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">BROWSE BY INTEREST</p>
            <h2 className="section-title">Find your category</h2>
          </div>

          <Link to="/products" className="text-link">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="category-grid">
          {categories.map(({ name, icon: Icon }) => (
            <Link
              to="/products"
              className="category-card"
              key={name}
            >
              <span className="category-icon">
                <Icon size={25} strokeWidth={1.7} />
              </span>

              <span>{name}</span>
              <ArrowRight size={16} className="category-arrow" />
            </Link>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE PRODUCTHUB SELECTION</p>
              <h2 className="section-title">Featured picks</h2>
              <p className="section-description">
                A few things worth a closer look.
              </p>
            </div>

            <Link to="/products" className="text-link">
              Shop all products <ArrowRight size={16} />
            </Link>
          </div>

          {loading && <ProductLoadingPlaceholder count={4} />}

          {!loading && error && (
            <div className="product-api-message" role="alert">
              <h3>Unable to load products</h3>
              <p>{error}</p>

              <Button
               type="button"
               className="product-api-retry"
               onClick={() => setRetryCount((count) => count + 1)}
            >
               Try again
              </Button>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="product-api-message" role="status">
              <h3>No products found</h3>
              <p>There are currently no products to display.</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="product-grid">
              {products.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="container promo-section">
        <div className="promo-copy">
          <p className="eyebrow">A LITTLE SOMETHING EXTRA</p>

          <h2>
            Good finds.
            <br />
            Better everyday.
          </h2>

          <p>
            Explore useful, well-chosen products that fit your style
            and routine.
          </p>

          <Link to="/products">
            <Button variant="secondary">
              Explore products <ArrowRight size={17} />
            </Button>
          </Link>
        </div>

        <div className="promo-mark">
          <span>PH</span>
          <i>✦</i>
        </div>
      </section>
    </main>
  );
};

const ShoppingBagFallback = () => (
  <div className="art-bag">
    <div className="art-bag-handle" />
    <div className="art-bag-body">
      <span>PH</span>
    </div>
  </div>
);

export default Home;
