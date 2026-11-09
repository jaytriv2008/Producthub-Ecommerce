
import { Link } from 'react-router-dom';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
} from 'lucide-react';

import { useCart } from '../context/CartContext';

import './Cart.css';
import { useToast } from '../context/ToastContext';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,

  } = useCart();


  const { showToast } = useToast();

  const handleRemoveFromCart = (productId: number) => {
    removeFromCart(productId);
    showToast('Product removed from cart');
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) return;

    clearCart();
    showToast('Cart cleared successfully');
  };

  return (
    <main className="cart-page">
      <div className="container">
        <div className="cart-heading">
          <p className="eyebrow">PRODUCTHUB</p>
          <h1>Shopping Cart</h1>
          <p>
            {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={55} />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>

            <Link to="/products" className="cart-continue-button">
              <ArrowLeft size={17} />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <section className="cart-items-section">
              <div className="cart-items-heading">
                <h2>Your Items</h2>

                <button
                  type="button"
                  className="cart-clear-button"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
              </div>

              <div className="cart-items-list">
                {cartItems.map(({ product, quantity }) => (
                  <article className="cart-item" key={product.id}>
                    <Link
                      to={`/products/${product.id}`}
                      className="cart-item-image"
                    >
                      <img src={product.thumbnail} alt={product.title} />
                    </Link>

                    <div className="cart-item-info">
                      <span>{product.category}</span>

                      <Link to={`/products/${product.id}`}>
                        <h3>{product.title}</h3>
                      </Link>

                      <strong>${product.price.toFixed(2)}</strong>

                      <div className="cart-quantity-control">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(product.id, quantity - 1)
                          }
                          disabled={quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={15} />
                        </button>

                        <span>{quantity}</span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(product.id, quantity + 1)
                          }
                          disabled={quantity >= product.stock}
                          aria-label="Increase quantity"
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                    </div>

                    <div className="cart-item-actions">
                      <strong>
                        ${(product.price * quantity).toFixed(2)}
                      </strong>

                      <button
                        type="button"
                        className="cart-remove-button"
                        onClick={() => handleRemoveFromCart(product.id)}
                        aria-label={`Remove ${product.title}`}
                      >
                        <Trash2 size={19} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="cart-summary">
              <h2>Order Summary</h2>

              <div className="cart-summary-row">
                <span>Items ({cartCount})</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>

              <div className="cart-summary-row">
                <span>Shipping</span>
                <span className="cart-free-shipping">Free</span>
              </div>

              <div className="cart-summary-row cart-grand-total">
                <strong>Total</strong>
                <strong>${cartTotal.toFixed(2)}</strong>
              </div>

              <button
                type="button"
                className="cart-checkout-button"
                onClick={() =>
                  alert('Checkout functionality is not included in Day 6.')
                }
              >
                Proceed to Checkout
              </button>

              <Link to="/products" className="cart-continue-link">
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
