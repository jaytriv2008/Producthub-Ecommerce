
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import type { Product } from '../types/product';

import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

import './ProductCard.css';
import type { MouseEvent } from 'react';
import { memo } from 'react';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const saved = isInWishlist(product.id);
const handleAction = (
  event: MouseEvent<HTMLButtonElement>,
  action: () => void,
) => {
  event.preventDefault();
  event.stopPropagation();
  action();
};
  return (
    <article className="product-card">
      <div className="product-card-image">
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

        <button
          type="button"
          className="product-wishlist"
          aria-label={
            saved
              ? `Remove ${product.title} from wishlist`
              : `Add ${product.title} to wishlist`
          }
          aria-pressed={saved}
          onClick={(event) =>
            handleAction(event, () => toggleWishlist(product))
          }
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
        <span className="product-category">{product.category}</span>

        <h3 className="product-title">{product.title}</h3>

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
         className="product-add-button"
         disabled={product.stock <= 0}
         aria-label={
         product.stock <= 0
          ? `${product.title} is out of stock`
         : `Add ${product.title} to cart`
         }
       >
     <ShoppingCart size={18} aria-hidden="true" />
     </button>
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard); 
