import ProductCarousel from "@/components/common/ProductCarousel";
import BrandsSection from "@/components/homepage/Brands";
import HeroCarousel, { CarouselSlide } from "@/components/homepage/imageCarousel";
import CategoryGrid from "@/components/homepage/Categories";
import WellnessHub from "@/components/Blog/index";
import FlashSale from "@/components/homepage/FlashSale";
import PromoBanners from "@/components/homepage/PromoBanners";
import { Product } from "@/types/product.types";
import { apiClient } from "@/lib/api/client";
import { transformProduct } from "@/lib/transformers";

const carouselSlides: CarouselSlide[] = [
  {
    id: 1,
    image: '/images/one.avif',
    title: 'Liquid Chlorophyll',
    subtitle: 'Health benefits and side effects',
    ctaText: 'Shop Now',
    ctaLink: '/shop',
    layout: 'imageLeft'
  },
  {
    id: 2,
    image: '/images/43.avif',
    title: 'Plant-Based Proteins',
    subtitle: 'Fuel your body the natural way',
    ctaText: 'Discover',
    ctaLink: '/shop',
    layout: 'imageRight'
  },
  {
    id: 3,
    image: '/images/156.avif',
    title: 'Essential Vitamins',
    subtitle: 'Boost your immune system',
    ctaText: 'Explore',
    ctaLink: '/shop',
    layout: 'imageLeft'
  }
];

// Revalidate homepage data every 60 seconds
export const revalidate = 60;

async function getHomePageData() {
  try {
    const [newArrivalsReq, trendingReq, specialOffersReq, recommendedReq, settingsReq] = await Promise.all([
      apiClient.getProducts({ is_new_arrival: true, per_page: 8 }).catch(() => ({ status: false, data: null })),
      apiClient.getProducts({ is_trending: true, per_page: 8 }).catch(() => ({ status: false, data: null })),
      apiClient.getProducts({ is_special_offer: true, per_page: 8 }).catch(() => ({ status: false, data: null })),
      apiClient.getProducts({ is_recommended: true, per_page: 8 }).catch(() => ({ status: false, data: null })),
      apiClient.getPublicSettings().catch(() => ({ status: false, data: null }))
    ]);

    const newArrivals = (newArrivalsReq.status && newArrivalsReq.data?.data?.length)
      ? newArrivalsReq.data.data.map(transformProduct)
      : null;

    const trending = (trendingReq.status && trendingReq.data?.data?.length)
      ? trendingReq.data.data.map(transformProduct)
      : null;

    const specialOffers = (specialOffersReq.status && specialOffersReq.data?.data?.length)
      ? specialOffersReq.data.data.map(transformProduct)
      : null;

    const recommended = (recommendedReq.status && recommendedReq.data?.data?.length)
      ? recommendedReq.data.data.map(transformProduct)
      : null;

    const dynamicSlides = (settingsReq.status && settingsReq.data?.hero_carousel?.length)
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
      <main className="pt-2 md:pt-4">

        {/* Hero Carousel Section */}
        <section className="mb-4 md:mb-8">
          <HeroCarousel slides={heroSlides} autoPlay={true} interval={5000} />
        </section>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <FlashSale products={specialOffers} />
        </div>

        <PromoBanners />

        {/* Trust/Perks Banner */}
        <section className="max-w-[1600px] mx-auto px-4 sm:px-6 mb-8 md:mb-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {/* Free Delivery */}
            <div className="flex items-center gap-3 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 md:p-5 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 group">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300 flex-shrink-0">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
              </div>
              <div>
                <p className="font-bold text-blue-900 text-sm md:text-base">Express Shipping</p>
                <p className="text-blue-600/70 text-xs md:text-sm">Health delivered fast</p>
              </div>
            </div>
            {/* Secure Payment */}
            <div className="flex items-center gap-3 bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 rounded-2xl p-4 md:p-5 hover:shadow-lg hover:shadow-teal-100/50 transition-all duration-300 group">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-teal-100 flex items-center justify-center group-hover:bg-teal-600 transition-colors duration-300 flex-shrink-0">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-teal-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <div>
                <p className="font-bold text-teal-900 text-sm md:text-base">Secure Checkout</p>
                <p className="text-teal-600/70 text-xs md:text-sm">Encrypted transactions</p>
              </div>
            </div>
            {/* Professional Advice */}
            <div className="flex items-center gap-3 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-4 md:p-5 hover:shadow-lg hover:shadow-indigo-100/50 transition-all duration-300 group">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300 flex-shrink-0">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-indigo-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.829c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <div>
                <p className="font-bold text-indigo-900 text-sm md:text-base">Certified Lab</p>
                <p className="text-indigo-600/70 text-xs md:text-sm">Quality guaranteed</p>
              </div>
            </div>
            {/* 24/7 Support */}
            <div className="flex items-center gap-3 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-4 md:p-5 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 group">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300 flex-shrink-0">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-blue-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <div>
                <p className="font-bold text-blue-900 text-sm md:text-base">Quick Support</p>
                <p className="text-blue-600/70 text-xs md:text-sm">Expert clinical team</p>
              </div>
            </div>
          </div>
        </section>

        {/* Special Offers — only shown if admin has marked products */}
        {specialOffers && specialOffers.length > 0 && (
          <>
            <section className="w-full">
              <ProductCarousel
                products={specialOffers}
                title="Curated Wellness Deals"
                subtitle="Exclusive clinical-grade offers selected for you"
                badge="HOT"
                viewAllLink="/shop?is_special_offer=true"
              />
            </section>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
              <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent my-8 md:my-12" />
            </div>
          </>
        )}

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <CategoryGrid />
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent my-8 md:my-12" />
        </div>

        {/* New Arrivals — only shown if admin has marked products */}
        {newArrivals && newArrivals.length > 0 && (
          <>
            <section className="w-full">
              <ProductCarousel
                products={newArrivals}
                title="Latest Formulations"
                subtitle="New additions to our pharmaceutical collection"
                badge="NEW"
                viewAllLink="/shop?is_new_arrival=true"
              />
            </section>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
              <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent my-8 md:my-12" />
            </div>
          </>
        )}

        {/* Trending Now — only shown if admin has marked products as trending */}
        {trending && trending.length > 0 && (
          <>
            <section className="w-full">
              <ProductCarousel
                products={trending}
                title="Top Rated Solutions"
                subtitle="Highly recommended by our wellness experts"
                badge="TRENDING"
                viewAllLink="/shop?is_trending=true"
              />
            </section>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
              <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent my-8 md:my-12" />
            </div>
          </>
        )}

        {/* Recommended For You — only shown if admin has marked products */}
        {recommended && recommended.length > 0 && (
          <>
            <section className="w-full">
              <ProductCarousel
                products={recommended}
                title="Personalized For You"
                subtitle="Wellness products tailored to your needs"
                badge="PICK"
                viewAllLink="/shop?is_recommended=true"
              />
            </section>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
              <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent my-8 md:my-12" />
            </div>
          </>
        )}

        <BrandsSection />

        <WellnessHub />

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent my-8 md:my-12" />
        </div>

      </main>
    </>
  );
}
