import ProductCarousel from "@/components/common/ProductCarousel";
import BrandsSection from "@/components/homepage/Brands";
import HeroCarousel, { CarouselSlide } from "@/components/homepage/imageCarousel";
import CategoryGrid from "@/components/homepage/Categories";
import LiveBlogSection from "@/components/Blog/index";
import { Product } from "@/types/product.types";
import { apiClient, getImageUrl, type Product as ApiProduct } from "@/lib/api/client";

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

import { newArrivalsFallback, topSellingFallback, specialOffersFallback } from "@/data/home-fallbacks";

// Helper to transform API product to UI product
const transformProduct = (p: ApiProduct): Product => {
  const primaryImage = p.images?.find(img => img.is_primary) || p.images?.[0];
  const imageUrl = primaryImage ? getImageUrl(primaryImage.image_path) : '/images/placeholder.jpg';

  return {
    id: p.id,
    title: p.name,
    srcUrl: imageUrl,
    gallery: p.images?.map(img => getImageUrl(img.image_path)) || [imageUrl],
    price: p.price,
    discount: {
      amount: 0,
      percentage: p.discount_percentage || 0,
    },
    rating: 5,
    brand: p.brand?.name
  };
};

async function getHomePageData() {
  try {
    const [newArrivalsReq, topSellingReq, specialOffersReq, settingsReq] = await Promise.all([
      apiClient.getProducts({ is_new_arrival: true, per_page: 8 }).catch(() => ({ status: false, data: null })),
      apiClient.getProducts({ sort: 'sales_count', per_page: 8 }).catch(() => ({ status: false, data: null })),
      apiClient.getProducts({ is_featured: true, per_page: 8 }).catch(() => ({ status: false, data: null })),
      apiClient.getPublicSettings().catch(() => ({ status: false, data: null }))
    ]);

    const newArrivals = (newArrivalsReq.status && newArrivalsReq.data?.data?.length)
      ? newArrivalsReq.data.data.map(transformProduct)
      : newArrivalsFallback;

    const topSelling = (topSellingReq.status && topSellingReq.data?.data?.length)
      ? topSellingReq.data.data.map(transformProduct)
      : topSellingFallback;

    const specialOffers = (specialOffersReq.status && specialOffersReq.data?.data?.length)
      ? specialOffersReq.data.data.map(transformProduct)
      : specialOffersFallback;

    const dynamicSlides = (settingsReq.status && settingsReq.data?.hero_carousel?.length)
      ? settingsReq.data.hero_carousel
      : carouselSlides;

    return { newArrivals, topSelling, specialOffers, heroSlides: dynamicSlides };

  } catch (error) {
    console.error("Failed to fetch homepage data, using fallback:", error);
    return {
      newArrivals: newArrivalsFallback,
      topSelling: topSellingFallback,
      specialOffers: specialOffersFallback,
      heroSlides: carouselSlides
    };
  }
}

export default async function Home() {
  const { newArrivals, topSelling, specialOffers, heroSlides } = await getHomePageData();

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
            {[
              { icon: "🚚", title: "Free Delivery", desc: "Orders over 100K UGX" },
              { icon: "🔒", title: "Secure Payment", desc: "100% safe checkout" },
              { icon: "🔄", title: "Easy Returns", desc: "14-day return policy" },
              { icon: "💬", title: "24/7 Support", desc: "Always here to help" },
            ].map((perk, i) => (
              <div key={i} className="flex items-center gap-3 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-4 md:p-5 hover:shadow-lg hover:shadow-green-100/50 transition-all duration-300 group">
                <span className="text-2xl md:text-3xl group-hover:scale-110 transition-transform duration-300">{perk.icon}</span>
                <div>
                  <p className="font-bold text-green-900 text-sm md:text-base">{perk.title}</p>
                  <p className="text-green-600/70 text-xs md:text-sm">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Special Offers */}
        <section className="w-full">
          <ProductCarousel
            products={specialOffers}
            title="Special Offers"
            subtitle="Exclusive deals handpicked for you"
            badge="🔥 HOT"
            viewAllLink="/shop?is_featured=true"
          />
        </section>

        <div className="max-w-[1600px] mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent my-8 md:my-12" />
        </div>

        <div className="container mx-auto px-4">
          <CategoryGrid />
        </div>

        <div className="max-w-[1600px] mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent my-8 md:my-12" />
        </div>

        {/* New Arrivals Section */}
        <section className="w-full">
          <ProductCarousel
            products={newArrivals}
            title="New Arrivals"
            subtitle="Fresh additions to our collection"
            badge="✨ NEW"
            viewAllLink="/shop?is_new_arrival=true"
          />
        </section>

        <div className="max-w-[1600px] mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent my-8 md:my-12" />
        </div>

        {/* Trending Now */}
        <section className="w-full">
          <ProductCarousel
            products={topSelling}
            title="Trending Now"
            subtitle="What everyone's loving right now"
            badge="📈 TRENDING"
            viewAllLink="/shop?sort=popular"
          />
        </section>

        <div className="max-w-[1600px] mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent my-8 md:my-12" />
        </div>

        <BrandsSection />

        <LiveBlogSection />

        <div className="max-w-[1600px] mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-green-200 to-transparent my-8 md:my-12" />
        </div>

      </main>
    </>
  );
}
