
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Heart, Search, Menu } from 'lucide-react';
import './Navbar.css';

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo">
          <ShoppingBag size={25} strokeWidth={2.2} />
          <span>
            Product<span className="logo-highlight">Hub</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="navbar-links">
          <NavLink to="/" end>
            Home
          </NavLink>

          <NavLink to="/products">
            Products
          </NavLink>
        </nav>

        {/* Search and Actions */}
        <div className="navbar-actions">
          <Link
            to="/products"
            className="navbar-search"
            aria-label="Browse products"
          >
            <Search size={19} />
            <span>Search products...</span>
          </Link>

          <Link
            to="/wishlist"
            className="navbar-icon"
            aria-label="Wishlist"
          >
            <Heart size={21} />
          </Link>

          <Link
            to="/cart"
            className="navbar-icon"
            aria-label="Shopping cart"
          >
            <ShoppingBag size={21} />
          </Link>

          <button
            type="button"
            className="mobile-menu-button"
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
