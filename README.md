# Nutriblend Haven

Nutriblend Haven is an open-source e-commerce front-end project tailored for **health, wellness, and nutrition products**.  
It is built on a modern tech stack including **Next.js 14 App Router**, **TypeScript**, **Tailwind CSS**, **Redux**, **Framer Motion**, and **ShadCN UI** — ensuring a fast, scalable, and responsive shopping experience.

This project started by adapting an open Figma template into production-ready code, then evolving it into a platform designed specifically for Nutriblend Haven.

---

## Table of Contents
- [Overview](#overview)  
- [Features](#features)  
- [Technologies](#technologies)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Project Structure](#project-structure)  
- [Contributing](#contributing)  
- [Issues](#issues)  
- [License](#license)  
- [Contact](#contact)  

---

## Overview
Nutriblend Haven bridges the gap between **design** and **development** by delivering a clean, responsive e-commerce storefront.  
It emphasizes **SEO**, **performance optimization**, and **accessibility**, making it a solid foundation for building a complete nutrition and wellness marketplace.

---

## Demo
Check out the live demo: **[Nutriblend Haven Demo]**  

*(currently showcasing deployment setup — project is being extended with Nutriblend’s features)*

---

## Features
- **Next.js 14** – SSR, SSG, API integrations, and modern routing.  
- **TypeScript** – Strong typing for safer and more maintainable code.  
- **Tailwind CSS** – Utility-first styling for fast and consistent UI design.  
- **Redux** – Centralized state management for cart, products, and user flows.  
- **Framer Motion** – Smooth animations and transitions for a delightful UX.  
- **ShadCN UI** – Accessible, customizable UI components.  
- **Fully Responsive** – Mobile-first design across all devices.  
- **Performance Optimized** – Lighthouse-friendly and built with speed in mind.  
- **Accessible** – WCAG-compliant design for inclusivity.  

---

## Technologies
- **Next.js 14** – Core framework for server rendering and routing.  
- **TypeScript** – Enforces type safety and developer productivity.  
- **Tailwind CSS** – Rapid, responsive UI development.  
- **Redux** – Shopping cart and global state management.  
- **Framer Motion** – Page and component animations.  
- **ShadCN UI** – Modern UI component library.  
- **Figma** – Source of initial design inspiration ([template link](https://www.figma.com/community/file/1273571982885059508/e-commerce-website-template-freebie) by [Hamza Naeem](https://www.figma.com/@hamzauix)).  

---


## Installation

To get started locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/gorretgolden/NutriblendFrontend
   cd nutriblendfrontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

   ```bash
   yarn install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

   ```bash
   yarn dev
   ```

4. **Open in your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the app.

## Usage

- To explore or modify the code, navigate through the `components`, `features`, and `app` directories.
- The shopping cart logic is managed using **Redux**. You can find the store configuration and cart actions in the `src/lib/features` directory.
- **ShadCN UI** components are used across the app. They can be customized in the `src/components/ui` directory.
- You can easily modify and extend the project to suit your needs, whether for personal use or professional projects.

## Project Structure

```bash
Shopco/
│
├── public/                # Static assets
├── src/
│   ├── app/               # Next.js App Router
│   ├── components/        # Reusable components (including ShadCN UI components)
│   └── lib/
│       ├── features/      # The Redux logics for features (e.g., shopping cart)
│       ├── hooks/         # Custom React hooks
│       ├── store.ts       # Redux store
│       ├── utils.ts       # Utility functions
│   ├── styles/            # Tailwind CSS styles (global, utilities and fonts)
│   ├── types/             # TypeScript types
│
├── components.json         # ShadCN UI configuration
├── next.config.mjs         # Next.js configuration
├── package.json            # Node.js dependencies and scripts
├── postcss.config.mjs      # Post CSS configuration
└── README.md               # Project documentation
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
```