
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

import './Wishlist.css';
import { useToast } from '../context/ToastContext';

const Wishlist = () => {
  const {
    wishlistItems,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleRemoveFromWishlist = (productId: number) => {
    removeFromWishlist(productId);
    showToast('Product removed from wishlist');
  };

  const handleClearWishlist = () => {
    if (wishlistItems.length === 0) return;

    clearWishlist();
    showToast('Wishlist cleared successfully');
  };

  const handleMoveToCart = (productId: number) => {
    const product = wishlistItems.find(
      (item) => item.id === productId,
    );

    if (!product || product.stock <= 0) return;

    addToCart(product);
    removeFromWishlist(productId);

    showToast('Product moved to cart');
  };
  return (
    <main className="wishlist-page">
      <div className="container">
        <div className="wishlist-heading">
          <p className="eyebrow">PRODUCTHUB</p>
          <h1>Your Wishlist</h1>
          <p>
            {wishlistItems.length}{' '}
            {wishlistItems.length === 1 ? 'product' : 'products'} saved
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="wishlist-empty">
            <Heart size={55} />
            <h2>Your wishlist is empty</h2>
            <p>Save your favourite products to find them here.</p>

            <Link to="/products" className="wishlist-browse-button">
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            <div className="wishlist-list-heading">
              <h2>Saved Products</h2>

              <button
                type="button"
                onClick={clearWishlist}
                className="wishlist-clear-button"
              >
                Clear Wishlist
              </button>
            </div>

            <div className="wishlist-grid">
              {wishlistItems.map((product) => (
                <article
                  className="wishlist-card"
                  key={product.id}
                >
                  <Link
                    to={`/products/${product.id}`}
                    className="wishlist-image"
                  >
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                    />
                  </Link>

                  <div className="wishlist-card-content">
                    <span>{product.category}</span>

                    <Link to={`/products/${product.id}`}>
                      <h3>{product.title}</h3>
                    </Link>

                    <strong>${product.price.toFixed(2)}</strong>

                    <div className="wishlist-card-actions">
                      <button
                        type="button"
                        className="wishlist-cart-button"
                        disabled={product.stock <= 0}
                        onClick={() => handleMoveToCart(product.id)}
                      >
                        <ShoppingCart size={17} />
                        {product.stock > 0 ? 'Move to Cart' : 'Out of Stock'}
                      </button>

                      <button
                        type="button"
                        className="wishlist-remove-button"
                        onClick={() => handleRemoveFromWishlist(product.id)}
                        aria-label={`Remove ${product.title} from wishlist`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Wishlist;
