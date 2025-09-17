"use client";
import { useState, useRef, useEffect, FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  name: string;
  rating: number;
  price: string;
  origin: string;
  image: string;
}

const liveProducts: Product[] = [
  // (Your product data array remains the same as provided)
  {
    name: 'Crest, 3D Whitestrips™, Enamel Safe Dental...',
    rating: 16715,
    price: '215,053USh',
    origin: 'Israel',
    image: '/images/43.avif',
  },
  {
    name: 'XTEND, 7G BCAA, Knockout Fruit Punch, 2.58 lb (1.17...',
    rating: 1036,
    price: '249,500USh',
    origin: 'Japan',
    image: '/images/156.avif',
  },
  {
    name: 'Citracal, Calcium Supplement + D3, Slow Release 1200...',
    rating: 863,
    price: '62,896USh',
    origin: 'United States',
    image: '/images/astra.jpg',
  },
  {
    name: 'Natural Factors, Calcium Citrate, 350 mg, 90 Tablets',
    rating: 12681,
    price: '34,853USh',
    origin: 'Taiwan',
    image: '/images/bayer.png',
  },
  {
    name: 'California Gold Nutrition, Omega 800 Ultra ...',
    rating: 120909,
    price: '39,426USh',
    origin: 'Taiwan',
    image: '/images/bottle1.avif',
  },
  {
    name: 'Bragg, Energy, Apple Cider Vinegar + 6 B Vitamins, 90...',
    rating: 1351,
    price: '80,866USh',
    origin: 'Hong Kong',
    image: '/images/bottle2.avif',
  },
  {
    name: 'Life Extension, AMPK Metabolic Activator, 30 Vegetarian Tablets',
    rating: 10965,
    price: '110,347USh',
    origin: 'Thailand',
    image: '/images/bottle3.avif',
  },
  {
    name: 'NOW Foods, Natural Beta Carotene, 7,500 mcg (25,000 IU), 180 Softgels',
    rating: 5013,
    price: '97,576USh',
    origin: 'Japan',
    image: '/images/bottle4.avif',
  },
  {
    name: "Doctor's Best, PepZin GI®, Zinc-L-Carnosine Complex, 120 Veggie Caps",
    rating: 20818,
    price: '81,922USh',
    origin: 'China',
    image: '/images/bottle5.avif',
  },
  {
    name: 'Dragon Herbs, Deer Placenta, 500 mg, 60 Capsules',
    rating: 865,
    price: '225,230USh',
    origin: 'Malaysia',
    image: '/images/bottle6.avif',
  },
  {
    name: 'California Gold Nutrition, Vitamin D3, 50 mcg (2,000 IU), 90 Fish Gelatin Softgels',
    rating: 134838,
    price: '19,036USh',
    origin: 'Philippines',
    image: '/images/bottle7.avif',
  },
  {
    name: 'Source Naturals, Wellness Formula®, Advanced Immune Support, 240 Capsules',
    rating: 4627,
    price: '138,117USh',
    origin: 'China',
    image: '/images/bottle8.avif',
  },
  {
    name: 'Dear, Klairs, Midnight Blue Youth Activating Drop, 0.67 fl oz (20 ml)',
    rating: 1282,
    price: '113,782USh',
    origin: 'Canada',
    image: '/images/bottle9.avif',
  },
  {
    name: 'NaturVet, VitaPet Senior, Daily Vitamins + Glucosamine, For Dogs, 120 Soft Chews, 12.6 oz (360 g)',
    rating: 364,
    price: '76,188USh',
    origin: 'Philippines',
    image: '/images/bottle10.avif',
  },
  {
    name: 'SOME BY MI, AHA. BHA. PHA 30 Days Miracle Acne Clear Body Cleanser, 14.10 oz (400 g)',
    rating: 7941,
    price: '59,722USh',
    origin: 'Japan',
    image: '/images/bottle11.avif',
  },
  {
    name: 'NOW Foods, Magnesium Glycinate, 180 Tablets (100 mg per Tablet)',
    rating: 22352,
    price: '80,790USh',
    origin: 'Kuwait',
    image: '/images/bottle12.avif',
  },
  {
    name: 'YEOUTH, Glycolic Acid 30% Gel Peel, 2 fl oz (60 ml)',
    rating: 14494,
    price: '138,243USh',
    origin: 'United Kingdom (UK)',
    image: '/images/bottle13.avif',
  },
  {
    name: 'Source Naturals, MBP, Bone Renew, 40 mg, 120 Capsules',
    rating: 446,
    price: '183,704USh',
    origin: 'Japan',
    image: '/images/bottle14.avif',
  },
  {
    name: "Garden of Life, Dr. Formulated Probiotics, Once Daily Women's, 50 Billion, 30 Vegetarian Capsules",
    rating: 23431,
    price: '132,796USh',
    origin: 'Hong Kong',
    image: '/images/bottle2.avif',
  },
  {
    name: 'California Gold Nutrition, Gold C™, USP Grade Vitamin C, 1,000 mg, 60 Veggie Capsules',
    rating: 362662,
    price: '20,841USh',
    origin: 'Japan',
    image: '/images/bottle1.avif',
  },
  {
    name: 'Thorne, Glutathione-SR, 60 Capsules (175 mg per Capsule)',
    rating: 2246,
    price: '188,060USh',
    origin: 'Korea, Republic of',
    image: '/images/pic1.png',
  },
  {
    name: 'Boiron, Camilia®, Teething Relief, 1 Month+, 30 Doses, 0.034 fl oz (1 ml) Each',
    rating: 40428,
    price: '52,734USh',
    origin: 'Korea, Republic of',
    image: '/images/pic2.png',
  },
  {
    name: 'NOW Foods, D-Mannose Pure Powder, 3 oz (85 g)',
    rating: 3662,
    price: '78,578USh',
    origin: 'United States',
    image: '/images/pic3.png',
  },
  {
    name: 'Nutricost, NAC, 600 mg, 240 Capsules',
    rating: 287,
    price: '113,998USh',
    origin: 'China',
    image: '/images/pic5.png',
  },
  {
    name: 'NOW Foods, Vitamin D-3, Max Potency, 50,000 IU, 50 Softgels',
    rating: 20542,
    price: '48,400USh',
    origin: 'Saudi Arabia',
    image: '/images/pic6.png',
  },
  {
    name: 'Life Extension, Super K, 90 Softgels',
    rating: 5016,
    price: '87,116USh',
    origin: 'Australia',
    image: '/images/pic7.png',
  },
  {
    name: 'Garden of Life, Vitamin Code®, RAW Vitamin C™, 120 Vegan Capsules',
    rating: 8403,
    price: '115,255USh',
    origin: 'Hong Kong',
    image: '/images/pic8.png',
  },
  {
    name: 'Avalon Organics, Thickening Shampoo, Biotin B-Complex, 32 fl oz (946 ml)',
    rating: 63601,
    price: '90,478USh',
    origin: 'Israel',
    image: '/images/pic9.png',
  },
  {
    name: 'EVLution Nutrition, L-Carnitine500®, 500 mg, 120 Capsules',
    rating: 5655,
    price: '66,495USh',
    origin: 'Japan',
    image: '/images/pic10.png',
  },
  {
    name: 'Natural Factors, WellBetX®, Berberine, 120 Vegetarian Capsules (500 mg per Capsule)',
    rating: 37931,
    price: '113,087USh',
    origin: 'Korea, Republic of',
    image: '/images/pic11.png',
  },
  {
    name: 'NOW Foods, NAC, 1,000 mg, 120 Tablets',
    rating: 17535,
    price: '87,339USh',
    origin: 'Australia',
    image: '/images/pic12.png',
  },
  {
    name: 'Surya Brasil, Henna Cream, Semi-Permanent Vegan Hair Dye for Gray Coverage and Toner for Bleached Hair, Black, 2.37 fl oz (70 ml)',
    rating: 865,
    price: '95,422USh',
    origin: 'Japan',
    image: '/images/pic13.png',
  },
  {
    name: 'Optimum Nutrition, Gold Standard® 100% Whey, Vanilla Ice Cream, 5 lb (2.26 kg)',
    rating: 4728,
    price: '380,031USh',
    origin: 'Japan',
    image: '/images/pic14.png',
  },
  {
    name: 'California Gold Nutrition, CollagenUP®, Hydrolyzed Marine Collagen Peptides with Hyaluronic Acid and Vitamin C, Unflavored, 7.26 oz (206 g)',
    rating: 292612,
    price: '71,861USh',
    origin: 'Saudi Arabia',
    image: '/images/pic15.png',
  },
  {
    name: "Pura D'or, Organic Aloe Vera Gel, Infused With Lavender, 16 fl oz (473 ml)",
    rating: 1442,
    price: '56,840USh',
    origin: 'Japan',
    image: '/images/rosche.png',
  },
  {
    name: 'Life Extension, Curcumin Elite, Turmeric Extract, 60 Vegetarian Capsules',
    rating: 6062,
    price: '98,731USh',
    origin: 'Australia',
    image: '/images/pic1.png',
  },
  {
    name: 'Swanson, Full Spectrum® Turmeric, 240 Capsules (720 mg per Capsule)',
    rating: 8119,
    price: '42,857USh',
    origin: 'Singapore',
    image: '/images/one.avif',
  },
  {
    name: 'SKIN1004, Madagascar Centella Light Cleansing Oil, 6.76 fl oz (200 ml)',
    rating: 4669,
    price: '74,110USh',
    origin: 'Kuwait',
    image: '/images/bottle4.avif',
  },
];

// Helper function to calculate a 5-star rating based on a high number of reviews
const calculateStarRating = (ratingCount: number): number => {
  // A non-linear scale that rewards more stars for higher review counts.
  const maxRating = 5;
  const maxReviews = 50000; // A reference point for a "5-star" product
  return Math.min(maxRating, Math.ceil((ratingCount / maxReviews) * 5));
};

// Component to render the stars
const StarRating: FC<{ ratingCount: number }> = ({ ratingCount }) => {
  const stars = calculateStarRating(ratingCount);
  const fullStars = Math.floor(stars);
  const starIcons = [];

  for (let i = 0; i < fullStars; i++) {
    starIcons.push(<span key={i} className="text-yellow-400">★</span>);
  }

  return <div className="flex items-center">{starIcons}</div>;
};

const LiveBlogSection: FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState<boolean>(true);

  const scrollRight = (): void => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollLeft = (): void => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  // Autoscroll effect
  useEffect(() => {
    let scrollInterval: number | null = null;

    if (isScrolling) {
      scrollInterval = window.setInterval(() => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          const maxScroll = scrollWidth - clientWidth;

          if (scrollLeft >= maxScroll - 5) {
            scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
          }
        }
      }, 2000);
    }

    return () => {
      if (scrollInterval) {
        window.clearInterval(scrollInterval);
      }
    };
  }, [isScrolling]);

  const handleScrollContainer = (isHovering: boolean): void => {
    if (isHovering) {
      setIsScrolling(false);
    } else {
      setIsScrolling(true);
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-white p-6 shadow-md rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
          <span className="text-green-600 mr-2">iHerb</span>
          <span className="text-gray-800">LIVE</span>
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsScrolling(!isScrolling)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label={isScrolling ? 'Pause scrolling' : 'Resume scrolling'}
          >
            {isScrolling ? (
              <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="relative group">
        <div
          className="flex overflow-x-auto gap-4 py-4 scrollbar-hide"
          ref={scrollRef}
          onMouseEnter={() => handleScrollContainer(true)}
          onMouseLeave={() => handleScrollContainer(false)}
        >
          {liveProducts.map((product, index) => (
            <Link
              key={index}
              href={`/product/${product.name.replace(/\s+/g, '-').toLowerCase()}`}
              className="flex-shrink-0 w-64 p-4 border border-gray-200 rounded-lg transition-all duration-300"
              style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 4px 10px -2px #4caf50' }}
            >
              <div className="w-full h-48 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                <Image
                  src={product.image || '/images/placeholder.png'}
                  alt={product.name}
                  width={150}
                  height={150}
                  objectFit="contain"
                />
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-700 truncate">{product.name}</h3>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <StarRating ratingCount={product.rating} />
                  <span className="ml-1 text-gray-500">{product.rating.toLocaleString()}</span>
                </div>
                <p className="mt-2 text-base font-bold text-gray-900">{product.price}</p>
                <p className="mt-1 text-xs text-gray-500">{product.origin}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-4"
          aria-label="Previous products"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mr-4"
          aria-label="Next products"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Chrome, Safari, and Opera */
        }
      `}</style>
    </div>
  );
};

export default LiveBlogSection;