import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { satoshi } from "@/styles/fonts";

import Footer from "@/components/layout/Footer";
import LayoutWrapper from "./layoutWrapper";
import HolyLoader from "holy-loader";
import Providers from "./providers";
import { Toaster } from "sonner";
import AIAssistant from "@/components/common/AIAssistant";

export const metadata: Metadata = {
  metadataBase: new URL('https://nutriblendhaven.com'),
  title: {
    default: "NutriBlend Haven - Premium Health & Wellness Supplements",
    template: "%s | NutriBlend Haven"
  },
  description: "Discover premium health, wellness, and nutrition products at NutriBlend Haven. Shop high-quality supplements, vitamins, proteins, and wellness solutions for a healthier lifestyle.",
  keywords: [
    "health supplements",
    "wellness products",
    "nutrition",
    "vitamins",
    "proteins",
    "fish oil",
    "omega-3",
    "probiotics",
    "health supplements online",
    "premium wellness"
  ],
  authors: [{ name: "NutriBlend Haven" }],
  creator: "NutriBlend Haven",
  publisher: "NutriBlend Haven",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nutriblendhaven.com',
    siteName: 'NutriBlend Haven',
    title: 'NutriBlend Haven - Premium Health & Wellness Supplements',
    description: 'Discover premium health, wellness, and nutrition products for a healthier lifestyle.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NutriBlend Haven - Premium Health Supplements',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NutriBlend Haven - Premium Health & Wellness Supplements',
    description: 'Discover premium health, wellness, and nutrition products.',
    images: ['/og-image.jpg'],
    creator: '@nutriblendhaven',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external resources for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'NutriBlend Haven',
              url: 'https://nutriblendhaven.com',
              logo: 'https://nutriblendhaven.com/logo.png',
              description: 'Premium health, wellness, and nutrition supplements',
              sameAs: [
                'https://facebook.com/nutriblendhaven',
                'https://twitter.com/nutriblendhaven',
                'https://instagram.com/nutriblendhaven',
              ],
            }),
          }}
        />
      </head>
      <body className={satoshi.className}>
        <HolyLoader color="#8e44ad" height="3px" speed={200} easing="ease-in-out" />
        <Providers>
          <LayoutWrapper>
            {children}
            <AIAssistant />
          </LayoutWrapper>
          <Footer />
        </Providers>
        <Toaster position="top-right" richColors closeButton duration={3000} />
      </body>
    </html>
  );
}

