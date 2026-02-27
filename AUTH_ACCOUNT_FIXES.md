# 🔐 AUTH & ACCOUNT PAGE - COMPLETE FIX GUIDE

**Issues Identified:**
1. ❌ Google Sign-In button doesn't work
2. ❌ Regular login/signup doesn't connect to backend
3. ❌ "Account" menu shows for non-logged-in users
4. ❌ Account page shows fake/static data instead of real user data

---

## 🛠️ FIXES TO IMPLEMENT

### **Fix 1: Hide "Account" Menu for Non-Logged-In Users**

**File:** `src/components/layout/Header.tsx` (or wherever the Account link is)

**Before:**
```tsx
<Link href="/account">
  <AccountIcon />
  Account
</Link>
```

**After:**
```tsx
import { useAppSelector } from '@/lib/hooks/redux';

export default function Header() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  
  return (
    <nav>
      {isAuthenticated ? (
        <Link href="/account">
          <AccountIcon />
          {user?.first_name || 'Account'}
        </Link>
      ) : (
        <button onClick={() => setShowLoginModal(true)}>
          <AccountIcon />
          Sign In
        </button>
      )}
    </nav>
  );
}
```

---

### **Fix 2: Connect Login/Signup to Backend**

The login/signup modals are already connected via Redux (`authSlice`), but we need to:

1. **Add AuthProvider to layout** (already created)
2. **Verify API endpoints are correct**
3. **Handle errors properly**

**Update:** `src/app/layout.tsx`

```tsx
import AuthProvider from '@/components/providers/AuthProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <StoreProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
```

---

### **Fix 3: Remove Google Sign-In (or Implement It)**

**Option A: Remove the Button** (Quick Fix)
```tsx
// In SignIn.tsx, comment out or remove:
{/* <button className="...">
  <img src="..." />
  Sign In with Google
</button> */}
```

**Option B: Implement Google OAuth** (Proper Solution)
This requires:
1. Google Cloud Console setup
2. OAuth credentials
3. Backend API endpoint for Google auth
4. Frontend integration with `@react-oauth/google`

**Recommendation:** Remove it for now unless you specifically need it.

---

### **Fix 4: Make Account Page Dynamic**

**File:** `src/app/account/page.tsx` (or wherever account page is)

**Before:** Shows static fake data

**After:**
```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/hooks/redux';
import { fetchUserProfile } from '@/lib/features/auth/authSlice';

export default function AccountPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Redirect if not logged in
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    // Fetch fresh user data
    dispatch(fetchUserProfile());
  }, [isAuthenticated, dispatch, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="account-page">
      <h1>Welcome, {user.first_name}!</h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      
      {/* Real orders from backend */}
      <OrdersList userId={user.id} />
    </div>
  );
}
```

---

### **Fix 5: Fetch Real Orders**

Create a new component for orders:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';

export default function OrdersList({ userId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await apiClient.getOrders();
        if (response.status && response.data) {
          setOrders(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (orders.length === 0) {
    return <div>No orders yet</div>;
  }

  return (
    <div className="orders-list">
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <h3>Order #{order.order_number}</h3>
          <p>Status: {order.status}</p>
          <p>Total: UGX {order.total_amount}</p>
          <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## ✅ IMPLEMENTATION CHECKLIST

### **Step 1: Auth Persistence**
- [ ] Add `AuthProvider` to `layout.tsx`
- [ ] Test login persistence on refresh

### **Step 2: Conditional Menu**
- [ ] Update header to show "Sign In" when logged out
- [ ] Show user name when logged in

### **Step 3: Account Page**
- [ ] Make account page check authentication
- [ ] Redirect to home if not logged in
- [ ] Fetch real user data
- [ ] Fetch real orders

### **Step 4: Remove/Fix Google Sign-In**
- [ ] Either remove the button or implement OAuth

### **Step 5: Testing**
- [ ] Test login flow
- [ ] Test signup flow
- [ ] Test account page access
- [ ] Test logout
- [ ] Test persistence on refresh

---

## 🚀 QUICK WINS (Do These First)

1. **Add AuthProvider** - This will make login persist
2. **Hide Account link** - Show only when logged in
3. **Remove Google button** - It's not functional anyway
4. **Add auth check to account page** - Redirect if not logged in

---

**Ready to implement these fixes?**
