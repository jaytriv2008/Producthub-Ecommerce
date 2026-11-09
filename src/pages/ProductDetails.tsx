import { useToast } from '../context/ToastContext';
import { useEffect, useState, type MouseEvent } from 'react';
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

import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

import './ProductDetails.css';
import {
  calculateDiscountedPrice,
  formatCategory,
  formatPrice,
} from '../utils/productUtils';


const ProductDetails = () => {
  // Context hooks must be called inside the component.
  const { addToCart, cartItems } = useCart();
  const { showToast } = useToast();

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch product details.
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

        setSelectedImage(
          data.thumbnail || data.images?.[0] || '',
        );

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

  // Increase quantity.
  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((current) => current + 1);
    }
  };

  // Decrease quantity.
  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const [zoomPosition, setZoomPosition] = useState({
    x: 50,
    y: 50,
  });

  const [mobileZoom, setMobileZoom] = useState(false);

  const handleImageMouseMove = (
    event: MouseEvent<HTMLDivElement>,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setZoomPosition({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  };

  // Loading state.
  if (loading) {
    return (
      <main className="product-details-page">
        <div className="container">
          <ProductSkeleton />
        </div>
      </main>
    );
  }
  // Error state.
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

  // Product images.
  const images = Array.from(
    new Set(
      [product.thumbnail, ...product.images].filter(
        (image): image is string => Boolean(image),
      ),
    ),
  );

  // Product pricing.
  const discountedPrice = calculateDiscountedPrice(
    product.price,
    product.discountPercentage,
  );

  const outOfStock = product.stock <= 0;

  // Wishlist status.
  const saved = isInWishlist(product.id);
  const isAddedToCart = cartItems.some(
    (item) => item.product.id === product.id,
  );
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

            {/* Main image */}
            <div className="product-main-image">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.title}
                  loading="eager"
                  style={{
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src =
                      'https://placehold.co/600x400/F5F5F5/333333?text=Image+Unavailable';
                  }}
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
                    key={`${image}-${index}`}
                    type="button"
                    className={`product-thumbnail ${selectedImage === image ? 'active' : ''
                      }`}
                    onClick={() => setSelectedImage(image)}
                    aria-label={`View product image ${index + 1}`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} view ${index + 1}`}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src =
                          'https://placehold.co/150x150/F5F5F5/333333?text=No+Image';
                      }}
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

            {/* Rating */}
            <div className="product-details-rating">
              <Star size={18} fill="currentColor" />
              <strong>{product.rating.toFixed(1)}</strong>
              <span>Customer rating</span>
            </div>

            {/* Description */}
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

            {/* Category */}
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

              <span
                className={
                  outOfStock
                    ? 'stock-unavailable'
                    : 'stock-available'
                }
              >
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
                  disabled={
                    outOfStock || quantity >= product.stock
                  }
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Cart and Wishlist actions */}
            <div className="product-details-actions">

              {/* Add to Cart */}
              <button
                type="button"
                className="product-details-cart-button"
                disabled={outOfStock}
                onClick={() => {
                  addToCart(product);
                  showToast('Product added to cart');
                }}

              >
                {isAddedToCart ? (
                  <CheckCircle size={19} />
                ) : (
                  <ShoppingCart size={19} />
                )}

                {isAddedToCart ? 'Added to Cart' : 'Add to Cart'}
              </button>

              {/* Wishlist */}
              <button
                type="button"
                className="product-details-wishlist-button"
                aria-label={
                  saved
                    ? 'Remove from wishlist'
                    : 'Add to wishlist'
                }
                aria-pressed={saved}
                onClick={() => {
                  toggleWishlist(product);

                  showToast(
                    saved
                      ? 'Product removed from wishlist'
                      : 'Product added to wishlist'
                  );
                }}
                
              >
                <Heart
                  size={21}
                  fill={saved ? 'currentColor' : 'none'}
                  color={saved ? '#BE123C' : 'currentColor'}
                />
              </button>
            </div>

            {/* Delivery note */}
            <div className="product-delivery-note">
              <Package size={21} />

              <div>
                <strong>ProductHub Shopping</strong>
                <p>
                  Explore more products from our collection.
                </p>
              </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductDetails;
