# 🎊 NutriBlend Haven - Frontend Integration Guide

## 📋 Table of Contents
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Authentication](#authentication)
- [Core Features](#core-features)
- [React Hooks](#react-hooks)
- [Complete Examples](#complete-examples)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

---

## 🚀 Quick Start

### Step 1: Environment Setup
Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_ASSET_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 2: Install Dependencies (Already Done!)
Your project already has everything configured. Just ensure you've run:

```bash
npm install
```

### Step 3: Start Development
```bash
npm run dev
```

---

## ⚙️ Configuration

### Base URL Configuration
The API client automatically reads from environment variables:

```javascript
// Already configured in src/lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
```

### Authentication Pattern
All authenticated requests automatically include:

```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

**You don't need to manually add headers!** The API client handles this automatically.

---

## 🔐 Authentication

### Login
```typescript
import { apiClient } from '@/lib/api/client';

async function handleLogin(email: string, password: string) {
  const response = await apiClient.login({ email, password });
  
  if (response.status && response.data) {
    // Token is automatically stored in localStorage
    const { user, token } = response.data;
    console.log('Logged in as:', user.first_name);
    // Redirect to dashboard or home
  } else {
    console.error('Login failed:', response.message);
  }
}
```

### Register
```typescript
async function handleRegister(userData: {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}) {
  const response = await apiClient.register(userData);
  
  if (response.status && response.data) {
    // User is automatically logged in
    const { user, token } = response.data;
    console.log('Registered successfully:', user);
  } else {
    console.error('Registration failed:', response.errors);
  }
}
```

### Logout
```typescript
async function handleLogout() {
  const response = await apiClient.logout();
  
  if (response.status) {
    // User data and token are automatically cleared
    // Redirect to login page
    window.location.href = '/login';
  }
}
```

### Get Current User Profile
```typescript
async function loadProfile() {
  const response = await apiClient.getProfile();
  
  if (response.status && response.data) {
    console.log('User profile:', response.data);
  }
}
```

### Check Authentication Status
```typescript
import { isAuthenticated, getStoredUser } from '@/lib/api/client';

// Check if user is logged in
if (isAuthenticated()) {
  const user = getStoredUser();
  console.log('Current user:', user);
}
```

---

## 💡 Core Features

### 1️⃣ Product Management

#### Get All Products
```typescript
async function loadProducts() {
  const response = await apiClient.getProducts({
    page: 1,
    per_page: 20,
    search: 'protein',
    category_id: 5,
    min_price: 10000,
    max_price: 100000,
    is_featured: true,
    sort: 'price_asc' // or 'price_desc', 'name_asc', 'name_desc', 'newest'
  });
  
  if (response.status && response.data) {
    const { data: products, total, current_page, last_page } = response.data;
    console.log(`Showing ${products.length} of ${total} products`);
  }
}
```

#### Get Single Product
```typescript
async function loadProduct(productId: number) {
  const response = await apiClient.getProduct(productId);
  
  if (response.status && response.data) {
    const product = response.data;
    console.log('Product:', product.name);
    console.log('Price:', product.price);
    console.log('Stock:', product.stock_quantity);
    console.log('Images:', product.images);
    console.log('Variations:', product.variations);
  }
}
```

#### Get Categories & Brands
```typescript
// Load all categories
const categoriesResponse = await apiClient.getCategories();
if (categoriesResponse.status && categoriesResponse.data) {
  console.log('Categories:', categoriesResponse.data);
}

// Load all brands
const brandsResponse = await apiClient.getBrands();
if (brandsResponse.status && brandsResponse.data) {
  console.log('Brands:', brandsResponse.data);
}
```

### 2️⃣ Shopping Cart Management

#### Add to Cart
```typescript
async function addToCart(productId: number, quantity: number, variationId?: number) {
  const response = await apiClient.addToCart({
    product_id: productId,
    quantity: quantity,
    variation_id: variationId // Optional: for product variations
  });
  
  if (response.status && response.data) {
    const cart = response.data;
    console.log('Cart updated!');
    console.log('Items:', cart.items);
    console.log('Subtotal:', cart.subtotal);
    console.log('Tax:', cart.tax);
    console.log('Total:', cart.total);
  }
}
```

#### Get Cart
```typescript
async function loadCart() {
  const response = await apiClient.getCart();
  
  if (response.status && response.data) {
    const { items, subtotal, tax, total, item_count } = response.data;
    console.log(`Cart has ${item_count} items`);
  }
}
```

#### Update Cart Item Quantity
```typescript
async function updateQuantity(cartItemId: number, newQuantity: number) {
  const response = await apiClient.updateCartItem(cartItemId, newQuantity);
  
  if (response.status && response.data) {
    console.log('Cart updated!', response.data);
  }
}
```

#### Remove from Cart
```typescript
async function removeItem(cartItemId: number) {
  const response = await apiClient.removeFromCart(cartItemId);
  
  if (response.status && response.data) {
    console.log('Item removed!', response.data);
  }
}
```

#### Clear Cart
```typescript
async function clearEntireCart() {
  const response = await apiClient.clearCart();
  
  if (response.status) {
    console.log('Cart cleared!');
  }
}
```

### 3️⃣ Wishlist Management

#### Add to Wishlist
```typescript
async function addToWishlist(productId: number) {
  const response = await apiClient.addToWishlist(productId);
  
  if (response.status && response.data) {
    console.log('Added to wishlist:', response.data);
  }
}
```

#### Get Wishlist
```typescript
async function loadWishlist() {
  const response = await apiClient.getWishlist();
  
  if (response.status && response.data) {
    const items = response.data;
    console.log('Wishlist items:', items);
  }
}
```

#### Remove from Wishlist
```typescript
async function removeFromWishlist(productId: number) {
  const response = await apiClient.removeFromWishlist(productId);
  
  if (response.status) {
    console.log('Removed from wishlist');
  }
}
```

#### Move to Cart
```typescript
async function moveWishlistToCart(productId: number, quantity: number = 1) {
  const response = await apiClient.moveToCart(productId, quantity);
  
  if (response.status && response.data) {
    console.log('Moved to cart!', response.data);
  }
}
```

### 4️⃣ Delivery & Regions

#### Get Regions
```typescript
async function loadRegions() {
  const response = await apiClient.getRegions();
  
  if (response.status && response.data) {
    const regions = response.data;
    console.log('Available regions:', regions);
  }
}
```

#### Get Towns by Region
```typescript
async function loadTowns(regionId: number) {
  const response = await apiClient.getTowns(regionId);
  
  if (response.status && response.data) {
    const towns = response.data;
    console.log('Towns:', towns);
  }
}
```

#### Calculate Delivery Fee
```typescript
async function calculateDelivery(regionId: number, townId: number) {
  const response = await apiClient.calculateDeliveryFee({
    region_id: regionId,
    town_id: townId
  });
  
  if (response.status && response.data) {
    console.log('Delivery fee:', response.data.fee);
  }
}
```

### 5️⃣ Discount Codes

#### Validate Discount Code
```typescript
async function applyDiscount(code: string, totalAmount: number) {
  const response = await apiClient.validateDiscount({
    code: code,
    total_amount: totalAmount
  });
  
  if (response.status && response.data) {
    const { discount_amount, final_amount, discount } = response.data;
    console.log('Discount applied!');
    console.log('Discount amount:', discount_amount);
    console.log('Final amount:', final_amount);
  } else {
    console.error('Invalid discount code:', response.message);
  }
}
```

#### Get Active Discounts
```typescript
async function loadActiveDiscounts() {
  const response = await apiClient.getActiveDiscounts();
  
  if (response.status && response.data) {
    console.log('Available discounts:', response.data);
  }
}
```

### 6️⃣ Orders & Checkout

#### Complete Checkout (Create Order)
```typescript
async function completeCheckout(checkoutData: {
  items: { product_id: number; quantity: number; variation_id?: number }[];
  delivery_region_id: number;
  delivery_town_id: number;
  delivery_address: string;
  discount_code?: string;
  notes?: string;
}) {
  const response = await apiClient.createOrder(checkoutData);
  
  if (response.status && response.data) {
    const order = response.data;
    console.log('Order created!');
    console.log('Order number:', order.order_number);
    console.log('Total:', order.total_amount);
    console.log('Status:', order.status);
  }
}
```

#### Get All Orders
```typescript
async function loadOrders(page: number = 1, status?: string) {
  const response = await apiClient.getOrders({ page, status });
  
  if (response.status && response.data) {
    const { data: orders, total } = response.data;
    console.log(`Showing ${orders.length} of ${total} orders`);
  }
}
```

#### Get Single Order
```typescript
async function loadOrder(orderNumber: string) {
  const response = await apiClient.getOrder(orderNumber);
  
  if (response.status && response.data) {
    const order = response.data;
    console.log('Order:', order);
  }
}
```

#### Cancel Order
```typescript
async function cancelOrder(orderNumber: string) {
  const response = await apiClient.cancelOrder(orderNumber);
  
  if (response.status && response.data) {
    console.log('Order cancelled:', response.data);
  }
}
```

#### Download Invoice
```typescript
function downloadInvoice(orderNumber: string) {
  const invoiceUrl = apiClient.getInvoiceUrl(orderNumber);
  window.open(invoiceUrl, '_blank');
}
```

### 7️⃣ Notifications

#### Get Notifications
```typescript
async function loadNotifications(page: number = 1) {
  const response = await apiClient.getNotifications(page);
  
  if (response.status && response.data) {
    const { data: notifications, total } = response.data;
    console.log(`${total} notifications`);
  }
}
```

#### Get Unread Count
```typescript
async function getUnreadCount() {
  const response = await apiClient.getUnreadCount();
  
  if (response.status && response.data) {
    console.log('Unread notifications:', response.data.unread_count);
  }
}
```

#### Mark as Read
```typescript
async function markNotificationAsRead(notificationId: number) {
  const response = await apiClient.markAsRead(notificationId);
  
  if (response.status) {
    console.log('Notification marked as read');
  }
}
```

#### Mark All as Read
```typescript
async function markAllAsRead() {
  const response = await apiClient.markAllAsRead();
  
  if (response.status) {
    console.log('All notifications marked as read');
  }
}
```

---

## 🪝 React Hooks

### useAuth Hook
```typescript
// Usage example
import { useAuth } from '@/lib/hooks/useAuth';

function MyComponent() {
  const { user, isLoading, isAuthenticated, login, register, logout, updateProfile } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <button onClick={() => login('test@example.com', 'password')}>Login</button>;
  }
  
  return (
    <div>
      <p>Welcome, {user?.first_name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### useCart Hook
```typescript
// Usage example
import { useCart } from '@/lib/hooks/useCart';

function CartComponent() {
  const { cart, isLoading, addItem, updateItem, removeItem, clearCart } = useCart();
  
  if (isLoading) return <div>Loading cart...</div>;
  
  return (
    <div>
      <h2>Cart ({cart?.item_count} items)</h2>
      <p>Total: {cart?.total}</p>
      
      <button onClick={() => addItem(1, 2)}>Add Product</button>
      <button onClick={() => clearCart()}>Clear Cart</button>
    </div>
  );
}
```

---

## 📦 Complete Checkout Flow Example

Here's a complete, production-ready checkout implementation:

```typescript
import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import type { CartSummary, Region, Town } from '@/lib/api/client';

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [towns, setTowns] = useState<Town[]>([]);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  
  const [formData, setFormData] = useState({
    region_id: 0,
    town_id: 0,
    delivery_address: '',
    discount_code: '',
    notes: ''
  });
  
  // Step 1: Load cart
  useEffect(() => {
    loadCart();
    loadRegions();
  }, []);
  
  async function loadCart() {
    const response = await apiClient.getCart();
    if (response.status && response.data) {
      setCart(response.data);
    }
  }
  
  async function loadRegions() {
    const response = await apiClient.getRegions();
    if (response.status && response.data) {
      setRegions(response.data);
    }
  }
  
  // Step 2: Handle region selection
  async function handleRegionChange(regionId: number) {
    setFormData({ ...formData, region_id: regionId, town_id: 0 });
    
    const response = await apiClient.getTowns(regionId);
    if (response.status && response.data) {
      setTowns(response.data);
    }
  }
  
  // Step 3: Calculate delivery fee when town is selected
  async function handleTownChange(townId: number) {
    setFormData({ ...formData, town_id: townId });
    
    const response = await apiClient.calculateDeliveryFee({
      region_id: formData.region_id,
      town_id: townId
    });
    
    if (response.status && response.data) {
      setDeliveryFee(response.data.fee);
    }
  }
  
  // Step 4: Validate discount code
  async function handleDiscountCode() {
    if (!formData.discount_code || !cart) return;
    
    const response = await apiClient.validateDiscount({
      code: formData.discount_code,
      total_amount: cart.total + deliveryFee
    });
    
    if (response.status && response.data) {
      setDiscountAmount(response.data.discount_amount);
      alert(`Discount applied! Save ${response.data.discount_amount}`);
    } else {
      alert('Invalid discount code');
    }
  }
  
  // Step 5: Complete checkout
  async function handleCheckout() {
    if (!cart || cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    if (!formData.region_id || !formData.town_id || !formData.delivery_address) {
      alert('Please fill in all delivery details');
      return;
    }
    
    const orderData = {
      items: cart.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        variation_id: item.variation_id
      })),
      delivery_region_id: formData.region_id,
      delivery_town_id: formData.town_id,
      delivery_address: formData.delivery_address,
      discount_code: formData.discount_code || undefined,
      notes: formData.notes || undefined
    };
    
    const response = await apiClient.createOrder(orderData);
    
    if (response.status && response.data) {
      const order = response.data;
      alert(`Order ${order.order_number} created successfully!`);
      
      // Clear cart and redirect
      await apiClient.clearCart();
      window.location.href = `/orders/${order.order_number}`;
    } else {
      alert(`Checkout failed: ${response.message}`);
    }
  }
  
  // Calculate final total
  const finalTotal = cart ? cart.total + deliveryFee - discountAmount : 0;
  
  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      
      {/* Cart Summary */}
      <div className="cart-summary">
        <h2>Order Summary</h2>
        <p>Subtotal: {cart?.subtotal}</p>
        <p>Tax: {cart?.tax}</p>
        <p>Delivery: {deliveryFee}</p>
        {discountAmount > 0 && <p>Discount: -{discountAmount}</p>}
        <h3>Total: {finalTotal}</h3>
      </div>
      
      {/* Delivery Details */}
      <div className="delivery-details">
        <h2>Delivery Information</h2>
        
        <select onChange={(e) => handleRegionChange(Number(e.target.value))}>
          <option value="">Select Region</option>
          {regions.map(region => (
            <option key={region.id} value={region.id}>{region.name}</option>
          ))}
        </select>
        
        <select onChange={(e) => handleTownChange(Number(e.target.value))}>
          <option value="">Select Town</option>
          {towns.map(town => (
            <option key={town.id} value={town.id}>
              {town.name} - Fee: {town.delivery_fee}
            </option>
          ))}
        </select>
        
        <textarea
          placeholder="Delivery Address"
          value={formData.delivery_address}
          onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
        />
        
        <textarea
          placeholder="Order Notes (Optional)"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>
      
      {/* Discount Code */}
      <div className="discount-section">
        <input
          type="text"
          placeholder="Discount Code"
          value={formData.discount_code}
          onChange={(e) => setFormData({ ...formData, discount_code: e.target.value })}
        />
        <button onClick={handleDiscountCode}>Apply</button>
      </div>
      
      {/* Complete Order */}
      <button onClick={handleCheckout} className="btn-primary">
        Complete Order
      </button>
    </div>
  );
}
```

---

## 🛠️ Helper Functions

### Image URL Helper
```typescript
import { getImageUrl } from '@/lib/api/client';

// Automatically handles localhost and production URLs
const imageUrl = getImageUrl(product.images[0].image_path);

// Usage in component
<img src={getImageUrl(product.images[0].image_path)} alt={product.name} />
```

### Price Formatting
```typescript
import { formatPrice } from '@/lib/api/client';

const formatted = formatPrice(50000); // "UGX 50,000"
const usd = formatPrice(100, 'USD'); // "$100.00"
```

### Discount Calculation
```typescript
import { calculateDiscount } from '@/lib/api/client';

const originalPrice = 100000;
const discountPercentage = 20;
const finalPrice = calculateDiscount(originalPrice, discountPercentage);
// Result: 80000
```

---

## ⚠️ Error Handling

All API responses follow this structure:

```typescript
interface ApiResponse<T> {
  status: boolean;        // true = success, false = error
  message: string;        // Human-readable message
  data?: T;              // Response data (only on success)
  errors?: Record<string, string[]>;  // Validation errors
  error?: string;        // Error message
}
```

### Example Error Handling
```typescript
async function exampleFunction() {
  const response = await apiClient.getProducts();
  
  if (response.status && response.data) {
    // Success!
    console.log('Products:', response.data);
  } else {
    // Error occurred
    console.error('Error:', response.message);
    
    // Check for validation errors
    if (response.errors) {
      Object.entries(response.errors).forEach(([field, messages]) => {
        console.error(`${field}: ${messages.join(', ')}`);
      });
    }
  }
}
```

---

## ✅ Best Practices

### 1. Always Check Response Status
```typescript
const response = await apiClient.getProducts();
if (response.status && response.data) {
  // Use response.data safely
}
```

### 2. Handle Loading States
```typescript
const [isLoading, setIsLoading] = useState(false);

async function loadData() {
  setIsLoading(true);
  try {
    const response = await apiClient.getProducts();
    // Handle response
  } finally {
    setIsLoading(false);
  }
}
```

### 3. Protect Authenticated Routes
```typescript
import { isAuthenticated } from '@/lib/api/client';
import { redirect } from 'next/navigation';

export default function ProtectedPage() {
  if (!isAuthenticated()) {
    redirect('/login');
  }
  
  return <div>Protected content</div>;
}
```

### 4. Use TypeScript Types
```typescript
import type { Product, User, Order } from '@/lib/api/client';

const [products, setProducts] = useState<Product[]>([]);
const [user, setUser] = useState<User | null>(null);
```

---

## 📚 Additional Resources

- **Swagger Documentation**: `http://localhost:8000/api/documentation`
- **API Testing Examples**: See `API_TESTING_EXAMPLES.md`
- **Backend Repository**: Check backend documentation for detailed API specifications

---

## 🎊 That's It!

Everything you need is ready to use:
- ✅ Complete API client with all functions
- ✅ Authentication handled automatically
- ✅ TypeScript types for all data
- ✅ Helper functions for common tasks
- ✅ Error handling built-in
- ✅ React hooks for auth and cart

**Just import and use! No additional setup required!** 🚀
