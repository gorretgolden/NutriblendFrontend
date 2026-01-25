# 🚀 NutriBlend Frontend Deployment Guide

**Complete guide for deploying the NutriBlend Next.js frontend with continuous updates**

---

## 📋 Table of Contents
1. [Deployment Options](#deployment-options)
2. [Option 1: Vercel (Recommended - Easiest)](#option-1-vercel-recommended)
3. [Option 2: cPanel/Shared Hosting](#option-2-cpanel-shared-hosting)
4. [Option 3: Netlify](#option-3-netlify)
5. [Continuous Updates (CI/CD)](#continuous-updates-cicd)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Deployment Options

| Option | Difficulty | Auto-Updates | Cost | Best For |
|--------|-----------|--------------|------|----------|
| **Vercel** | ⭐ Easiest | ✅ Yes | Free tier available | Next.js projects (recommended!) |
| **Netlify** | ⭐⭐ Easy | ✅ Yes | Free tier available | Static sites |
| **cPanel** | ⭐⭐⭐ Medium | ✅ Yes (with GitHub Actions) | Depends on host | Existing cPanel hosting |

---

## 🟢 Option 1: Vercel (Recommended)

**Why Vercel?**
- ✅ Built specifically for Next.js
- ✅ Zero configuration needed
- ✅ Automatic deployments on every git push
- ✅ Free SSL certificates
- ✅ Global CDN
- ✅ Free tier includes 100GB bandwidth/month

### Step-by-Step Setup (5 minutes!)

#### 1. Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub"

#### 2. Import Your Project
1. Click "Add New Project"
2. Select your `nutriblendfrontend` repository
3. Vercel will auto-detect it's a Next.js project

#### 3. Configure Environment Variables
Add these in Vercel's environment settings:

```env
NEXT_PUBLIC_API_URL=https://admin.rasmuspharmaceuticals.com/api/v1
NEXT_PUBLIC_ASSET_URL=https://admin.rasmuspharmaceuticals.com
```

#### 4. Deploy!
1. Click "Deploy"
2. Wait 2-3 minutes
3. Your site is live! 🎉

#### 5. Enable Continuous Updates
**Done automatically!** Every time you push to GitHub, Vercel will:
- Build your site
- Run tests
- Deploy automatically
- Give you a preview URL

### Custom Domain Setup (Optional)
1. Buy a domain (e.g., `nutriblend.com`)
2. In Vercel dashboard → Settings → Domains
3. Add your domain
4. Update your DNS records (Vercel provides instructions)

---

## 🟡 Option 2: cPanel/Shared Hosting

**Best if you already have cPanel hosting.**

### Prerequisites
- cPanel hosting account
- FTP access credentials
- GitHub repository set up

### Step 1: Prepare Your Project

The project is already configured! We added:
- ✅ `output: 'export'` in `next.config.mjs`
- ✅ `.htaccess` file for clean URLs
- ✅ GitHub Actions workflows

### Step 2: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

#### FTP Credentials
```
FTP_SERVER=ftp.yoursite.com
FTP_USERNAME=your_username
FTP_PASSWORD=your_password
```

#### Production Environment
```
PRODUCTION_API_URL=https://admin.rasmuspharmaceuticals.com/api/v1
PRODUCTION_ASSET_URL=https://admin.rasmuspharmaceuticals.com
PRODUCTION_URL=https://yoursite.com
FTP_FRONTEND_DIR=/public_html/
```

#### Testing Environment (Optional)
```
TESTING_API_URL=https://testing.rasmuspharmaceuticals.com/api/v1
TESTING_ASSET_URL=https://testing.rasmuspharmaceuticals.com
TESTING_URL=https://testing.yoursite.com
FTP_TESTING_DIR=/public_html/testing/
```

### Step 3: Manual First Deployment

Before using CI/CD, test manually:

```bash
# 1. Build the project
npm run build

# 2. This creates an 'out' folder with static files

# 3. Upload the contents of 'out' folder to your cPanel:
#    - Via FTP client (FileZilla)
#    - Or cPanel File Manager
#    - Destination: public_html/
```

### Step 4: Enable Automatic Deployments

Once secrets are configured:

#### Testing Server (Auto-Deploy)
- Pushes to `main` or `master` branch automatically deploy to testing
- No action needed! Just push your code

#### Production Server (Manual Trigger)
1. Go to GitHub → Actions tab
2. Select "🚀 Deploy to Production"
3. Click "Run workflow"
4. Choose branch → Run workflow

### Step 5: Verify Deployment

Visit your site and check:
- ✅ Homepage loads
- ✅ Products display correctly
- ✅ Images load from backend
- ✅ Navigation works

---

## 🔵 Option 3: Netlify

Similar to Vercel but with different features.

### Quick Setup

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Select your repository
5. Build settings:
   ```
   Build command: npm run build
   Publish directory: out
   ```
6. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://admin.rasmuspharmaceuticals.com/api/v1
   NEXT_PUBLIC_ASSET_URL=https://admin.rasmuspharmaceuticals.com
   ```
7. Deploy!

---

## 🔄 Continuous Updates (CI/CD)

### How It Works

```mermaid
graph LR
    A[You push code to GitHub] --> B[GitHub Actions triggered]
    B --> C[Build Next.js site]
    C --> D[Run tests]
    D --> E[Deploy to server]
    E --> F[Site updated live! 🎉]
```

### Workflow Files Created

We created 3 workflow files in `.github/workflows/`:

1. **`deploy-testing.yml`** - Auto-deploys to testing on every push
2. **`deploy-production.yml`** - Manual deploy to production
3. **`deploy-vercel.yml`** - Auto-deploys to Vercel

### Monitoring Deployments

1. Go to GitHub → Actions tab
2. See all deployment history
3. Click any deployment to see logs
4. Check for errors or success ✅

---

## 🎛️ Environment Configuration

### Local Development
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_ASSET_URL=http://localhost:8000
```

### Testing Server
```env
# Configured in GitHub Secrets
NEXT_PUBLIC_API_URL=https://testing.rasmuspharmaceuticals.com/api/v1
NEXT_PUBLIC_ASSET_URL=https://testing.rasmuspharmaceuticals.com
```

### Production Server
```env
# Configured in GitHub Secrets or Vercel
NEXT_PUBLIC_API_URL=https://admin.rasmuspharmaceuticals.com/api/v1
NEXT_PUBLIC_ASSET_URL=https://admin.rasmuspharmaceuticals.com
```

---

## 🐛 Troubleshooting

### Issue: Build fails with "output: export" error

**Solution:** Some features don't work with static export:
- ❌ Server-side rendering (SSR)
- ❌ API routes
- ❌ Image optimization (use `unoptimized: true`)

We already configured this in `next.config.mjs` ✅

### Issue: 404 errors on page refresh

**Solution:** Ensure `.htaccess` is properly configured (already done!)

### Issue: Images not loading

**Check:**
1. Backend is running and accessible
2. CORS is enabled on backend
3. `NEXT_PUBLIC_API_URL` is correct

### Issue: GitHub Actions deployment fails

**Check:**
1. All secrets are correctly set in GitHub
2. FTP credentials are valid
3. Server directory paths are correct
4. View deployment logs in Actions tab

### Issue: Site shows old version after deployment

**Solutions:**
1. Hard refresh browser: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Clear browser cache
3. Check deployment logs to ensure it completed

---

## 📊 Deployment Checklist

Before going live:

- [ ] Backend API is accessible from internet
- [ ] CORS configured on backend for frontend domain
- [ ] Environment variables configured
- [ ] SSL certificate installed (HTTPS)
- [ ] Test all pages work
- [ ] Test product pages load from backend
- [ ] Test cart functionality
- [ ] Test checkout process
- [ ] Mobile responsiveness checked
- [ ] Performance tested (Google PageSpeed)

---

## 🎯 Recommended Workflow

### For Development
1. Work locally with `npm run dev`
2. Push to `main` branch
3. Testing server auto-updates
4. Review changes on testing site

### For Production
1. Verify everything works on testing
2. Manually trigger production deployment
3. Verify production site
4. Monitor for errors

---

## 📞 Support Resources

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Netlify Docs:** [docs.netlify.com](https://docs.netlify.com)
- **Next.js Deployment:** [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **GitHub Actions:** [docs.github.com/actions](https://docs.github.com/actions)

---

## ✅ Quick Start Commands

```bash
# Local development
npm run dev

# Build for production (creates 'out' folder)
npm run build

# Test production build locally
npx serve out

# Check for errors
npm run lint
```

---

**Need help?** Check the workflow logs in GitHub Actions or review this guide!

🎉 **Your site will now update automatically every time you push code to GitHub!**
