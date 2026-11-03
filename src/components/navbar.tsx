
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

import './Navbar.css';

function Navbar() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <ShoppingBag size={25} strokeWidth={2.2} />
          <span>
            Product<span className="logo-highlight">Hub</span>
          </span>
        </Link>

        <nav className="navbar-links">
          <NavLink to="/" end>
            Home
          </NavLink>

          <NavLink to="/products">
            Products
          </NavLink>

          <NavLink to="/wishlist">
            Wishlist
            {wishlistCount > 0 && (
              <span className="nav-count">{wishlistCount}</span>
            )}
          </NavLink>

          <NavLink to="/cart">
            Cart
            {cartCount > 0 && (
              <span className="nav-count">{cartCount}</span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
