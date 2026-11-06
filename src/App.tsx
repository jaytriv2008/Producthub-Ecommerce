
import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Navbar from './components/navbar';
import Footer from './components/Footer';

import PageLoader from './components/PageLoader';
import ScrollToTop from './components/ScrollToTop';

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const PlaceholderPage = lazy(() => import('./pages/PlaceholderPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <ErrorBoundary>
    <CartProvider>
      <WishlistProvider>
        <BrowserRouter>
         <ScrollToTop/>
          <Navbar />
          
          

          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="*" element={<NotFound />} />

              <Route
                path="*"
                element={
                  <PlaceholderPage
                    title="Page not found"
                    description="The page you are looking for does not exist."
                  />
                }
              />
            </Routes>
          </Suspense>
          
          <Footer />
          
        </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
    </ErrorBoundary>
  );
}

export default App;
