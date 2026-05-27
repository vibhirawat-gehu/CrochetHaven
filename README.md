# CrochetHaven 🧶

A full-stack MERN e-commerce app for handmade crochet products.

## Tech Stack

- **MongoDB** — database (products, users, orders, contacts)
- **Express.js** — REST API server
- **React** — frontend (Vite + React Router + Context API)
- **Node.js** — backend runtime

## Project Structure

```
CrochetHaven/
├── server/          # Express + MongoDB backend
│   ├── models/      # Mongoose models
│   ├── routes/      # API routes
│   ├── middleware/  # JWT auth middleware
│   ├── public/      # Static images
│   ├── index.js     # Server entry point
│   └── seed.js      # Seed products to DB
└── client/          # React frontend (Vite)
    └── src/
        ├── api/         # Axios instance
        ├── context/     # AuthContext, CartContext
        ├── components/  # Navbar, Footer, ProductCard, Toast
        └── pages/       # Home, Shop, ProductDetail, Cart, Checkout, Orders, Login, Register, Contact
```

## Setup & Run

### Prerequisites
- Node.js 18+
- MongoDB running locally on port 27017

### 1. Install dependencies
```bash
npm run install:all
```

### 2. Configure environment
The `server/.env` is pre-configured for local dev. Edit if needed:
```
MONGO_URI=mongodb://localhost:27017/crochethaven
JWT_SECRET=crochethaven_jwt_secret_2024_secure_key
PORT=5000
```

### 3. Seed the database
```bash
npm run seed
```

### 4. Start development servers
```bash
npm run dev
```

This starts:
- Backend API: http://localhost:5000
- Frontend: http://localhost:5173

## Features

- **Product Catalog** — Browse, filter by category, real-time search
- **Product Detail** — Stock info, quantity selector, add to cart
- **Shopping Cart** — Persistent (localStorage), quantity controls, free shipping threshold
- **Authentication** — JWT-based login & registration
- **Checkout** — 3-step flow (Shipping → Payment → Review), order placed via API
- **Order History** — View all past orders with status tracking
- **Contact Form** — Messages saved to MongoDB
- **Responsive Design** — Mobile-friendly with hamburger menu
