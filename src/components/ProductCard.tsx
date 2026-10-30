
import { Heart, ShoppingCart, Star } from 'lucide-react';
import type { Product } from '../types/product';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-card-image">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src =
              'https://placehold.co/600x400/F5F5F5/333333?text=Image+Unavailable';
          }}
        />

        <button
          type="button"
          className="product-wishlist"
          aria-label={`Add ${product.title} to wishlist`}
        >
          <Heart size={19} />
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
            aria-label={`Add ${product.title} to cart`}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
