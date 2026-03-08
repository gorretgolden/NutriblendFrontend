# NutriBlend Haven - Frontend Documentation

Welcome to the **NutriBlend Haven** frontend repository. This document serves as a comprehensive guide for developers, collaborators, and stakeholders to understand the structure, technologies, and implementation of the NutriBlend Frontend application.

## 🚀 Project Overview

**NutriBlend Haven** is a premium health and wellness e-commerce platform built with modern web technologies. The frontend application provides a fast, responsive, and secure user experience for customers to browse products, manage their cart, and complete purchases using local payment methods like Flutterwave.

## 🛠️ Technology Stack

The application is built on the following core technologies:

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router, Server Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict type checking)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Utility-first CSS)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) with [Redux Persist](https://github.com/rt2zz/redux-persist)
- **Components**: [Lucide React](https://lucide.dev/) (Icons), [Radix UI](https://www.radix-ui.com/) (Primitives)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Payments**: [Flutterwave React SDK](https://github.com/Flutterwave/react-v3)
- **Notifications**: [Sonner](https://sonner.stevenly.me/) (Toast notifications)

## 📁 Project Structure

The project follows a standard Next.js App Router organization:

```text
src/
├── app/               # App Router pages and layouts
│   ├── (auth)/        # Authentication routes (login, register)
│   ├── cart/          # Cart and Checkout pages
│   ├── products/      # Individual product detail pages
│   ├── shop/          # Main product catalog listing
│   └── layout.tsx     # Root layout wrapper
├── components/        # Reusable UI components
│   ├── common/        # Shared components (buttons, inputs, cards)
│   ├── homepage/      # Components specific to the home screen
│   └── layout/        # Header, Footer, and Sidebar components
├── lib/               # Utility functions and library wrappers
│   ├── api/           # API client and request handlers
│   ├── features/      # Redux slices and async thunks
│   ├── store.ts       # Central Redux store configuration
│   └── transformers.ts # Data mapping from API to Frontend types
├── types/             # Global TypeScript interface definitions
└── styles/           # Global CSS and Tailwind directives
```

## 🏗️ Core Features & Implementation

### 🛒 Cart & Checkout Flow
The cart is managed locally via Redux and synchronized with the backend once the user logs in. The checkout process integrates with the **Flutterwave SDK** for secure payment processing.

### 🌓 Data Transformation
Since the backend may change its response structure over time, the `src/lib/transformers.ts` file is used to map raw API responses to consistent frontend data types (e.g., `Product`, `Order`, `Category`).

### 🔒 Authentication
We use **Laravel Sanctum** (via the backend) for secure, token-based authentication. User credentials and session states are persisted using `redux-persist` so users stay logged in across browser refreshes.

### 📱 Responsive Design
The entire UI is mobile-first and fully responsive, ensuring a seamless experience across mobile, tablet, and desktop devices.

## 🛠️ Getting Started

### 📋 Prerequisites
- **Node.js**: v18 or later
- **npm**: v9 or later

### ⚙️ Installation
1. Clone the repository
2. Run `npm install` to install dependencies
3. Copy `.env.example` to `.env.local` and set your `NEXT_PUBLIC_API_URL` (usually `http://localhost:8000/api/v1`)
4. Run the development server with `npm run dev`

### 🏗️ Useful Commands
- `npm run dev`: Starts the development server.
- `npm run build`: Creates a production-optimized build.
- `npm run lint`: Runs ESLint for code quality checks.
- `npm run type-check`: Runs TypeScript compiler without emitting files to check for errors.

## 📡 API Integration

The frontend communicates with a Laravel-based REST API. All requests are handled via the `apiClient` instance in `src/lib/api/client.ts`. To add a new endpoint:
1. Define the response type in `src/lib/api/client.ts`.
2. Add the corresponding asynchronous method to the `apiClient` class.
3. If necessary, create a transformer in `src/lib/transformers.ts`.

## 🎨 UI & Design Principles

We prioritize **Rich Aesthetics** and **Visual Excellence**.
- **Typography**: Uses modern Inter/Outfit fonts.
- **Glassmorphism**: Subtle blurs and semi-transparent backgrounds for a premium feel.
- **Micro-animations**: Hover states and page transitions using Framer Motion.

## 🚢 Deployment

The project is optimized for deployment on platforms like **Vercel** or **Netlify**. Ensure all environment variables (especially the Flutterwave Public Key and API URL) are set in your deployment dashboard.

---

*This document was last updated on March 2026. For further questions, please contact the lead developer.*
