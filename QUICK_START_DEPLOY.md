# ⚡ Quick Start: Deploy NutriBlend in 5 Minutes

**The FASTEST way to get your site live with automatic updates!**

---

## 🚀 Option 1: Vercel (Recommended - 5 Minutes)

### Step 1: Sign Up (1 minute)
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your repositories

### Step 2: Import Project (2 minutes)
1. Click "Add New Project"
2. Find and select `nutriblendfrontend` repository
3. Click "Import"

### Step 3: Configure (1 minute)
Add environment variables:

```env
NEXT_PUBLIC_API_URL=https://admin.rasmuspharmaceuticals.com/api/v1
NEXT_PUBLIC_ASSET_URL=https://admin.rasmuspharmaceuticals.com
```

### Step 4: Deploy (1 minute)
1. Click "Deploy"
2. Wait ~2 minutes
3. **DONE!** Your site is live! 🎉

### 🔄 Continuous Updates - Already Enabled!
Every time you push code to GitHub, your site updates automatically!

```bash
# Make changes to your code
git add .
git commit -m "Updated homepage"
git push

# Vercel automatically:
# ✅ Builds your site
# ✅ Deploys updates
# ✅ Sends you a notification
```

---

## 🟦 Option 2: Netlify (Alternative - 5 Minutes)

Same process as Vercel:

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. "Add new site" → "Import existing project"
4. Select your repository
5. Build command: `npm run build`
6. Publish directory: `out`
7. Add environment variables (same as above)
8. Deploy!

---

## 🌐 Option 3: Your Own cPanel Hosting

### Prerequisites
- cPanel hosting account
- FTP credentials

### Quick Setup (10 Minutes)

#### 1. Build Your Site Locally
```bash
cd C:\Users\GOLDEN\Documents\projects\nutriblendfrontend
npm run build
```

This creates an `out` folder with your static website.

#### 2. Upload to cPanel
1. Open cPanel File Manager
2. Go to `public_html` folder
3. Upload all files from the `out` folder
4. Upload `.htaccess` from `public_html/.htaccess`

#### 3. Set Up Auto-Updates (GitHub Actions)

Add these secrets in GitHub (Settings → Secrets):

```
FTP_SERVER=your-ftp-server.com
FTP_USERNAME=your-username
FTP_PASSWORD=your-password
FTP_FRONTEND_DIR=/public_html/
PRODUCTION_API_URL=https://admin.rasmuspharmaceuticals.com/api/v1
PRODUCTION_ASSET_URL=https://admin.rasmuspharmaceuticals.com
```

**Now every push to GitHub automatically updates your live site!**

---

## ✅ Verification Checklist

After deployment, check:

- [ ] Homepage loads ✅
- [ ] Products display correctly ✅
- [ ] Images load from backend ✅
- [ ] Shop page works ✅
- [ ] Product detail pages open ✅
- [ ] Cart functionality works ✅
- [ ] Mobile view looks good ✅

---

## 🎯 My Recommendation

**Use Vercel!** Here's why:

| Feature | Vercel | Netlify | cPanel |
|---------|--------|---------|--------|
| Setup Time | 5 min | 5 min | 15 min |
| Auto-Deploy | ✅ Yes | ✅ Yes | ⚠️ Need GitHub Actions |
| SSL/HTTPS | ✅ Free | ✅ Free | 💰 Depends |
| CDN | ✅ Global | ✅ Global | ❌ No |
| Next.js Optimized | ✅ Yes | ⚠️ Basic | ❌ No |
| Cost | 💰 Free* | 💰 Free* | 💰 Varies |

*Free tier: 100GB bandwidth/month - more than enough for most sites!

---

## 🚀 Start Now!

**Absolute quickest path:**

1. Open [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your `nutriblendfrontend` repository
4. Add the 2 environment variables
5. Click Deploy

**That's it! Your site is live in 5 minutes! 🎉**

---

## 🔄 How Updates Work After Deployment

```
You write code → Push to GitHub → Site updates automatically!
```

**Example:**
```bash
# 1. Make a change
# Edit src/app/page.tsx

# 2. Commit and push
git add .
git commit -m "Updated homepage hero"
git push

# 3. Wait ~2 minutes
# Check your email or Vercel dashboard

# 4. Site is updated! 🎉
```

---

## ❓ Need Help?

See the full [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions and troubleshooting.

---

**You're 5 minutes away from having a live website with automatic updates! Go! 🚀**
