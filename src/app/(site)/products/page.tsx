"use client";

import { useEffect, useState, Suspense } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
import ProductCard, { Product } from "@/components/ProductCard";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(
    categoryParam || "all",
  );
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = (await response.json()) as Product[];
      setProducts(data);
      setFilteredProducts(data);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(data.map((product) => product.category?.name || "")),
      ].filter(Boolean) as string[];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    let filtered = [...products];

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.category?.name.toLowerCase() ===
          selectedCategory.toLowerCase(),
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "price-high-low":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "price-low-high":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "latest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime(),
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt || "").getTime() - new Date(b.createdAt || "").getTime(),
        );
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, sortBy, products]);

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-10 font-heading">
          Our Products
        </h1>

        {/* Filters */}
        <div className="flex gap-4 mb-8 justify-center">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category.toLowerCase()}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="price-high-low">Price: High to Low</SelectItem>
              <SelectItem value="price-low-high">Price: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center font-body  text-gray-500 mt-8">
            No products found in this category
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          Loading products...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
