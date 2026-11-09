import { memo, useState } from 'react';
import { Check, Heart, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { Product } from '../types/product';

import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const saved = isInWishlist(product.id);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    if (product.stock <= 0) return;

    addToCart(product);
    setAddedToCart(true);

    showToast('Product added to cart');
  };

  const handleWishlist = () => {
    const wasSaved = isInWishlist(product.id);

    toggleWishlist(product);

    showToast(
      wasSaved
        ? 'Product removed from wishlist'
        : 'Product added to wishlist'
    );
  };

  return (
    <article className="product-card">
      <div className="product-card-image">
        <Link
          to={`/products/${product.id}`}
          aria-label={`View ${product.title} details`}
        >
          <img
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            decoding="async"
            width="400"
            height="400"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src =
                'https://placehold.co/600x400/F5F5F5/333333?text=Image+Unavailable';
            }}
          />
        </Link>

        <button
          type="button"
          className="product-wishlist"
          aria-label={
            saved
              ? `Remove ${product.title} from wishlist`
              : `Add ${product.title} to wishlist`
          }
          aria-pressed={saved}
          onClick={handleWishlist}
        >
          <Heart
            size={19}
            fill={saved ? 'currentColor' : 'none'}
            color={saved ? '#BE123C' : 'currentColor'}
          />
        </button>

        <span
          className={`product-stock ${
            product.stock > 0 ? 'in-stock' : 'out-of-stock'
          }`}
        >
          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>

      <div className="product-card-content">
        <span className="product-category">
          {product.category}
        </span>

        <Link
          to={`/products/${product.id}`}
          className="product-title-link"
        >
          <h3 className="product-title">
            {product.title}
          </h3>
        </Link>

        <div className="product-rating">
          <Star size={16} fill="currentColor" />
          <span>{product.rating.toFixed(1)}</span>
        </div>

        <div className="product-card-bottom">
          <span className="product-price">
            ${product.price.toFixed(2)}
          </span>

          <button
            type="button"
            className={`product-add-button ${
              addedToCart ? 'is-added' : ''
            }`}
            disabled={product.stock <= 0}
            aria-label={
              product.stock <= 0
                ? `${product.title} is out of stock`
                : addedToCart
                  ? `${product.title} added to cart`
                  : `Add ${product.title} to cart`
            }
            onClick={handleAddToCart}
          >
            {addedToCart ? (
              <Check size={18} aria-hidden="true" />
            ) : (
              <ShoppingCart size={18} aria-hidden="true" />
            )}

            <span>
              {addedToCart ? 'Added to Cart' : 'Add to Cart'}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard);