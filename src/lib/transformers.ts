import { Product } from "@/types/product.types";
import { Product as ApiProduct, getImageUrl } from "@/lib/api/client";

export const transformProduct = (p: ApiProduct): Product => {
    // Merge images from both sources:
    // 1. p.images - JSON array of storage paths (strings) stored on the product model
    // 2. p.product_images - Related ProductImage records with image_url field
    let allImages: string[] = [];

    // Process the images JSON field (array of storage path strings)
    if (p.images && Array.isArray(p.images)) {
        for (const img of p.images) {
            if (typeof img === 'string' && img.length > 0) {
                allImages.push(getImageUrl(img));
            } else if (typeof img === 'object' && img !== null) {
                // Legacy object format with image_path
                if (img.image_path) allImages.push(getImageUrl(img.image_path));
                else if (img.image_url) allImages.push(getImageUrl(img.image_url));
            }
        }
    }

    // Process the product_images relation (ProductImage records)
    const productImages = (p as any).product_images;
    if (productImages && Array.isArray(productImages)) {
        for (const img of productImages) {
            if (typeof img === 'object' && img !== null) {
                const url = img.image_url || img.image_path;
                if (url) {
                    const resolved = getImageUrl(url);
                    // Avoid duplicates
                    if (!allImages.includes(resolved)) {
                        allImages.push(resolved);
                    }
                }
            }
        }
    }

    // Fallback placeholder if no images at all
    const imageUrl = allImages.length > 0 ? allImages[0] : '/images/placeholder.jpg';

    return {
        id: p.id,
        title: p.name,
        slug: p.slug,
        srcUrl: imageUrl,
        gallery: allImages.length > 0 ? allImages : [imageUrl],
        price: p.price,
        discount: {
            amount: 0,
            percentage: p.discount_percentage || 0,
        },
        rating: p.average_rating || 0,
        brand: p.brand?.name,
        variations: p.variations?.map(v => ({
            id: v.id,
            name: v.name,
            price: v.price,
            stock: v.stock_quantity
        }))
    };
};
