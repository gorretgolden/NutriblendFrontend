import { Product } from "@/types/product.types";
import { Product as ApiProduct, getImageUrl } from "@/lib/api/client";

export const transformProduct = (p: ApiProduct): Product => {
    // Merge images from both sources:
    // 1. p.images - JSON array of storage paths (strings) stored on the product model
    // 2. p.product_images - Related ProductImage records with image_url field
    let allImages: string[] = [];

    // 0. p.image - Direct image field from model (Seeder stores here)
    if ((p as any).image) {
        allImages.push(getImageUrl((p as any).image));
    }

    // 1. main_image & gallery_images (Preferred from ProductResource)
    if ((p as any).main_image) {
        allImages.push(getImageUrl((p as any).main_image));
    }

    if ((p as any).gallery_images && Array.isArray((p as any).gallery_images)) {
        for (const img of (p as any).gallery_images) {
            if (img && !allImages.includes(getImageUrl(img))) {
                allImages.push(getImageUrl(img));
            }
        }
    }

    // 2. p.images - JSON array fallback
    if (p.images && Array.isArray(p.images)) {
        for (const img of p.images) {
            let url = "";
            if (typeof img === 'string' && img.length > 0) {
                url = getImageUrl(img);
            } else if (typeof img === 'object' && img !== null) {
                if ((img as any).image_path) url = getImageUrl((img as any).image_path);
                else if ((img as any).image_url) url = getImageUrl((img as any).image_url);
            }
            if (url && !allImages.includes(url)) {
                allImages.push(url);
            }
        }
    }

    // 3. p.product_images - Related ProductImage fallback
    const productImages = (p as any).product_images;
    if (productImages && Array.isArray(productImages)) {
        for (const img of productImages) {
            if (typeof img === 'object' && img !== null) {
                const url = img.image_url || img.image_path;
                if (url) {
                    const resolved = getImageUrl(url);
                    if (!allImages.includes(resolved)) {
                        allImages.push(resolved);
                    }
                }
            }
        }
    }

    // Fallback placeholder
    const imageUrl = allImages.length > 0 ? allImages[0] : '/images/placeholder.jpg';

    return {
        id: p.id,
        title: p.name,
        slug: p.slug,
        sku: p.sku,
        srcUrl: imageUrl,
        gallery: allImages.length > 0 ? allImages : [imageUrl],
        price: p.price,
        unit: p.unit,
        unit_name: (p as any).unit_name,
        wholesale_price: p.wholesale_price,
        wholesale_min_qty: p.wholesale_min_qty,
        wholesale_unit_name: (p as any).wholesale_unit_name,
        wholesale_stock_quantity: (p as any).wholesale_stock_quantity,
        discount: {
            amount: p.discount_amount || 0,
            percentage: p.discount_percentage || 0,
        },
        rating: p.average_rating || 0,
        reviews: p.review_count || 0,
        brand: p.brand?.name,
        category: p.category?.name,
        description: p.description || '',
        shortDescription: p.short_description || '',
        keyFeatures: p.key_features ? p.key_features.map((f: any) => typeof f === 'string' ? f : f.feature) : [],
        whatsInBox: p.whats_in_box || '',
        stock: p.stock_quantity || 0,
        weight: typeof p.weight === 'string' ? parseFloat(p.weight) : p.weight,
        weight_unit: (p as any).weight_unit,
        inStock: p.in_stock,
        variations: p.variations?.map(v => ({
            id: v.id,
            name: v.name,
            price: v.price,
            stock: v.stock_quantity
        }))
    };
};
