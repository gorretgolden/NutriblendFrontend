# NutriBlend Haven - Frontend Launch Guide

This guide helps you verify the full dynamic integration between the Next.js Frontend and Laravel Backend.

## 1. Start the Backend
1. Open a terminal in `C:\Users\GOLDEN\Documents\projects\nutrihavenblend`
2. Run `php artisan serve` (ensures API is at `http://localhost:8000`)
3. **Important**: Ensure your database is running on Port 3307 as configured.

## 2. Start the Frontend
1. Open a terminal in `C:\Users\GOLDEN\Documents\projects\nutriblendfrontend`
2. Run `npm run dev`
3. Visit `http://localhost:3000`

## 3. Verification Checklist

### ✅ Authentication (New!)
- Click **Account** -> **Sign in**.
- Use credentials or create a **New Account**.
- Verify that **Sign Up** calls the API and logs you in.
- Verify "Hi, [Name]" appears in the header after login.
- Verify **Sign Out** works.

### ✅ Dynamic Shop & Search
- Visit `/shop`.
- Verify products are loaded from the backend (check Network tab for `/api/v1/products`).
- Test Pagination (if you have enough products).
- Click on any product to view its **Dynamic Detail Page**.

### ✅ Homepage & Products
- **Homepage**: Verify slides and products are fetched from API.
- **Product Details**: Verify `/shop/product/[id]/...` loads the correct product title, price, and images from the DB.
- **Cart**: Add items to cart (Guest/User modes). Checkout flow remains visually accessible.

## Troubleshooting
- If API calls fail, check the browser Console and Network tab.
- Ensure `NEXT_PUBLIC_API_URL` in `.env.local` matches the running backend URL.
- If images are broken, ensure `NEXT_PUBLIC_ASSET_URL` matches the backend (e.g., `http://localhost:8000`).
