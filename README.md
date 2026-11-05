# ProductHub – E-commerce Product Management Platform

A modern, responsive e-commerce frontend built with **React, TypeScript, and Vite**. ProductHub provides a smooth shopping experience with product browsing, search, filtering, sorting, pagination, product details, cart management, and wishlist functionality.

---

## 🚀 Project Overview

ProductHub is a frontend e-commerce application developed to demonstrate modern React development practices, reusable component architecture, API integration, state management, performance optimization, and responsive UI design.

The application fetches real product data from the DummyJSON API and provides users with an interactive shopping experience.

## ✨ Features

### 🛍️ Product Management

- Fetch and display products using the DummyJSON API.
- Browse products with reusable product cards.
- View detailed information about individual products.
- Display product images, prices, ratings, discounts, and stock availability.

### 🔍 Search, Filtering & Sorting

- Search products by name.
- Filter products by category.
- Filter products using price ranges.
- Sort products based on available sorting options.
- Maintain filter states through URL search parameters.

### 📄 Pagination

- Navigate between product pages.
- Fetch products according to the selected page.
- Update URL parameters when changing pages.

### ❤️ Wishlist

- Add and remove products from the wishlist.
- Maintain wishlist data using shared application state.
- Persist wishlist items using localStorage.

### 🛒 Shopping Cart

- Add products to the shopping cart.
- Increase or decrease product quantities.
- Remove individual products.
- Calculate cart totals dynamically.
- Prevent adding unavailable products.
- Persist cart data using localStorage.

### ⚡ Performance Optimization

- Implement lazy loading using React.lazy().
- Use React Suspense for loading states.
- Lazy-load images where appropriate.
- Optimize shared application state.
- Verify production builds.

### ♿ Accessibility & Error Handling

- Support keyboard navigation.
- Implement accessible controls and interactions.
- Use reusable error boundaries.
- Provide meaningful error and loading states.
- Verify important user interactions and application behavior.

### 📱 Responsive Design

- Clean and modern user interface.
- Responsive layouts for different screen sizes.
- Consistent typography, spacing, and styling.

---

## 🛠️ Tech Stack

| Technology       | Purpose                           |
| ---------------- | --------------------------------- |
| React.js         | Frontend UI development           |
| TypeScript       | Type safety and maintainable code |
| JavaScript       | Application logic                 |
| HTML5            | Application structure             |
| CSS3             | Styling and responsive layouts    |
| Vite             | Development server and build tool |
| React Router DOM | Client-side routing               |
| Lucide React     | Icons                             |
| DummyJSON API    | Product data                      |
| localStorage     | Persistent cart and wishlist data |

---

## 🎨 Design Theme

ProductHub uses a minimal and modern design system.

| Color         | Hex Code  | Usage                               |
| ------------- | --------- | ----------------------------------- |
| Off-White     | `#FAFAFA` | Main background                     |
| Jet Black     | `#111111` | Navigation and typography           |
| Metallic Gold | `#D4AF37` | Accent elements and highlights      |
| Crimson Red   | `#BE123C` | Optional accent and action elements |

---

## 🌐 API Integration

ProductHub uses the DummyJSON Products API to retrieve product information.

**Base API:**
`https://dummyjson.com/products`

**Products Endpoint:**
`https://dummyjson.com/products?limit=12&skip=0`

**API Documentation:**
[https://dummyjson.com/docs/products](https://dummyjson.com/docs/products)

The API provides product information such as:

- Product title and description
- Product images
- Price and discount percentage
- Category and brand
- Rating and stock availability

---

## 📂 Project Structure

```text
ProductHub/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   └── Layout.tsx
│   │   ├── navbar/
│   │   └── ...
│   │
│   ├── context/
│   │   └── ShopContext.tsx
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── ProductDetails.tsx
│   │   ├── Wishlist.tsx
│   │   ├── Cart.tsx
│   │   └── NotFound.tsx
│   │
│   ├── services/
│   │
│   ├── types/
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```


---

## ⚙️ Installation & Setup

Follow these steps to run ProductHub locally.

### 1. Clone the Repository

```bash
git clone https://github.com/jaytriv2008/Producthub-Ecommerce
```

### 2. Navigate to the Project Directory

```bash
cd ProductHub
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Open in Browser

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173/
```

---

## 📦 Available Scripts

| Command           | Description                           |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Starts the development server         |
| `npm run build`   | Creates an optimized production build |
| `npm run preview` | Previews the production build         |

---

## 🧪 Testing & Verification

The application has been checked through development and production workflows.

Verification includes:

- Product loading and API integration.
- Search, category and price filtering.
- Sorting and pagination.
- Product details navigation.
- Cart and wishlist operations.
- Quantity updates and price calculations.
- Responsive layouts.
- Keyboard navigation and accessibility.
- Error handling and loading states.
- Production build verification.

---

## 🚀 Future Improvements

Potential enhancements for future development:

- User authentication and account management.
- Backend integration and database support.
- Secure checkout and payment gateway integration.
- Order history and order tracking.
- Product reviews and ratings.
- Admin dashboard for product management.
- Advanced product recommendations.

---

## 🎯 Learning Objectives

This project demonstrates practical implementation of:

- React components, props, and hooks.
- TypeScript interfaces and type safety.
- API integration using asynchronous JavaScript.
- React Router and dynamic routing.
- Context API and shared state management.
- Reusable components and clean architecture.
- Search, filtering, sorting, and pagination.
- Browser localStorage.
- Lazy loading and performance optimization.
- Accessibility and error handling.
- Production build and deployment preparation.

---

## 👨‍💻 Author

**Jay Trivedi**

Frontend Developer | React.js | TypeScript | JavaScript

---

## 📄 License

This project is developed for educational and portfolio purposes. You may adapt it for learning and personal projects.

---

**Built with ❤️ using React, TypeScript, and Vite.**
