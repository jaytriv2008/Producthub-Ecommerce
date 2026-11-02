import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Star,
  Minus,
  Plus,
  CheckCircle,
  Package,
} from 'lucide-react';

import { fetchProductById } from '../services/productService';

import type { Product } from '../types/product';

import ProductSkeleton from '../components/ProductSkeleton';

import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      setLoading(true);
      setError(null);
      setProduct(null);

      const productId = Number(id);

      if (
        !id ||
        !Number.isSafeInteger(productId) ||
        productId <= 0
      ) {
        setError('Invalid product ID. Please select a valid product.');
        setLoading(false);
        return;
      }

      try {
        const data = await fetchProductById(
          productId,
          controller.signal,
        );

        if (controller.signal.aborted) return;

        setProduct(data);
        setSelectedImage(data.thumbnail || data.images?.[0] || '');
        setQuantity(1);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load product details.',
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadProduct();

    return () => controller.abort();
  }, [id, retryCount]);

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((current) => current + 1);
    }
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  // Loading state
  if (loading) {
    return (
      <main className="product-details-page">
        <div className="container">
          <ProductSkeleton count={1} />
        </div>
      </main>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <main className="product-details-page">
        <div className="container">
          <div className="product-details-error" role="alert">
            <Package size={42} />
            <h1>Product Not Found</h1>

            <p>
              {error || 'We could not find the requested product.'}
            </p>

            <button
              type="button"
              className="product-details-retry"
              onClick={() => setRetryCount((count) => count + 1)}
            >
              Try again
            </button>

            <Link to="/products" className="back-to-products">
              <ArrowLeft size={17} />
              Back to Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const images = Array.from(
    new Set(
      [product.thumbnail, ...product.images].filter(
        (image): image is string => Boolean(image),
      ),
    ),
  );

  const discountedPrice =
    product.price -
    (product.price * product.discountPercentage) / 100;

  const outOfStock = product.stock <= 0;

  return (
    <main className="product-details-page">
      <div className="container">

        {/* Breadcrumb */}
        <div className="product-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <span>{product.title}</span>
        </div>

        {/* Back button */}
        <Link to="/products" className="product-back-link">
          <ArrowLeft size={18} />
          Back to Products
        </Link>

        <section className="product-details-layout">

          {/* Product images */}
          <div className="product-gallery">

            <div className="product-main-image">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.title}
                />
              ) : (
                <div className="product-image-fallback">
                  Image unavailable
                </div>
              )}

              {product.discountPercentage > 0 && (
                <span className="product-discount-badge">
                  {Math.round(product.discountPercentage)}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail gallery */}
            {images.length > 1 && (
              <div className="product-thumbnail-list">
                {images.map((image, index) => (
                  <button
                    type="button"
                    key={image}
                    className={`product-thumbnail ${
                      selectedImage === image ? 'selected' : ''
                    }`}
                    onClick={() => setSelectedImage(image)}
                    aria-label={`View product image ${index + 1}`}
                    aria-pressed={selectedImage === image}
                  >
                    <img
                      src={image}
                      alt={`${product.title} view ${index + 1}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product information */}
          <div className="product-details-content">

            <span className="product-details-category">
              {product.category.replaceAll('-', ' ')}
            </span>

            <h1>{product.title}</h1>

            <div className="product-details-rating">
              <Star
                size={18}
                fill="currentColor"
              />
              <strong>{product.rating.toFixed(1)}</strong>
              <span>Customer rating</span>
            </div>

            <p className="product-details-description">
              {product.description}
            </p>

            {/* Pricing */}
            <div className="product-details-pricing">
              <span className="product-details-current-price">
                ${discountedPrice.toFixed(2)}
              </span>

              {product.discountPercentage > 0 && (
                <>
                  <span className="product-details-original-price">
                    ${product.price.toFixed(2)}
                  </span>

                  <span className="product-details-discount">
                    Save {product.discountPercentage.toFixed(0)}%
                  </span>
                </>
              )}
            </div>

            {/* Brand */}
            {product.brand && (
              <div className="product-detail-info">
                <span>Brand</span>
                <strong>{product.brand}</strong>
              </div>
            )}

            <div className="product-detail-info">
              <span>Category</span>
              <strong>
                {product.category.replaceAll('-', ' ')}
              </strong>
            </div>

            {/* Stock */}
            <div className="product-stock-details">
              <CheckCircle
                size={18}
                color={outOfStock ? '#BE123C' : '#238636'}
              />

              <span className={outOfStock ? 'stock-unavailable' : 'stock-available'}>
                {outOfStock
                  ? 'Out of stock'
                  : `${product.stock} units available`}
              </span>
            </div>

            {/* Quantity selector */}
            <div className="product-quantity-section">
              <label>Quantity</label>

              <div className="product-quantity-control">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>

                <span>{quantity}</span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={outOfStock || quantity >= product.stock}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="product-details-actions">
              <button
                type="button"
                className="product-details-cart-button"
                disabled={outOfStock}
                onClick={() => {
                  // Cart functionality will be connected on Day 6.
                  alert(
                    'Cart functionality will be available in Day 6.',
                  );
                }}
              >
                <ShoppingCart size={19} />
                Add to Cart
              </button>

              <button
                type="button"
                className="product-details-wishlist-button"
                aria-label="Add to wishlist"
                onClick={() => {
                  // Wishlist functionality will be connected on Day 6.
                  alert(
                    'Wishlist functionality will be available in Day 6.',
                  );
                }}
              >
                <Heart size={21} />
              </button>
            </div>

            <div className="product-delivery-note">
              <Package size={21} />
              <div>
                <strong>ProductHub Shopping</strong>
                <p>Explore more products from our collection.</p>
              </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetails;