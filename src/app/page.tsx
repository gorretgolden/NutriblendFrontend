import ProductCarousel from "@/components/common/ProductCarousel";
import BrandsSection from "@/components/homepage/Brands";
import HeroCarousel, { CarouselSlide } from "@/components/homepage/imageCarousel";
import CategoryGrid from "@/components/homepage/Categories";
import WellnessHub from "@/components/Blog/index";
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
      <main className="mt-[50px] sm:mt-[72px]">

        {/* Hero Carousel Section */}
        <section className="mb-8 md:mb-14">
          <HeroCarousel slides={heroSlides} autoPlay={true} interval={5000} />
        </section>

        {/* Trust/Perks Banner */}
        <section className="max-w-[1600px] mx-auto px-6 mb-8 md:mb-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {/* Free Delivery */}
            <div className="flex items-center gap-3 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-4 md:p-5 hover:shadow-lg hover:shadow-green-100/50 transition-all duration-300 group">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-600 transition-colors duration-300 flex-shrink-0">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
              </div>
              <div>
                <p className="font-bold text-green-900 text-sm md:text-base">Free Delivery</p>
                <p className="text-green-600/70 text-xs md:text-sm">Orders over 100K UGX</p>
              </div>
            </div>
            {/* Secure Payment */}
            <div className="flex items-center gap-3 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-4 md:p-5 hover:shadow-lg hover:shadow-green-100/50 transition-all duration-300 group">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-600 transition-colors duration-300 flex-shrink-0">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <div>
                <p className="font-bold text-green-900 text-sm md:text-base">Secure Payment</p>
                <p className="text-green-600/70 text-xs md:text-sm">100% safe checkout</p>
              </div>
            </div>
            {/* Easy Returns */}
            <div className="flex items-center gap-3 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-4 md:p-5 hover:shadow-lg hover:shadow-green-100/50 transition-all duration-300 group">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-600 transition-colors duration-300 flex-shrink-0">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </div>
              <div>
                <p className="font-bold text-green-900 text-sm md:text-base">Easy Returns</p>
                <p className="text-green-600/70 text-xs md:text-sm">14-day return policy</p>
              </div>
            </div>
            {/* 24/7 Support */}
            <div className="flex items-center gap-3 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-4 md:p-5 hover:shadow-lg hover:shadow-green-100/50 transition-all duration-300 group">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-600 transition-colors duration-300 flex-shrink-0">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <div>
                <p className="font-bold text-green-900 text-sm md:text-base">24/7 Support</p>
                <p className="text-green-600/70 text-xs md:text-sm">Always here to help</p>
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
                title="Special Offers"
                subtitle="Exclusive deals handpicked for you"
                badge="HOT"
                viewAllLink="/shop?is_special_offer=true"
              />
            </section>

            <div className="max-w-[1600px] mx-auto px-6">
              <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent my-8 md:my-12" />
            </div>
          </>
        )}

        <div className="container mx-auto px-4">
          <CategoryGrid />
        </div>

        <div className="max-w-[1600px] mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent my-8 md:my-12" />
        </div>

        {/* New Arrivals — only shown if admin has marked products */}
        {newArrivals && newArrivals.length > 0 && (
          <>
            <section className="w-full">
              <ProductCarousel
                products={newArrivals}
                title="New Arrivals"
                subtitle="Fresh additions to our collection"
                badge="NEW"
                viewAllLink="/shop?is_new_arrival=true"
              />
            </section>

            <div className="max-w-[1600px] mx-auto px-6">
              <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent my-8 md:my-12" />
            </div>
          </>
        )}

        {/* Trending Now — only shown if admin has marked products as trending */}
        {trending && trending.length > 0 && (
          <>
            <section className="w-full">
              <ProductCarousel
                products={trending}
                title="Trending Now"
                subtitle="What everyone's loving right now"
                badge="TRENDING"
                viewAllLink="/shop?is_trending=true"
              />
            </section>

            <div className="max-w-[1600px] mx-auto px-6">
              <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent my-8 md:my-12" />
            </div>
          </>
        )}

        {/* Recommended For You — only shown if admin has marked products */}
        {recommended && recommended.length > 0 && (
          <>
            <section className="w-full">
              <ProductCarousel
                products={recommended}
                title="Recommended For You"
                subtitle="Products we think you'll love"
                badge="PICK"
                viewAllLink="/shop?is_recommended=true"
              />
            </section>

            <div className="max-w-[1600px] mx-auto px-6">
              <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent my-8 md:my-12" />
            </div>
          </>
        )}

        <BrandsSection />

        <WellnessHub />

        <div className="max-w-[1600px] mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent my-8 md:my-12" />
        </div>

      </main>
    </>
  );
}
