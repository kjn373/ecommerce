'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { toast } from 'sonner';
import Link from 'next/link';

interface Product {
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
  stock: number;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query || '')}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error searching products:', error);
      toast.error('Failed to search products');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (query) {
      fetchProducts();
    }
  }, [query, fetchProducts]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    
    if (product.stock <= 0) {
      toast.error('This product is out of stock');
      return;
    }
    
    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1
    });
    toast.success('Added to cart!');
  };

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
          <p className="text-gray-600">No products found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
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
                  disabled={product.stock <= 0}
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  );
} 