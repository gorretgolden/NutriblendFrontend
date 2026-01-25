# 🔌 Backend Connection Guide - NutriBlend Haven

## ✅ Current Status

**Good News!** Your frontend is already configured to connect to the backend:

- ✅ API Client is properly set up (`src/lib/api/client.ts`)
- ✅ Environment variables are configured (`.env.local`)
- ✅ Homepage is set to fetch real data from backend
- ✅ Fallback data is in place for when backend is offline

## 🚀 How to Connect (Step-by-Step)

### Step 1: Start Your Backend

Open a **NEW terminal** and run:

```powershell
# Navigate to your backend folder
cd C:\Users\GOLDEN\Documents\projects\nutrihavenblend

# Start Laravel development server
php artisan serve
```

You should see:
```
Server running on [http://127.0.0.1:8000] or [http://localhost:8000]
```

**Keep this terminal open!** (Don't close it)

---

### Step 2: Verify Backend Has Products

In another terminal, check if you have products in the database:

```powershell
cd C:\Users\GOLDEN\Documents\projects\nutrihavenblend

# Check database
php artisan tinker
```

Then in tinker:
```php
\App\Models\Product::count();
// Should return a number > 0

\App\Models\Product::with('images')->first();
// Should show a product with images

exit
```

---

### Step 3: If No Products - Seed the Database

If Step 2 shows 0 products, seed the database:

```powershell
cd C:\Users\GOLDEN\Documents\projects\nutrihavenblend

# Run seeders
php artisan db:seed --class=ProductSeeder
```

---

### Step 4: Restart Your Frontend

Now restart your Next.js development server:

```powershell
# Stop the current dev server (Ctrl+C)
# Then restart:
npm run dev
```

**Important:** After changing `.env.local`, you MUST restart the dev server!

---

### Step 5: Test the Connection

1. Open your browser and go to: `http://localhost:3000`
2. Check your browser console (F12) for any errors
3. You should see:
   - Real product images from the backend
   - Product names from your database
   - Prices from your database

---

## 🔍 How to Know if It's Working

### ✅ Connected to Backend (Success!)
- Product images are loading
- Product names are from your database
- No console errors about API

### ❌ Using Fallback Data (Backend Not Connected)
- You see products named "Weight Adder", "Fish Oil, Omega-3"
- Images are from `/images/bottle1.avif`, etc.
- Console shows: "Failed to fetch homepage data, using fallback"

---

## 🐛 Troubleshooting

### Problem 1: "Failed to fetch"
**Solution:** Make sure your backend is running (`php artisan serve`)

### Problem 2: "Empty products"
**Solution:** Seed your database (see Step 3 above)

### Problem 3: "CORS error"
**Solution:** Check that your backend has CORS enabled:
```php
// In config/cors.php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000'],
```

### Problem 4: "Port 8000 already in use"
**Solution:** Either:
- Close the app using port 8000, OR
- Use a different port: `php artisan serve --port=8001`
  Then update `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1`

---

## 📡 API Endpoints Available

Once connected, your frontend can:

### Public Endpoints (No login required)
- ✅ Get all products: `GET /api/v1/products`
- ✅ Get single product: `GET /api/v1/products/{id}`
- ✅ Get categories: `GET /api/v1/categories`
- ✅ Get brands: `GET /api/v1/brands`

### Authenticated Endpoints (Login required)
- 🔒 View cart: `GET /api/v1/cart`
- 🔒 Add to cart: `POST /api/v1/cart`
- 🔒 Wishlist: `GET /api/v1/wishlist`
- 🔒 Create order: `POST /api/v1/orders`

---

## 🧪 Quick Test in Browser

Open this URL in your browser to test the API directly:

```
http://localhost:8000/api/v1/products
```

You should see a JSON response with products!

---

## 📝 Next Steps After Connection

1. ✅ Verify homepage shows real products
2. ✅ Check shop page: `http://localhost:3000/shop`
3. ✅ Test product details
4. ✅ Test user authentication (Sign up/Login)
5. ✅ Test cart functionality

---

## 🎯 Current Configuration

Your `.env.local` file is set to:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_ASSET_URL=http://localhost:8000
```

This means:
- Frontend expects backend at `localhost:8000`
- Product images will load from `http://localhost:8000/storage/...`

---

## 💡 Pro Tips

1. **Keep both terminals open** (frontend + backend)
2. **If you change `.env.local`**, always restart Next.js
3. **Check Network tab** in browser DevTools to see API calls
4. **The fallback data** will show if backend is offline (this is intentional!)

---

**Need help?** Check the browser console (F12) for specific error messages.
