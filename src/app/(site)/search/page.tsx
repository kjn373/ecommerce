"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard, { Product } from "@/components/ProductCard";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query || "")}`,
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (query) {
      fetchProducts();
    }
  }, [query, fetchProducts]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 font-heading">
        Search Results for &quot;{query}&quot;
      </h1>

      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            No products found matching your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product}/>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          Loading search results...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
