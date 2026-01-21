import ProductListSec from "@/components/common/ProductListSec";
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
    ctaLink: '/products/chlorophyll',
    layout: 'imageLeft'
  },
  {
    id: 2,
    image: '/images/43.avif',
    title: 'Plant-Based Proteins',
    subtitle: 'Fuel your body the natural way',
    ctaText: 'Discover',
    ctaLink: '/products/proteins',
    layout: 'imageRight'
  },
  {
    id: 3,
    image: '/images/156.avif',
    title: 'Essential Vitamins',
    subtitle: 'Boost your immune system',
    ctaText: 'Explore',
    ctaLink: '/products/vitamins',
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
    rating: 5, // Default rating as API doesn't return average rating yet
    brand: p.brand?.name
  };
};

async function getHomePageData() {
  try {
    // parallel fetching with timeout/error protection
    const [newArrivalsReq, topSellingReq, specialOffersReq] = await Promise.all([
      apiClient.getProducts({ sort: 'created_at', per_page: 8 }).catch(() => ({ status: false, data: null })),
      apiClient.getProducts({ sort: 'sales_count', per_page: 8 }).catch(() => ({ status: false, data: null })),
      apiClient.getProducts({ is_featured: true, per_page: 8 }).catch(() => ({ status: false, data: null }))
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

    return { newArrivals, topSelling, specialOffers };

  } catch (error) {
    console.error("Failed to fetch homepage data, using fallback:", error);
    return {
      newArrivals: newArrivalsFallback,
      topSelling: topSellingFallback,
      specialOffers: specialOffersFallback
    };
  }
}

export default async function Home() {
  const { newArrivals, topSelling, specialOffers } = await getHomePageData();

  return (
    <>
      <main className="my-[50px] sm:my-[72px]">

        {/* Hero Carousel Section */}
        <section className="mb-12">
          <HeroCarousel slides={carouselSlides} autoPlay={true} interval={5000} />
        </section>

        {/* Special Offer Section with Carousel */}
        <section className="w-full">
          <ProductCarousel
            products={specialOffers}
            title="Special Offers"
            viewAllLink="/shop?is_featured=true"
          />
        </section>

        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
        </div>

        <div className="container mx-auto px-4">
          <CategoryGrid />
        </div>

        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
        </div>


        {/* New Arrivals Section with Carousel */}
        <section className="w-full">
          <ProductCarousel
            products={newArrivals}
            title="New Arrivals"
            viewAllLink="/shop?sort=created_at"
          />
        </section>

        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
        </div>

        {/* Top Selling Section with Carousel */}
        <section className="w-full">
          <ProductCarousel
            products={topSelling}
            title="Trending Now"
            viewAllLink="/shop?sort=popular"
          />
        </section>

        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
        </div>

        <BrandsSection />

        <LiveBlogSection />


        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
        </div>

      </main>
    </>
  );
}
