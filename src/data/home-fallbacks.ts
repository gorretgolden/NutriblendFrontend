import { Product } from "@/types/product.types";

export const newArrivalsFallback: Product[] = [
    {
        id: 1,
        title: "Weight Adder",
        srcUrl: "/images/bottle1.avif",
        gallery: ["/images/bottle1.avif", "/images/bottle10.avif", "/images/bottle11.avif"],
        price: 120,
        discount: { amount: 0, percentage: 0 },
        rating: 4.5,
    },
    {
        id: 2,
        title: "Fish Oil, Omega-3",
        srcUrl: "/images/bottle2.avif",
        gallery: ["/images/bottle2.avif"],
        price: 260,
        discount: { amount: 0, percentage: 20 },
        rating: 3.5,
    },
    {
        id: 3,
        title: "Go glow, Shine",
        srcUrl: "/images/bottle3.avif",
        gallery: ["/images/bottle3.avif"],
        price: 180,
        discount: { amount: 0, percentage: 0 },
        rating: 4.5,
    },
    {
        id: 4,
        title: "MCT-Oil, Body SLimmer",
        srcUrl: "/images/bottle4.avif",
        gallery: ["/images/bottle4.avif", "/images/bottle10.avif", "/images/bottle11.avif"],
        price: 160,
        discount: { amount: 0, percentage: 30 },
        rating: 4.5,
    }
];

export const topSellingFallback: Product[] = [
    {
        id: 5,
        title: "Anglican, Tube Bottle",
        srcUrl: "/images/bottle5.avif",
        gallery: ["/images/bottle5.avif", "/images/bottle10.avif", "/images/bottle11.avif"],
        price: 232,
        discount: { amount: 0, percentage: 20 },
        rating: 5.0,
    },
    {
        id: 6,
        title: "ColleganUp, Deep Clean",
        srcUrl: "/images/bottle6.avif",
        gallery: ["/images/bottle6.avif", "/images/bottle10.avif", "/images/bottle11.avif"],
        price: 145,
        discount: { amount: 0, percentage: 0 },
        rating: 4.0,
    },
    {
        id: 7,
        title: "Feminine, Deep clean",
        srcUrl: "/images/bottle7.avif",
        gallery: ["/images/bottle7.avif"],
        price: 80,
        discount: { amount: 0, percentage: 0 },
        rating: 3.0,
    }
];

export const specialOffersFallback: Product[] = [
    {
        id: 20,
        title: "DHA 700 Fish Oil, Ultra-Concentrated",
        srcUrl: "/images/bottle1.avif",
        gallery: ["/images/bottle1.avif"],
        price: 29093,
        discount: { amount: 0, percentage: 29 },
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
        discount: { amount: 0, percentage: 0 },
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
        discount: { amount: 0, percentage: 0 },
        rating: 5,
        reviews: 120548,
        brand: "California Gold Nutrition"
    }
];
