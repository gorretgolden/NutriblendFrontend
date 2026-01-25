# 🚀 VERCEL + CPANEL DOMAIN GUIDE

This guide explains how to use Vercel for your Frontend and cPanel for your Backend while using the **SAME** domain.

---

## 🎯 The Configuration Goal
- **Frontend (Next.js)**: `https://yourdomain.com` (Hosted on **Vercel**)
- **Backend (Laravel)**: `https://api.yourdomain.com` (Hosted on **cPanel**)

---

## 🛠️ Step 1: Vercel Setup
1. **GitHub**: Push your code to a GitHub repo.
2. **Vercel**: Import the repo to Vercel.
3. **Env Vars**: Set `NEXT_PUBLIC_API_URL` to `https://api.yourdomain.com/api/v1`.
4. **Deploy**: Get your test URL (e.g. `nutriblend.vercel.app`).

---

## 🌐 Step 2: DNS Mapping in cPanel
You must tell the internet that the **website** is on Vercel, but the **data** is on cPanel.

1. Log into **cPanel** > **Zone Editor**.
2. **Main Domain**: Edit the `A` record for `yourdomain.com`.
   - Change IP to: `76.76.21.21` (Verify this in Vercel settings).
3. **WWW Subdomain**: Edit the `CNAME` record for `www.yourdomain.com`.
   - Change target to: `cname.vercel-dns.com`.
4. **API Subdomain**: Find `api.yourdomain.com`.
   - **Ensure it still points to your cPanel IP**. Do not change this!

---

## 🔐 Step 3: SSL & CORS
1. **SSL**: Both Vercel and cPanel provide free SSL (AutoSSL / Let's Encrypt). They will handle this automatically once the DNS propagates.
2. **CORS**: In your Laravel backend (cPanel), open `config/cors.php`.
   - In `allowed_origins`, add `https://yourdomain.com`.

---

## ✅ Benefits of this Setup
1. **Speed**: Vercel's global CDN makes your frontend load instantly.
2. **Reliability**: If your cPanel hosting goes down, your frontend stays up (showing an error message instead of a blank white screen).
3. **Ease of Use**: Every time you push code to GitHub, your website updates automatically.
