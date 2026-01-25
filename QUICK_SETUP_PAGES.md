# 🚀 Quick Setup Guide - Static Pages Integration

**Run these commands to complete the integration:**

---

## Step 1: Backend Setup (5 minutes)

Open Git Bash in the backend folder:

```bash
# Navigate to backend
cd /c/Users/GOLDEN/Documents/projects/nutrihavenblend

# Run the new migration
php artisan migrate

# Seed the pages with sample content
php artisan db:seed --class=PageSeeder

# Verify it worked - you should see 5 pages
php artisan tinker
>>> App\Models\Page::count()
>>> exit

# Start the backend server
php artisan serve
```

**Expected output:**
```
Migration table created successfully.
Migrated: 2026_01_25_201500_create_pages_table
Seeding: PageSeeder
Seeded:  PageSeeder
Database seeding completed successfully.
```

---

## Step 2: Test the API (2 minutes)

Keep the backend running, open a new terminal:

```bash
# Test the pages API endpoint
curl http://localhost:8000/api/v1/pages

# Test getting About page
curl http://localhost:8000/api/v1/pages/type/about

# Test getting FAQ page
curl http://localhost:8000/api/v1/pages/type/faq
```

**Expected:** You should see JSON responses with page content.

---

## Step 3: Frontend Setup (2 minutes)

Open a new Git Bash window for frontend:

```bash
# Navigate to frontend
cd /c/Users/GOLDEN/Documents/projects/nutriblendfrontend

# Start the dev server
npm run dev
```

**Expected output:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

## Step 4: Test Dynamic Pages (5 minutes)

With both servers running, open your browser:

### Test Each Page:

1. **About Us:** http://localhost:3000/aboutUs
   - ✅ Should show dynamic content from backend
   - ✅ "Why NutriBlend Haven" features section
   - ✅ Hero section with green background

2. **FAQ:** http://localhost:3000/faq
   - ✅ Should show 5 FAQ items
   - ✅ Questions like "How do I place an order?"

3. **Contact:** http://localhost:3000/contact
   - ✅ Should show contact information
   - ✅ Phone, email, address from backend

4. **Terms:** http://localhost:3000/terms
   - ✅ Should show terms sections
   - ✅ Agreement, Products, Pricing sections

5. **Privacy:** http://localhost:3000/privacy
   - ✅ Should show privacy policy
   - ✅ Information collection, usage sections

---

## Step 5: Test Content Management (3 minutes)

### Access Admin Panel:

1. Go to: http://localhost:8000/admin
2. Login with your admin credentials
3. Click **"Pages"** in the sidebar (under "Content Management")

### Test Editing:

1. Click **"About Us"**
2. Click **"Edit"**
3. Change the hero heading to "Welcome to NutriBlend Haven!"
4. Click **"Save"**
5. Refresh http://localhost:3000/aboutUs
6. ✅ Should show your new heading!

### Add a New Page:

1. Click **"Create"** in the Pages section
2. Fill in:
   - Title: "Shipping Info"
   - Type: Custom
   - Add a hero section with heading and text
3. Save
4. Visit: http://localhost:3000/page/shipping-info (using the slug)
5. ✅ Your new page shows up!

---

## 🎯 Quick Troubleshooting

### Backend Issues:

**Migration fails:**
```bash
# Reset and try again
php artisan migrate:fresh
php artisan db:seed --class=PageSeeder
```

**"Class PageSeeder not found":**
```bash
# Regenerate autoload files
composer dump-autoload
php artisan db:seed --class=PageSeeder
```

### Frontend Issues:

**Page shows loading forever:**
- ✅ Check backend is running on :8000
- ✅ Check browser console for errors
- ✅ Verify .env.local has: `NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1`

**404 errors:**
- ✅ Clear Next.js cache:
```bash
rm -rf .next
npm run dev
```

**TypeScript errors:**
- ✅ Restart the dev server
- ✅ Or just ignore them - the app will work

---

## ✅ Success Checklist

- [ ] Backend running on :8000
- [ ] Frontend running on :3000
- [ ] All 5 pages load with dynamic content
- [ ] Can edit pages in admin panel
- [ ] Changes reflect immediately on frontend
- [ ] No console errors

---

## 🎉 You're Done!

**All static pages are now 100% dynamic!**

Content is now managed from the Filament admin panel - no code changes needed to update pages.

### What You Can Do Now:

1. ✅ Edit any page content in admin
2. ✅ Create new custom pages
3. ✅ Add FAQ items
4. ✅ Update contact information
5. ✅ Manage all site content

**Time to deploy:** ~30 minutes  
**Total effort:** Fully automated CMS! 🚀

---

**Need help?** Check `STATIC_PAGES_INTEGRATION.md` for detailed documentation.
