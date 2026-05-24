import ProductDetailClient from "./ProductDetailClient";

export function generateStaticParams() {
  // Return at least one entry so that Next.js static export (`output: 'export'`)
  // sees prerenderRoutes.length > 0 and does not throw.
  // The actual product is resolved client-side via the slug segments.
  return [{ slug: ["0"] }];
}

// Allow any slug that was NOT returned by generateStaticParams to be
// resolved at request time (client-side in our case).
export const dynamicParams = true;

export default async function ProductPage({
  params,
}: {
  params: { slug: string[] } | Promise<{ slug: string[] }>;
}) {
  const resolvedParams = await Promise.resolve(params);
  const productId = resolvedParams.slug ? Number(resolvedParams.slug[0]) : 0;

  return <ProductDetailClient initialProductId={productId} />;
}
