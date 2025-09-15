import ProductListSec from "@/components/common/ProductListSec";
import ProductCarousel from "@/components/common/ProductCarousel";
import Brands from "@/components/homepage/Brands";
import DressStyle from "@/components/homepage/DressStyle";
import Header from "@/components/homepage/Header";
import Reviews from "@/components/homepage/Reviews";
import { Product } from "@/types/product.types";
import { Review } from "@/types/review.types";
import HeroCarousel, { CarouselSlide } from "@/components/homepage/imageCarousel";
import CategoryGrid from "@/components/homepage/Categories";


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



export const newArrivalsData: Product[] = [
  {
    id: 1,
    title: "T-shirt with Tape Details",
    srcUrl: "/images/bottle1.avif",
    gallery: ["/images/bottle1.avif", "/images/bottle10.avif", "/images/bottle11.avif"],
    price: 120,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
  },
  {
    id: 2,
    title: "Skinny Fit Jeans",
    srcUrl: "/images/bottle2.avif",
    gallery: ["/images/bottle2.avif"],
    price: 260,
    discount: {
      amount: 0,
      percentage: 20,
    },
    rating: 3.5,
  },
  {
    id: 3,
    title: "Chechered Shirt",
    srcUrl: "/images/bottle3.avif",
    gallery: ["/images/bottle3.avif"],
    price: 180,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
  },
  {
    id: 4,
    title: "Sleeve Striped T-shirt",
    srcUrl: "/images/bottle4.avif",
    gallery: ["/images/bottle4.avif", "/images/bottle10.avif", "/images/bottle11.avif"],
    price: 160,
    discount: {
      amount: 0,
      percentage: 30,
    },
    rating: 4.5,
  },
 
  {
    id: 9,
    title: "Classic Denim Jacket",
    srcUrl: "/images/bottle9.avif",
    gallery: ["/images/bottle9.avif"],
    price: 189,
    discount: {
      amount: 0,
      percentage: 15,
    },
    rating: 4.2,
  },
  {
    id: 10,
    title: "Premium Leather Boots",
    srcUrl: "/images/bottle10.avif",
    gallery: ["/images/bottle10.avif"],
    price: 299,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.8,
  }
];

export const topSellingData: Product[] = [
  {
    id: 5,
    title: "Vertical Striped Shirt",
    srcUrl: "/images/bottle5.avif",
    gallery: ["/images/bottle5.avif", "/images/bottle10.avif", "/images/bottle11.avif"],
    price: 232,
    discount: {
      amount: 0,
      percentage: 20,
    },
    rating: 5.0,
  },
  {
    id: 6,
    title: "Courage Graphic T-shirt",
    srcUrl: "/images/bottle6.avif",
    gallery: ["/images/bottle6.avif", "/images/bottle10.avif", "/images/bottle11.avif"],
    price: 145,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.0,
  },
  {
    id: 7,
    title: "Loose Fit Bermuda Shorts",
    srcUrl: "/images/bottle7.avif",
    gallery: ["/images/bottle7.avif"],
    price: 80,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 3.0,
  },
  {
    id: 8,
    title: "Faded Skinny Jeans",
    srcUrl: "/images/bottle8.avif",
    gallery: ["/images/bottle8.avif"],
    price: 210,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
  },
  
  {
    id: 11,
    title: "Sport Performance Shorts",
    srcUrl: "/images/bottle11.avif",
    gallery: ["/images/bottle11.avif"],
    price: 75,
    discount: {
      amount: 0,
      percentage: 10,
    },
    rating: 4.3,
  },
  {
    id: 12,
    title: "Wool Blend Sweater",
    srcUrl: "/images/bottle12.avif",
    gallery: ["/images/bottle12.avif"],
    price: 145,
    discount: {
      amount: 0,
      percentage: 25,
    },
    rating: 4.6,
  }
];


export const specialOfferProducts: Product[] = [
  {
    id: 20,
    title: "DHA 700 Fish Oil, Ultra-Concentrated",
    srcUrl: "/images/bottle1.avif",
    gallery: ["/images/bottle1.avif"],
    price: 29093,
    discount: {
      amount: 0,
      percentage: 29,
    },
    rating: 5,
    reviews: 12616,
    brand: "California Gold Nutrition"
  },
  {
    id: 21,
    title: "Omega-3 Premium Fish Oil, 100 Softgels",
    srcUrl: "/images/bottle2.avif",
    gallery: ["/images/bottle2.avif"],
    price: 48497,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 5,
    reviews: 458474,
    brand: "California Gold Nutrition"
  },
  {
    id: 22,
    title: "Omega 800 Ultra-Concentrated Fish Oil",
    srcUrl: "/images/bottle3.avif",
    gallery: ["/images/bottle3.avif"],
    price: 39426,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 5,
    reviews: 120548,
    brand: "California Gold Nutrition"
  },
  {
    id: 23,
    title: "Omega-3 Fish Oil, 1,000 mg, 180 Softgels",
    srcUrl: "/images/bottle4.avif",
    gallery: ["/images/bottle4.avif"],
    price: 34210,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 5,
    reviews: 139472,
    brand: "NOW Foods"
  },
 
  {
    id: 24,
    title: "Vitamin D3 Supplement, 1000IU",
    srcUrl: "/images/bottle13.avif",
    gallery: ["/images/bottle13.avif"],
    price: 15999,
    discount: {
      amount: 0,
      percentage: 15,
    },
    rating: 4.7,
    reviews: 89234,
    brand: "Nature's Bounty"
  },
  {
    id: 25,
    title: "Probiotic Complex, 30 Capsules",
    srcUrl: "/images/bottle14.avif",
    gallery: ["/images/bottle14.avif"],
    price: 24999,
    discount: {
      amount: 0,
      percentage: 0,
    },
    rating: 4.5,
    reviews: 67321,
    brand: "Garden of Life"
  }
];



export default function Home() {
  return (
    <>
      <main className="my-[50px] sm:my-[72px]">

        {/* Hero Carousel Section */}
       <section className="mb-12">
        <HeroCarousel slides={carouselSlides} autoPlay={true} interval={5000} />
      </section>

        {/* SPecial Offer Section with Carousel */}
        <ProductCarousel
          products={specialOfferProducts}
          title="Special Offers"
          viewAllLink="/recommendations"
        />

        <div className="container mx-auto px-4">
           <CategoryGrid />
        </div>

        
        {/* New Arrivals Section with Carousel */}
        <ProductCarousel
          products={newArrivalsData}
          title="New Arrivals"
          viewAllLink="/shop#new-arrivals"
        />
        
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
        </div>
        
        {/* Top Selling Section with Carousel */}
        <ProductCarousel
          products={topSellingData}
          title="Trending Now"
          viewAllLink="/shop#top-selling"
        />
        
      </main>
    </>
  );
}
