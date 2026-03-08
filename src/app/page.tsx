import ProductCarousel from "@/components/common/ProductCarousel";
import BrandsSection from "@/components/homepage/Brands";
import HeroCarousel, { CarouselSlide } from "@/components/homepage/imageCarousel";
import CategoryGrid from "@/components/homepage/Categories";
import WellnessHub from "@/components/Blog/index";
import FlashSale from "@/components/homepage/FlashSale";
import PromoBanners from "@/components/homepage/PromoBanners";
import { transformProduct } from "@/lib/transformers";
import { apiClient } from "@/lib/api/client";
import Link from "next/link";
import { FaShieldAlt, FaBrain, FaDumbbell, FaBolt } from "react-icons/fa";

const carouselSlides: CarouselSlide[] = [
  {
    id: 1,
    image: '/images/hero1.png',
    title: 'Immunity Essentials',
    subtitle: 'Save up to 30% on top immune-boosting supplements',
    ctaText: 'Shop the Sale',
    ctaLink: '/shop?category=immune-support',
    layout: 'imageLeft'
  },
  {
    id: 2,
    image: '/images/hero2.png',
    title: 'Clean Plant Proteins',
    subtitle: 'Fuel your active lifestyle with organic, non-GMO proteins',
    ctaText: 'Discover Proteins',
    ctaLink: '/shop?category=protein-fitness',
    layout: 'imageRight'
  },
  {
    id: 3,
    image: '/images/hero3.png',
    title: 'Daily Wellness Deals',
    subtitle: 'Premium Multivitamins & Minerals at unbeatable prices',
    ctaText: 'Explore Wellness',
    ctaLink: '/shop?category=vitamins-minerals',
    layout: 'imageLeft'
  }
];

export const revalidate = 60;

async function getHomePageData() {
  try {
    const [newArrivalsReq, trendingReq, specialOffersReq, recommendedReq, settingsReq] = await Promise.all([
      apiClient.getProducts({ is_new_arrival: true, per_page: 8 }).catch(() => ({ status: false, data: null })),
      apiClient.getProducts({ is_trending: true, per_page: 8 }).catch(() => ({ status: false, data: null })),
      apiClient.getProducts({ on_sale: true, per_page: 8 }).catch(() => ({ status: false, data: null })),
      apiClient.getProducts({ is_recommended: true, per_page: 8 }).catch(() => ({ status: false, data: null })),
      apiClient.getPublicSettings().catch(() => ({ status: false, data: null }))
    ]);

    const newArrivals = (newArrivalsReq.status && Array.isArray(newArrivalsReq.data) && newArrivalsReq.data.length)
      ? newArrivalsReq.data.map(transformProduct)
      : (newArrivalsReq.status && Array.isArray(newArrivalsReq.data?.data) && newArrivalsReq.data.data.length)
        ? newArrivalsReq.data.data.map(transformProduct) : null;

    const trending = (trendingReq.status && Array.isArray(trendingReq.data) && trendingReq.data.length)
      ? trendingReq.data.map(transformProduct)
      : (trendingReq.status && Array.isArray(trendingReq.data?.data) && trendingReq.data.data.length)
        ? trendingReq.data.data.map(transformProduct) : null;

    const specialOffers = (specialOffersReq.status && Array.isArray(specialOffersReq.data) && specialOffersReq.data.length)
      ? specialOffersReq.data.map(transformProduct)
      : (specialOffersReq.status && Array.isArray(specialOffersReq.data?.data) && specialOffersReq.data.data.length)
        ? specialOffersReq.data.data.map(transformProduct) : null;

    const recommended = (recommendedReq.status && Array.isArray(recommendedReq.data) && recommendedReq.data.length)
      ? recommendedReq.data.map(transformProduct)
      : (recommendedReq.status && Array.isArray(recommendedReq.data?.data) && recommendedReq.data.data.length)
        ? recommendedReq.data.data.map(transformProduct) : null;

    const dynamicSlides = (settingsReq.status && Array.isArray(settingsReq.data?.hero_carousel) && settingsReq.data.hero_carousel.length)
      ? settingsReq.data.hero_carousel
      : carouselSlides;

    return { newArrivals, trending, specialOffers, recommended, heroSlides: dynamicSlides };

  } catch (error) {
    console.error("Failed to fetch homepage data:", error);
    return {
      newArrivals: null,
      trending: null,
      specialOffers: null,
      recommended: null,
      heroSlides: carouselSlides
    };
  }
}

export default async function Home() {
  const { newArrivals, trending, specialOffers, recommended, heroSlides } = await getHomePageData();

  return (
    <>
      <main className="bg-[#f5f5f5] w-full min-h-screen pb-10">

        {/* Top Promotional Banner (Often seen on iHerb for global sales) */}
        <div className="bg-[#009E3C] text-white w-full py-1.5 text-center text-xs md:text-sm font-medium tracking-wide">
          <span className="text-[#FFC107] font-bold">SALE:</span> Get 20% OFF your first order with code <span className="bg-white/20 px-2 py-0.5 rounded text-white font-bold ml-1">HEALTH20</span>
        </div>

        {/* Hero Carousel Section - Full width, strict boundaries */}
        <section className="bg-white pb-2 md:pb-4 shadow-sm border-b border-gray-200">
          <div className="max-w-[1500px] mx-auto 2xl:px-0">
            <HeroCarousel slides={heroSlides} autoPlay={true} interval={6000} />
          </div>
        </section>

        {/* Trust & Perks Signals - Clean, white background, green accents like iHerb */}
        <section className="bg-white border-b border-gray-200 shadow-sm mb-6 md:mb-10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 md:py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 divide-x divide-gray-100">

              {/* Premium Guarantee */}
              <div className="flex items-center gap-4 px-2 hover-lift group">
                <div className="w-12 h-12 rounded-full bg-[#f4fcf6] flex items-center justify-center flex-shrink-0 border border-green-100 group-hover:bg-[#009E3C] transition-colors duration-300">
                  <svg className="w-6 h-6 text-[#009E3C] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm md:text-base leading-tight">Authenticity GUARANTEED</p>
                  <p className="text-gray-500 text-xs mt-0.5">Sourced directly from brands</p>
                </div>
              </div>

              {/* Secure Payment */}
              <div className="flex items-center gap-4 px-2 hover-lift group pl-4 md:pl-8 border-l border-gray-100">
                <div className="w-12 h-12 rounded-full bg-[#f4fcf6] flex items-center justify-center flex-shrink-0 border border-green-100 group-hover:bg-[#009E3C] transition-colors duration-300">
                  <svg className="w-6 h-6 text-[#009E3C] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm md:text-base leading-tight">Secure Payment</p>
                  <p className="text-gray-500 text-xs mt-0.5">256-bit encryption</p>
                </div>
              </div>

              {/* Express Shipping */}
              <div className="flex items-center gap-4 px-2 hover-lift group pl-4 md:pl-8 border-l border-gray-100">
                <div className="w-12 h-12 rounded-full bg-[#f4fcf6] flex items-center justify-center flex-shrink-0 border border-green-100 group-hover:bg-[#009E3C] transition-colors duration-300">
                  <svg className="w-6 h-6 text-[#009E3C] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm md:text-base leading-tight">Express Delivery</p>
                  <p className="text-gray-500 text-xs mt-0.5">Reliable & fast shipping</p>
                </div>
              </div>

              {/* 24/7 Support */}
              <div className="flex items-center gap-4 px-2 hover-lift group pl-4 md:pl-8 border-l border-gray-100">
                <div className="w-12 h-12 rounded-full bg-[#FFFAEC] flex items-center justify-center flex-shrink-0 border border-yellow-200 group-hover:bg-[#FFC107] transition-colors duration-300">
                  <svg className="w-6 h-6 text-[#F3911E] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm md:text-base leading-tight">24/7 Support</p>
                  <p className="text-gray-500 text-xs mt-0.5">Always here to help</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section - Highly clinical and clean */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-8 md:mb-12 mt-6">
          <div className="bg-white rounded-xl md:p-8 shadow-sm border border-gray-200">
            <CategoryGrid />
          </div>
        </div>

        {/* New Arrivals (Full Row, Prominent) */}
        {newArrivals && newArrivals.length > 0 && (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-8 md:mb-12">
            <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-gray-200">
              <ProductCarousel
                products={newArrivals}
                title="New Arrivals"
                subtitle="Latest formulations added to our catalog"
                badge="NEW"
                viewAllLink="/shop?is_new_arrival=true"
              />
            </div>
          </div>
        )}

        {/* Trending Now (Full Row, Prominent) */}
        {trending && trending.length > 0 && (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-8 md:mb-12">
            <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-gray-200">
              <ProductCarousel
                products={trending}
                title="Trending Now"
                subtitle="Products causing a buzz right now"
                badge="HOT"
                viewAllLink="/shop?is_trending=true"
              />
            </div>
          </div>
        )}

        {/* Best Brands (Full Row) */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-8 md:mb-12">
          <BrandsSection />
        </div>

        {/* Flash Sale Banner & Products */}
        {specialOffers && specialOffers.length > 0 && (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-8 md:mb-14">
            <div className="bg-[#FFF8E1] border-2 border-[#FFE082] rounded-xl p-4 md:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-2">
                    Super Deals
                  </h2>
                  <p className="text-gray-700 mt-1 font-medium">Limited time offers. Grab them before they're gone!</p>
                </div>
                <Link href="/shop?on_sale=true" className="inline-flex px-8 py-3 bg-[#F3911E] text-white font-bold rounded-lg hover:bg-[#d67b12] transition-colors shadow-lg shadow-orange-500/20 whitespace-nowrap text-center justify-center">
                  Shop All Deals
                </Link>
              </div>
              <FlashSale products={specialOffers} />
            </div>
          </div>
        )}

        {/* Promo Banners Grid */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-8 md:mb-14">
          <PromoBanners />
        </div>

        {/* NutriTrust™ Purity Index (Moved down) */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-10 md:mb-16">
          <div className="glass-effect rounded-[2rem] p-8 md:p-12 border border-white shadow-premium relative overflow-hidden group">
            {/* Animated background element */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/10 transition-colors duration-700"></div>

            <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
              <div className="lg:w-1/2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#009E3C]/10 rounded-full mb-6">
                  <span className="w-2 h-2 bg-[#009E3C] rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#009E3C]">Purity Verified</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
                  The <span className="text-gradient-green">NutriTrust™</span> <br />
                  Standard of Excellence
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  We don&apos;t just sell supplements; we verify them. Every single batch is independently tested for
                  <span className="font-bold text-gray-900"> heavy metals, purity, and active potency</span>.
                  Shop with the confidence of clinical-grade transparency.
                </p>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">Lab-Certified</p>
                      <p className="text-xs text-gray-500">Third-party analyzed</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">Direct Source</p>
                      <p className="text-xs text-gray-500">Anti-counterfeit tech</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                {[
                  { label: 'Purity Score', val: '99.8%', color: 'border-green-500' },
                  { label: 'Active Potency', val: '100%', color: 'border-orange-500' },
                  { label: 'Heavy Metals', val: 'Pass', color: 'border-blue-500' },
                  { label: 'Microbial', val: 'Clear', color: 'border-purple-500' }
                ].map((stat, i) => (
                  <div key={i} className={`bg-white rounded-2xl p-6 border-b-4 ${stat.color} shadow-sm hover:shadow-md transition-shadow group/card`}>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
                    <p className="text-3xl font-black text-gray-900 group-hover/card:scale-110 transition-transform origin-left">{stat.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Intelligent Wellness Stack Builder (Reduced Height, Background Overlay) */}
        <section
          className="relative py-12 md:py-16 mb-12 md:mb-20"
          style={{ backgroundImage: 'url(/images/hero1.png)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
        >
          {/* Black overlay */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-0"></div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6">
            <div className="max-w-xl text-center mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-4 border border-white/20">
                <span className="text-[10px] font-black uppercase tracking-widest text-green-400">Tailored For You</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-4 text-white">Build Your Perfect <span className="text-green-400">Stack</span></h2>
              <p className="text-white/80 text-sm md:text-base">Select your primary health focus to uncover curated, high-potency combinations.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { title: 'Immunity', icon: <FaShieldAlt className="text-2xl" />, description: 'Strengthen defenses', color: '#F3911E', bgColor: '#FFF8E1', slug: 'dietary-supplements' },
                { title: 'Focus', icon: <FaBrain className="text-2xl" />, description: 'Enhance clarity', color: '#8B5CF6', bgColor: '#F5F3FF', slug: 'vitamins' },
                { title: 'Muscle', icon: <FaDumbbell className="text-2xl" />, description: 'Optimize gains', color: '#EF4444', bgColor: '#FEF2F2', slug: 'weight-gainers' },
                { title: 'Longevity', icon: <FaBolt className="text-2xl" />, description: 'Fuel vitality', color: '#009E3C', bgColor: '#F0FDF4', slug: 'dietary-supplements' }
              ].map((goal, i) => (
                <Link
                  key={i}
                  href={`/shop?category=${goal.slug}`}
                  className="group bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:border-white/50 hover:bg-white/20 transition-all duration-300 flex flex-col items-center text-center"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg"
                    style={{ backgroundColor: goal.bgColor }}
                  >
                    <div style={{ color: goal.color }}>{goal.icon}</div>
                  </div>

                  <p className="font-bold text-lg mb-1 text-white">{goal.title}</p>
                  <p className="text-xs text-white/70 tracking-wide mb-4">{goal.description}</p>
                  <div className="text-green-400 font-bold text-[11px] uppercase tracking-wider group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Begin
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Global Banner for Trust */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-8 md:mb-12">
          <div className="bg-gradient-to-r from-[#009E3C] to-[#2E7D32] rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row relative">
            <div className="p-8 md:p-12 z-10 md:w-2/3 flex flex-col justify-center">
              <h3 className="text-2xl md:text-4xl font-black text-white mb-4">Quality You Can Trust</h3>
              <p className="text-green-50 text-lg mb-6 max-w-xl">Every product is tested for purity, potency, and freshness. We guarantee 100% authentic products sourced directly from manufacturers.</p>
              <div>
                <Link href="/about" className="inline-flex bg-white text-[#009E3C] font-bold px-8 py-3 rounded-md hover:bg-gray-50 transition-colors shadow-md">
                  Read Our Guarantee
                </Link>
              </div>
            </div>
            {/* Abstract background graphics */}
            <div className="absolute top-0 right-0 bottom-0 w-1/2 opacity-20 pointer-events-none hidden md:block">
              <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="absolute right-0 w-full h-full transform translate-x-1/4 scale-150">
                <path fill="#fff" d="M46.7,-77.9C59.9,-69.5,69.5,-54.2,74.9,-38.5C80.3,-22.8,81.4,-6.6,76.5,7.5C71.7,21.5,60.8,33.4,49.8,44C38.7,54.6,27.5,63.9,13.7,69.6C-0.1,75.3,-16.5,77.3,-30.5,71.2C-44.5,65.2,-56.1,51.1,-66,36C-75.9,20.8,-84,4.7,-81.9,-10.1C-79.9,-25,-67.7,-38.6,-53.8,-47.5C-39.9,-56.3,-24.3,-60.4,-8.1,-58.5C8.1,-56.5,23.3,-48.5,33.5,-86.3Z" transform="translate(200 200)" />
              </svg>
            </div>
          </div>
        </div>

        {/* Recommended For You */}
        {recommended && recommended.length > 0 && (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-8 md:mb-14">
            <div className="bg-white rounded-xl p-6 md:p-10 shadow-sm border border-gray-200">
              <ProductCarousel
                products={recommended}
                title="Recommended For You"
                subtitle="Personalized wellness picks"
                badge="PICK"
                viewAllLink="/shop?is_recommended=true"
              />
            </div>
          </div>
        )}

        <div className="bg-white border-y border-gray-200 py-12">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
            <WellnessHub />
          </div>
        </div>

      </main>
    </>
  );
}
