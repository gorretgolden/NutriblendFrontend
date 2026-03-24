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
      <main className="bg-[#f2f4f3] w-full min-h-screen pb-12">

        {/* ── Top Promo Ticker ── */}
        <div className="bg-gradient-to-r from-[#007a2e] via-[#009E3C] to-[#007a2e] text-white w-full overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-2 flex items-center justify-center gap-3 text-xs sm:text-sm font-medium tracking-wide">
            <span className="inline-flex items-center gap-1.5 flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-[#FFC107]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <span className="font-black text-[#FFC107]">FLASH SALE</span>
            </span>
            <span className="text-white/90">Get <strong className="text-white">20% OFF</strong> your first order with code</span>
            <span className="bg-white/20 border border-white/30 text-white font-black px-2.5 py-0.5 rounded-lg text-xs tracking-widest">HEALTH20</span>
            <span className="text-white/60 hidden sm:inline">·</span>
            <span className="text-white/80 hidden sm:inline">Free delivery on orders over UGX 150,000</span>
          </div>
        </div>

        {/* ── Hero Carousel ── */}
        <section className="bg-white shadow-sm border-b border-gray-200/80">
          <div className="max-w-[1500px] mx-auto">
            <HeroCarousel slides={heroSlides} autoPlay={true} interval={6000} />
          </div>
        </section>

        {/* ── Trust Signals Bar ── */}
        <section className="bg-white border-b border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 md:py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-3 md:gap-8">

              {[
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  ),
                  title: "100% Authentic",
                  sub: "Sourced directly from brands",
                  accent: "green",
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  ),
                  title: "Secure Payment",
                  sub: "256-bit SSL encryption",
                  accent: "green",
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  ),
                  title: "Express Delivery",
                  sub: "Fast shipping across Uganda",
                  accent: "green",
                },
                {
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  ),
                  title: "24/7 Support",
                  sub: "Always here to help",
                  accent: "orange",
                },
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-3 md:gap-4 group ${i > 0 ? 'md:border-l md:border-gray-100 md:pl-8' : ''}`}>
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 border transition-colors duration-300 ${
                    item.accent === 'orange'
                      ? 'bg-orange-50 border-orange-100 group-hover:bg-[#F3911E] group-hover:border-[#F3911E]'
                      : 'bg-[#f0fbf4] border-green-100 group-hover:bg-[#009E3C] group-hover:border-[#009E3C]'
                  }`}>
                    <svg className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-300 ${
                      item.accent === 'orange'
                        ? 'text-[#F3911E] group-hover:text-white'
                        : 'text-[#009E3C] group-hover:text-white'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {item.icon}
                    </svg>
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-900 text-xs sm:text-sm leading-tight">{item.title}</p>
                    <p className="text-gray-400 text-[11px] mt-0.5 leading-snug hidden sm:block">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Categories ── */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mt-6 mb-8 md:mb-10">
          <div className="bg-white rounded-2xl px-5 md:px-8 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-gray-100">
            <CategoryGrid />
          </div>
        </div>

        {/* ── New Arrivals ── */}
        {newArrivals && newArrivals.length > 0 && (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-8 md:mb-10">
            <div className="bg-white rounded-2xl px-5 py-6 md:px-8 md:py-10 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-gray-100">
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

        {/* ── Trending Now ── */}
        {trending && trending.length > 0 && (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-8 md:mb-10">
            <div className="bg-white rounded-2xl px-5 py-6 md:px-8 md:py-10 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-gray-100">
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

        {/* ── Brands ── */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-8 md:mb-10">
          <BrandsSection />
        </div>

        {/* ── Flash Sale / Super Deals ── */}
        {specialOffers && specialOffers.length > 0 && (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-8 md:mb-12">
            <div className="relative bg-gradient-to-br from-[#fffdf0] via-[#FFF8E1] to-[#fff6d6] border-2 border-[#FFE082] rounded-2xl p-5 md:p-8 shadow-[0_4px_24px_rgba(243,145,30,0.10)] overflow-hidden">
              {/* Background shimmer effect */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#F3911E]/6 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-300/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F3911E]/12 border border-[#F3911E]/25 rounded-full mb-3">
                    <span className="w-1.5 h-1.5 bg-[#F3911E] rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#F3911E]">Limited Time</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                    Super Deals
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm font-medium">Grab these offers before they expire!</p>
                </div>
                <Link
                  href="/shop?on_sale=true"
                  className="inline-flex items-center gap-2 px-7 py-3 bg-[#F3911E] text-white font-black rounded-xl hover:bg-[#d67b12] transition-all duration-200 shadow-[0_6px_20px_rgba(243,145,30,0.32)] hover:shadow-[0_8px_28px_rgba(243,145,30,0.42)] active:scale-[0.97] text-sm whitespace-nowrap flex-shrink-0"
                >
                  Shop All Deals
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
              <FlashSale products={specialOffers} />
            </div>
          </div>
        )}

        {/* ── Promo Banners ── */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-8 md:mb-12">
          <PromoBanners />
        </div>

        {/* ── NutriTrust™ Purity Section ── */}
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-10 md:mb-14">
          <div className="relative bg-white rounded-3xl p-7 md:p-12 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
            {/* Background orbs */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#009E3C]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-[#F3911E]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col lg:flex-row items-center gap-10 lg:gap-16 z-10">
              <div className="lg:w-1/2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#009E3C]/10 border border-[#009E3C]/20 rounded-full mb-5">
                  <span className="w-2 h-2 bg-[#009E3C] rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#009E3C]">Purity Verified</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-5">
                  The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009E3C] to-[#00bc49]">NutriTrust™</span>
                  <br />Standard of Excellence
                </h2>
                <p className="text-base md:text-lg text-gray-500 mb-8 leading-relaxed">
                  We don&apos;t just sell supplements; we verify them. Every batch is independently tested for
                  <span className="font-bold text-gray-800"> heavy metals, purity, and active potency</span>.
                  Shop with clinical-grade transparency.
                </p>

                <div className="grid grid-cols-2 gap-5">
                  {[
                    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />, label: 'Lab-Certified', sub: 'Third-party analyzed', bg: 'bg-orange-50', color: 'text-orange-500' },
                    { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />, label: 'Direct Source', sub: 'Anti-counterfeit tech', bg: 'bg-blue-50', color: 'text-blue-500' },
                  ].map((feat, i) => (
                    <div key={i} className="flex items-start gap-3.5">
                      <div className={`w-10 h-10 rounded-xl ${feat.bg} flex items-center justify-center flex-shrink-0`}>
                        <svg className={`w-5 h-5 ${feat.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">{feat.icon}</svg>
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900">{feat.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{feat.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:w-1/2 grid grid-cols-2 gap-3 md:gap-4 w-full">
                {[
                  { label: 'Purity Score',    val: '99.8%', border: 'border-[#009E3C]',  text: 'text-[#009E3C]'  },
                  { label: 'Active Potency',  val: '100%',  border: 'border-[#F3911E]',  text: 'text-[#F3911E]'  },
                  { label: 'Heavy Metals',    val: 'Pass',  border: 'border-blue-500',   text: 'text-blue-600'   },
                  { label: 'Microbial Test',  val: 'Clear', border: 'border-purple-500', text: 'text-purple-600' }
                ].map((stat, i) => (
                  <div key={i} className={`bg-gray-50/80 rounded-2xl p-5 md:p-6 border-b-[3px] ${stat.border} shadow-sm hover:shadow-md hover:bg-white transition-all duration-250 group/stat`}>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{stat.label}</p>
                    <p className={`text-3xl md:text-4xl font-black ${stat.text} group-hover/stat:scale-105 transition-transform duration-250 origin-left`}>
                      {stat.val}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Wellness Stack Builder ── */}
        <section
          className="relative py-12 md:py-16 mb-10 md:mb-16"
          style={{ backgroundImage: 'url(/images/hero1.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-[#0d2218]/82 backdrop-blur-[2px]" />

          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6">
            <div className="max-w-lg text-center mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full mb-4">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-green-400">Tailored For You</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black mb-3 text-white tracking-tight leading-tight">
                Build Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Stack</span>
              </h2>
              <p className="text-white/70 text-sm md:text-base">Select your primary health goal to uncover curated, high-potency combinations.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
              {[
                { title: 'Immunity', icon: <FaShieldAlt />, description: 'Strengthen defenses', color: '#F3911E', bgColor: 'rgba(255,248,225,0.9)', slug: 'dietary-supplements' },
                { title: 'Focus',    icon: <FaBrain />,     description: 'Enhance clarity',     color: '#8B5CF6', bgColor: 'rgba(245,243,255,0.9)', slug: 'vitamins' },
                { title: 'Muscle',   icon: <FaDumbbell />,  description: 'Optimize gains',      color: '#EF4444', bgColor: 'rgba(254,242,242,0.9)', slug: 'weight-gainers' },
                { title: 'Longevity',icon: <FaBolt />,      description: 'Fuel vitality',       color: '#009E3C', bgColor: 'rgba(240,253,244,0.9)', slug: 'dietary-supplements' }
              ].map((goal, i) => (
                <Link
                  key={i}
                  href={`/shop?category=${goal.slug}`}
                  className="group relative bg-white/10 backdrop-blur-md p-5 md:p-6 rounded-2xl border border-white/20 hover:border-white/50 hover:bg-white/18 transition-all duration-300 flex flex-col items-center text-center overflow-hidden"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl" style={{ background: `radial-gradient(circle at center, ${goal.color}15 0%, transparent 70%)` }} />

                  <div
                    className="relative w-13 h-13 w-12 h-12 rounded-2xl flex items-center justify-center mb-3.5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-400 shadow-lg"
                    style={{ backgroundColor: goal.bgColor }}
                  >
                    <div style={{ color: goal.color, fontSize: '20px' }}>{goal.icon}</div>
                  </div>

                  <p className="font-extrabold text-base md:text-lg mb-1 text-white leading-tight">{goal.title}</p>
                  <p className="text-[11px] text-white/65 tracking-wide mb-4">{goal.description}</p>
                  <div className="flex items-center gap-1 text-green-400 font-black text-[11px] uppercase tracking-wider group-hover:gap-2 transition-all duration-200">
                    Begin
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Quality Guarantee Banner ── */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-8 md:mb-12">
          <div className="relative bg-gradient-to-r from-[#009E3C] via-[#00a840] to-[#2E7D32] rounded-2xl overflow-hidden shadow-[0_8px_36px_rgba(0,158,60,0.28)] flex flex-col md:flex-row">
            <div className="relative p-8 md:p-12 z-10 md:w-2/3 flex flex-col justify-center">
              {/* Inset highlight */}
              <div className="absolute top-0 left-0 right-0 h-px bg-white/25" />

              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-3 py-1 mb-5 w-fit">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Our Promise</span>
              </div>

              <h3 className="text-2xl md:text-4xl font-black text-white mb-3 leading-tight tracking-tight">
                Quality You Can Trust
              </h3>
              <p className="text-green-100/90 text-sm md:text-base mb-7 max-w-md leading-relaxed">
                Every product is tested for purity, potency, and freshness. We guarantee 100% authentic products sourced directly from manufacturers.
              </p>
              <div>
                <Link
                  href="/aboutUs"
                  className="inline-flex items-center gap-2 bg-white text-[#009E3C] font-black text-sm px-7 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-[0_4px_14px_rgba(0,0,0,0.18)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.22)] active:scale-[0.97]"
                >
                  Read Our Guarantee
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 bottom-0 w-1/2 opacity-10 pointer-events-none hidden md:block overflow-hidden">
              <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="absolute right-0 w-full h-full transform translate-x-1/4 scale-150">
                <path fill="#fff" d="M46.7,-77.9C59.9,-69.5,69.5,-54.2,74.9,-38.5C80.3,-22.8,81.4,-6.6,76.5,7.5C71.7,21.5,60.8,33.4,49.8,44C38.7,54.6,27.5,63.9,13.7,69.6C-0.1,75.3,-16.5,77.3,-30.5,71.2C-44.5,65.2,-56.1,51.1,-66,36C-75.9,20.8,-84,4.7,-81.9,-10.1C-79.9,-25,-67.7,-38.6,-53.8,-47.5C-39.9,-56.3,-24.3,-60.4,-8.1,-58.5C8.1,-56.5,23.3,-48.5,33.5,-86.3Z" transform="translate(200 200)" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Recommended For You ── */}
        {recommended && recommended.length > 0 && (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mb-8 md:mb-12">
            <div className="bg-white rounded-2xl px-5 py-6 md:px-8 md:py-10 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-gray-100">
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

        {/* ── Wellness Blog ── */}
        <div className="bg-white border-y border-gray-100 shadow-[0_1px_6px_rgba(0,0,0,0.04)] py-12 md:py-16">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
            <WellnessHub />
          </div>
        </div>

      </main>
    </>
  );
}
