export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";

interface ProductsPageProps {
  searchParams: {
    category?: string;
    brand?: string;
    search?: string;
    [key: string]: string | undefined;
  };
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = new URLSearchParams();

  if (searchParams.category) params.set("category", searchParams.category);
  if (searchParams.brand) params.set("search", searchParams.brand);
  if (searchParams.search) params.set("search", searchParams.search);

  const query = params.toString();
  redirect(`/shop${query ? `?${query}` : ""}`);
}
