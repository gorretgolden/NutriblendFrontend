"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const query = params.toString();
    router.replace(`/shop${query ? `?${query}` : ""}`);
  }, [router, searchParams]);

  return null;
}
