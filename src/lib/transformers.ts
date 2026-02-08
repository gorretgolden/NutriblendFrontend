import { Product } from "@/types/product.types";
import { Product as ApiProduct, getImageUrl } from "@/lib/api/client";

export const transformProduct = (p: ApiProduct): Product => {
    const primaryImage = p.images?.find(img => img.is_primary) || p.images?.[0];
    const imageUrl = primaryImage ? getImageUrl(primaryImage.image_path) : '/images/placeholder.jpg';

    return {
        id: p.id,
        title: p.name,
        slug: p.slug,
        srcUrl: imageUrl,
        gallery: p.images?.map(img => getImageUrl(img.image_path)) || [imageUrl],
        price: p.price,
        discount: {
            amount: 0,
            percentage: p.discount_percentage || 0,
        },
        rating: p.average_rating || 0, // Use API rating or default to 0
        brand: p.brand?.name,
        variations: p.variations?.map(v => ({
            id: v.id,
            name: v.name,
            price: v.price,
            stock: v.stock_quantity
        }))
    };
};
