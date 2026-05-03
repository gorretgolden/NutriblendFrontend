import ProductCarousel from "@/components/common/ProductCarousel";
import BrandsSection from "@/components/homepage/Brands";
import HeroCarousel, { CarouselSlide } from "@/components/homepage/imageCarousel";
import FlashSale from "@/components/homepage/FlashSale";
import ShopByGoal from "@/components/homepage/ShopByGoal";
import ThreeColBanners from "@/components/homepage/ThreeColBanners";
import WhyChooseUs from "@/components/homepage/WhyChooseUs";
import NewsletterForm from "@/components/homepage/NewsletterForm";
import { transformProduct } from "@/lib/transformers";
import { apiClient } from "@/lib/api/client";
import Link from "next/link";
import FadeIn from "@/components/common/FadeIn";

export const revalidate = 60;

// ── Static hero slides ──────────────────────────────────────────────────────
const carouselSlides: CarouselSlide[] = [
  {
    id: 1,
    image: '/images/hero1.png',
    title: "Men's Vitality & Performance",
    subtitle: "Top-rated supplements for stamina, strength, and confidence — trusted brands, authentic products",
    ctaText: "Shop Men's Health",
    ctaLink: '/shop?category=mens-sexual-health',
    layout: 'imageLeft'
  },
  {
    id: 2,
    image: '/images/hero2.png',
    title: 'Premium Nutritional Supplements',
    subtitle: 'LifeCell Collagen, Omega-3, Vitamins & more — fuel your body from the inside out',
    ctaText: 'Explore Supplements',
    ctaLink: '/shop?category=nutritional-supplements',
    layout: 'imageRight'
  },
  {
    id: 3,
    image: '/images/hero3.png',
    title: 'Luxury Perfumes & Sprays',
    subtitle: 'Lattafa, Fragrance World, Dior & more — discover your signature scent',
    ctaText: 'Browse Fragrances',
    ctaLink: '/shop?category=perfumes-and-sprays',
    layout: 'imageLeft'
  }
];

// ── Safe product fetch helper ───────────────────────────────────────────────
async function fetchProducts(params: Record<string, unknown>, limit = 8) {
  try {
    const res = await apiClient.getProducts({ ...params, per_page: limit });
    if (!res.status) return [];
    const raw = res.data;
    const arr = Array.isArray(raw) ? raw : (Array.isArray(raw?.data) ? raw.data : []);
    return arr.map(transformProduct);
  } catch {
    return [];
  }
}

// ── Server data fetch ───────────────────────────────────────────────────────
async function getHomePageData() {
  const [
    mensProducts,
    womensProducts,
    supplementsProducts,
    perfumesProducts,
    weightProducts,
    fitnessProducts,
    latestProducts,
    onSaleProducts,
    heroSlideSettings,
  ] = await Promise.all([
    fetchProducts({ category_slug: 'mens-sexual-health' }),
    fetchProducts({ category_slug: 'womens-sexual-health' }),
    fetchProducts({ category_slug: 'nutritional-supplements' }),
    fetchProducts({ category_slug: 'perfumes-and-sprays' }),
    fetchProducts({ category_slug: 'weight-management' }),
    fetchProducts({ category_slug: 'gym-and-fitness' }),
    fetchProducts({ per_page: 8 }),
    fetchProducts({ on_sale: true }),
    apiClient.getPublicSettings().catch(() => ({ status: false, data: null })),
  ]);

  const heroSlides = (
    heroSlideSettings.status &&
    Array.isArray(heroSlideSettings.data?.hero_carousel) &&
    heroSlideSettings.data.hero_carousel.length > 0
  ) ? heroSlideSettings.data.hero_carousel : carouselSlides;

  const defaultBadges = [
    { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "100% Authentic", desc: "Sourced directly from brands" },
    { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", title: "Secure Payment", desc: "Flutterwave & mobile money" },
    { icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0", title: "Fast Delivery", desc: "Across Uganda" },
    { icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z", title: "24/7 Support", desc: "Always here to help" },
  ];

  const trustBadges = defaultBadges.map((badge, idx) => {
    if (heroSlideSettings.status && Array.isArray(heroSlideSettings.data?.trust_badges) && heroSlideSettings.data.trust_badges[idx]) {
      return {
        icon: badge.icon,
        title: heroSlideSettings.data.trust_badges[idx].title || badge.title,
        desc: heroSlideSettings.data.trust_badges[idx].desc || badge.desc,
      };
    }
    return badge;
  });

  return {
    mensProducts,
    womensProducts,
    supplementsProducts,
    perfumesProducts,
    weightProducts,
    fitnessProducts,
    latestProducts,
    onSaleProducts,
    heroSlides,
    trustBadges,
  };
}

// ── Section Heading Component ───────────────────────────────────────────────
function SectionHeading({
  label, title, viewAllLink
}: { label: string; title: string; viewAllLink: string }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-[#009E3C] mb-0.5">{label}</p>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">{title}</h2>
      </div>
      <Link
        href={viewAllLink}
        className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#009E3C] hover:text-[#007a2e] transition-colors group border border-[#009E3C]/30 rounded-full px-4 py-1.5 hover:bg-[#009E3C]/5"
      >
        View all
        <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export default async function Home() {
  const {
    mensProducts, womensProducts, supplementsProducts, perfumesProducts,
    weightProducts, fitnessProducts, latestProducts, onSaleProducts, heroSlides, trustBadges
  } = await getHomePageData();

  return (
    <main className="bg-[#f4f6f9] w-full min-h-screen">

      {/* ── 1. Hero Carousel ── */}
      <section className="bg-white shadow-sm border-b border-gray-200/80">
        <div className="max-w-[1600px] mx-auto">
          <HeroCarousel slides={heroSlides} autoPlay={true} interval={6000} />
        </div>
      </section>

      {/* ── 2. Shop by Category ── */}
      <FadeIn duration={0.8}>
        <ShopByGoal />
      </FadeIn>

      {/* ── 3. Trust Signals Bar ── */}
      <FadeIn duration={0.8} className="bg-white border-b border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 md:divide-x md:divide-gray-100">
            {trustBadges.map((t, i) => (
              <div key={i} className="flex items-center gap-3 md:px-6 md:first:pl-0 md:last:pr-0">
                <div className="w-10 h-10 rounded-xl bg-[#f0fbf4] border border-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#009E3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={t.icon} />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm leading-tight">{t.title}</p>
                  <p className="text-gray-400 text-[11px] hidden sm:block">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* ── 5. Three-Column Promo Banners ── */}
      <FadeIn duration={0.8} className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ThreeColBanners />
      </FadeIn>

      {/* ── 6. New Arrivals ── */}
      {latestProducts.length > 0 && (
        <FadeIn duration={1} className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="bg-white rounded-2xl px-4 py-5 md:px-6 border border-gray-100 shadow-sm">
            <SectionHeading label="Just In" title="New Arrivals" viewAllLink="/shop" />
            <ProductCarousel products={latestProducts} title="New Arrivals" hideHeader viewAllLink="/shop" />
          </div>
        </FadeIn>
      )}

      {/* ── 7. Brands Section ── */}
      <FadeIn duration={0.8} className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <BrandsSection />
      </FadeIn>

      {/* ── 9. Men's Sexual Health ── */}
      {mensProducts.length > 0 && (
        <FadeIn direction="left" duration={0.8} className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="bg-white rounded-2xl px-4 py-5 md:px-6 border border-gray-100 shadow-sm">
            <SectionHeading label="Men's Health" title="Men's Sexual Health" viewAllLink="/shop?category=mens-sexual-health" />
            <ProductCarousel products={mensProducts} title="Men's Sexual Health" hideHeader viewAllLink="/shop?category=mens-sexual-health" />
          </div>
        </FadeIn>
      )}

      {/* ── 10. Women's Sexual Health ── */}
      {womensProducts.length > 0 && (
        <FadeIn direction="right" duration={0.8} className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="bg-white rounded-2xl px-4 py-5 md:px-6 border border-gray-100 shadow-sm">
            <SectionHeading label="Women's Health" title="Women's Sexual Health" viewAllLink="/shop?category=womens-sexual-health" />
            <ProductCarousel products={womensProducts} title="Women's Sexual Health" hideHeader viewAllLink="/shop?category=womens-sexual-health" />
          </div>
        </FadeIn>
      )}

      {/* ── 11. Nutritional Supplements ── */}
      {supplementsProducts.length > 0 && (
        <FadeIn duration={0.8} className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="bg-white rounded-2xl px-4 py-5 md:px-6 border border-gray-100 shadow-sm">
            <SectionHeading label="Health & Wellness" title="Nutritional Supplements" viewAllLink="/shop?category=nutritional-supplements" />
            <ProductCarousel products={supplementsProducts} title="Nutritional Supplements" hideHeader viewAllLink="/shop?category=nutritional-supplements" />
          </div>
        </FadeIn>
      )}

      {/* ── 12. Gym & Fitness ── */}
      {fitnessProducts.length > 0 && (
        <FadeIn duration={0.8} className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="bg-white rounded-2xl px-4 py-5 md:px-6 border border-gray-100 shadow-sm">
            <SectionHeading label="Active Living" title="Gym & Fitness" viewAllLink="/shop?category=gym-and-fitness" />
            <ProductCarousel products={fitnessProducts} title="Gym & Fitness" hideHeader viewAllLink="/shop?category=gym-and-fitness" />
          </div>
        </FadeIn>
      )}

      {/* ── 13. Why Choose Us ── */}
      <FadeIn duration={0.8}>
        <WhyChooseUs />
      </FadeIn>

      {/* ── 14. Perfumes & Sprays ── */}
      {perfumesProducts.length > 0 && (
        <FadeIn direction="none" duration={0.8} className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-2xl px-5 py-6 md:px-8 border border-gray-100 shadow-sm">
            <SectionHeading label="Luxury Fragrance" title="Perfumes & Sprays" viewAllLink="/shop?category=perfumes-and-sprays" />
            <ProductCarousel products={perfumesProducts} title="Perfumes & Sprays" hideHeader viewAllLink="/shop?category=perfumes-and-sprays" />
          </div>
        </FadeIn>
      )}

      {/* ── 15. Weight Management ── */}
      {weightProducts.length > 0 && (
        <FadeIn duration={0.8} className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="bg-white rounded-2xl px-4 py-5 md:px-6 border border-gray-100 shadow-sm">
            <SectionHeading label="Body Goals" title="Weight Management" viewAllLink="/shop?category=weight-management" />
            <ProductCarousel products={weightProducts} title="Weight Management" hideHeader viewAllLink="/shop?category=weight-management" />
          </div>
        </FadeIn>
      )}

      {/* ── 16. Special Offers ── */}
      {onSaleProducts.length > 0 && (
        <FadeIn duration={0.8} className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-white border border-gray-100 rounded-2xl px-5 py-6 md:px-8 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-red-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full mb-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  Limited Time
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Special Offers</h2>
              </div>
              <Link href="/shop?on_sale=true" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors group border border-red-200 rounded-full px-4 py-1.5 hover:bg-red-50">
                View all deals
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <ProductCarousel products={onSaleProducts} title="Special Offers" hideHeader viewAllLink="/shop?on_sale=true" />
          </div>
        </FadeIn>
      )}
      
      {/* ── 17. Newsletter CTA ── */}
      <FadeIn direction="none" duration={0.8} className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="relative bg-gradient-to-r from-[#009E3C] to-[#007a2e] rounded-2xl overflow-hidden p-8 md:p-12 shadow-lg">
          {/* Decorative blob */}
          <div className="absolute top-0 right-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
            <svg viewBox="0 0 200 200" className="w-full h-full translate-x-1/3 scale-150">
              <path fill="white" d="M46,-77.7C58.3,-68.1,65.6,-51.4,71.8,-35.4C78,-19.4,83,-4.1,79.4,9.2C75.7,22.5,63.3,33.7,51,43.1C38.8,52.4,26.7,60,12.1,65.9C-2.5,71.7,-19.6,75.8,-34.4,70.6C-49.2,65.5,-61.8,51.1,-69.2,35.3C-76.6,19.5,-78.9,2.2,-74.9,-13.3C-70.9,-28.8,-60.6,-42.5,-47.5,-52.1C-34.4,-61.7,-18.5,-67.3,-0.8,-66.3C16.9,-65.2,33.8,-57.5,46,-77.7Z" transform="translate(100 100)" />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Text */}
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-3 py-1 mb-3">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Stay in the Loop</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">
                Get Wellness Tips & Exclusive Deals
              </h3>
              <p className="text-green-100 text-sm md:text-base leading-relaxed max-w-md">
                Join thousands of health-conscious Ugandans. Get first access to new arrivals, expert wellness tips, and subscriber-only discounts.
              </p>
            </div>

            {/* Email signup */}
            <NewsletterForm />
          </div>
        </div>
      </FadeIn>

    </main>
  );
}
