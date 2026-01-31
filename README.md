# E-Commerce Frontend

A React-based frontend for the E-Commerce application.  
It allows users to browse products, manage cart, place orders, and track order status with authentication support.

## Features

- User authentication (login & signup)
- Product listing and product details
- Category-based product filtering
- Cart management
- Checkout flow
- Order history and order details
- Admin dashboard for order management

## Tech Stack

- React
- React Router
- Axios
- Context API
- CSS

## How to Run Locally

```bash
git clone https://github.com/roshanmishra17/E-commerce-Frontend
cd E-commerce-Frontend

npm install
npm run dev
```
The app will run at:

http://localhost:5173
## Backend API

This frontend consumes a FastAPI backend.

Update the API base URL in `src/api/axios.js`:

```js
const api = axios.create({
  baseURL: "http://localhost:8000",
});

```
## User Role

- Customer: browse products, manage cart, place orders
- Admin: manage orders via admin dashboard

## Author

Roshan Mishra
BSc Computer Science Student
Frontend & Backend Developer 
GitHub: https://github.com/roshanmishra17



