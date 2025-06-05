'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useEffect, useState, Suspense } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

interface ProductType {
  _id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  category: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [sortBy, setSortBy] = useState('latest');
  const addItem = useCartStore(state => state.addItem);

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
      const response = await fetch('/api/products');
      const data = await response.json() as ProductType[];
      setProducts(data);
      setFilteredProducts(data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(product => product.category.name))] as string[];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    let filtered = [...products];

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category.name.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-high-low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'price-low-high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'latest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, sortBy, products]);

  const handleAddToCart = (e: React.MouseEvent, product: ProductType) => {
    e.preventDefault();
    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1
    });
    toast.success('Added to cart!');
  };

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-10 font-heading">Our Products</h1>
        
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
          {filteredProducts.map(product => (
            <Link 
              href={`/products/${product._id}`} 
              key={product._id}
              className="block hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="bg-card rounded-lg shadow p-6 flex flex-col items-center h-full">
                <div className="relative w-full aspect-square mb-4">
                  <Image 
                    src={product.images[0]} 
                    alt={product.name} 
                    fill
                    className="rounded object-cover"
                  />
                </div>
                <h2 className="text-xl font-heading  font-semibold mb-2 line-clamp-1 w-full text-center">{product.name}</h2>
                <p className="text-gray-600 mb-2 font-body  text-center line-clamp-2 h-12">{product.description}</p>
                <span className="text-lg font-body  font-bold mb-4">${product.price}</span>
                <Button 
                  className="px-6 py-2 w-full" 
                  variant="default"
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  Add to Cart
                </Button>
              </div>
            </Link>
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
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
} 