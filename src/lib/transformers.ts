import { Product } from "@/types/product.types";
import { Product as ApiProduct, getImageUrl } from "@/lib/api/client";

export const transformProduct = (p: ApiProduct): Product => {
    const images = p.images || [];
    const primaryImage = images.find((img: any) => typeof img === 'object' && img.is_primary) || images[0];

    let imageUrl = '/images/placeholder.jpg';
    if (primaryImage) {
        if (typeof primaryImage === 'string') {
            imageUrl = getImageUrl(primaryImage);
        } else if (typeof primaryImage === 'object' && primaryImage.image_path) {
            imageUrl = getImageUrl(primaryImage.image_path);
        }
    }

    return {
        id: p.id,
        title: p.name,
        slug: p.slug,
        srcUrl: imageUrl,
        gallery: images.map((img: any) => {
            if (typeof img === 'string') return getImageUrl(img);
            return getImageUrl(img.image_path);
        }) || [imageUrl],
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
