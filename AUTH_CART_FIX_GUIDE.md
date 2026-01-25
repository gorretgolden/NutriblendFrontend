# 🔧 AUTH & CART FIX - Making Everything Dynamic

## ✅ Current Status

### **What's Already Working:**
- ✅ Login API integration (authSlice.ts)
- ✅ Register API integration (authSlice.ts)
- ✅ Logout API integration (authSlice.ts)
- ✅ API Client methods (client.ts)

### **What Needs Fixing:**
- ⚠️ Cart is using local state only (not synced with backend)
- ⚠️ Auth state not persisting on page refresh
- ⚠️ Cart count not showing in header

---

## 🔍 Issues Found

### **1. Cart Not Using Backend API**

**Current Implementation:**
```typescript
// cartsSlice.ts - LOCAL ONLY
addToCart: (state, action) => {
  // Just updates Redux state
  // NOT synced with backend
}
```

**What Should Happen:**
```typescript
// Should call backend API
POST /api/v1/cart
{
  "product_id": 1,
  "quantity": 2
}
```

---

### **2. Auth Not Persisting**

**Issue:** When user refreshes page, they get logged out

**Solution:** Load auth from localStorage on app start

---

### **3. Cart Count Not Showing**

**Issue:** Header doesn't show cart item count

**Solution:** Connect cart count to Redux state

---

## 🚀 Quick Fixes

### **Fix 1: Persist Auth State**

Create `src/lib/store/persistAuth.ts`:

```typescript
import { setCredentials } from '@/lib/features/auth/authSlice';
import { AppDispatch } from './store';

export const loadAuthFromStorage = (dispatch: AppDispatch) => {
  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('user');
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      dispatch(setCredentials({ user, token }));
    } catch (error) {
      console.error('Failed to load auth from storage', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }
};
```

Then in `src/app/layout.tsx` or root component:

```typescript
'use client';
import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/hooks/redux';
import { loadAuthFromStorage } from '@/lib/store/persistAuth';

export default function RootLayout({ children }) {
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    loadAuthFromStorage(dispatch);
  }, [dispatch]);
  
  return children;
}
```

---

### **Fix 2: Connect Cart to Backend**

Update `cartsSlice.ts` to use async thunks:

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api/client';

// Fetch cart from backend
export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.getCart();
      if (response.status && response.data) {
        return response.data;
      }
      return rejectWithValue('Failed to fetch cart');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Add to cart (backend)
export const addToCartAsync = createAsyncThunk(
  'cart/add',
  async (item: { product_id: number; quantity: number }, { rejectWithValue }) => {
    try {
      const response = await apiClient.addToCart(item);
      if (response.status && response.data) {
        return response.data;
      }
      return rejectWithValue('Failed to add to cart');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Remove from cart (backend)
export const removeFromCartAsync = createAsyncThunk(
  'cart/remove',
  async (itemId: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.removeFromCart(itemId);
      if (response.status) {
        return itemId;
      }
      return rejectWithValue('Failed to remove from cart');
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
```

---

### **Fix 3: Show Cart Count in Header**

Update header component:

```typescript
import { useAppSelector } from '@/lib/hooks/redux';

export default function Header() {
  const { cart } = useAppSelector((state) => state.carts);
  const cartCount = cart?.totalQuantities || 0;
  
  return (
    <div className="cart-icon">
      <ShoppingCartIcon />
      {cartCount > 0 && (
        <span className="cart-badge">{cartCount}</span>
      )}
    </div>
  );
}
```

---

## 📝 Implementation Steps

### **Step 1: Test Current Auth**

```bash
# Start servers
php artisan serve  # Backend
npm run dev        # Frontend

# Test login
1. Go to http://localhost:3000
2. Click "Account" or "Sign In"
3. Enter credentials
4. Should login successfully
5. Refresh page
6. Should stay logged in (after fix)
```

### **Step 2: Verify API Endpoints**

```bash
# Test login endpoint
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Should return:
{
  "status": true,
  "data": {
    "user": {...},
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### **Step 3: Test Cart API**

```bash
# Get cart (requires auth)
curl -X GET http://localhost:8000/api/v1/cart \
  -H "Authorization: Bearer YOUR_TOKEN"

# Add to cart
curl -X POST http://localhost:8000/api/v1/cart \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"product_id":1,"quantity":2}'
```

---

## ✅ Testing Checklist

### **Auth Testing:**
- [ ] Login works
- [ ] Register works
- [ ] Logout works
- [ ] Auth persists on refresh
- [ ] Token stored in localStorage
- [ ] User data stored in localStorage
- [ ] Protected routes work

### **Cart Testing:**
- [ ] Add to cart works
- [ ] Cart count shows in header
- [ ] Cart persists on refresh
- [ ] Remove from cart works
- [ ] Cart syncs with backend
- [ ] Cart works for guest users (local)
- [ ] Cart works for logged-in users (backend)

---

## 🎯 Expected Behavior

### **For Guest Users:**
- Cart stored in localStorage
- Cart persists on refresh
- Cart count shows in header
- On login, local cart merges with backend cart

### **For Logged-In Users:**
- Cart stored in backend
- Cart syncs across devices
- Cart count shows in header
- Cart persists even after logout/login

---

## 🔧 Quick Fix Commands

```bash
# If auth not working, check:
1. Backend running: php artisan serve
2. Frontend running: npm run dev
3. Check browser console for errors
4. Check Network tab for API calls
5. Verify localStorage has auth_token

# If cart not working, check:
1. Redux DevTools shows cart state
2. API calls in Network tab
3. Backend cart table has data
4. User is authenticated for backend cart
```

---

## 📞 Support

**If issues persist:**

1. **Clear all cache:**
   ```javascript
   localStorage.clear();
   // Refresh page
   ```

2. **Check Redux state:**
   - Install Redux DevTools
   - Check auth state
   - Check cart state

3. **Check API responses:**
   - Open Network tab
   - Look for failed requests
   - Check response data

---

## ✅ Summary

**Current Status:**
- ✅ Auth API: Working
- ✅ Login/Register/Logout: Working
- ⚠️ Auth Persistence: Needs fix
- ⚠️ Cart Backend Sync: Needs implementation
- ⚠️ Cart Count Display: Needs connection

**Next Steps:**
1. Implement auth persistence
2. Connect cart to backend API
3. Show cart count in header
4. Test everything end-to-end

---

**All code examples provided above!**  
**Ready to implement!** 🚀
