'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

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

const categories = [
  {
    name: 'Watches',
    image: 'https://images.unsplash.com/photo-1506796684999-9fa2770af9c3?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    slug: 'watches'
  },
  {
    name: 'Bracelets',
    image: 'https://images.unsplash.com/photo-1619119069152-a2b331eb392a?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    slug: 'bracelets'
  },
  {
    name: 'Rings',
    image: 'https://images.unsplash.com/photo-1550368566-f9cc32d7392d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    slug: 'rings'
  }
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products?sort=-createdAt&limit=3');
      const products = await response.json();
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <Image
          src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Hero"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="relative text-center text-white">
          <h1 className="font-heading text-5xl font-bold mb-4">Discover Timeless Elegance</h1>
          <p className="font-body text-xl mb-8">Explore our collection of exquisite jewelry and watches</p>
          <Link href="/products">
            <Button size="lg" className="font-body text-lg px-8">Shop Now</Button>
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link 
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="group relative h-80 rounded-lg overflow-hidden"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover brightness-50 "
                    priority
                  />
                </div>
                <div className=" text-center text-white">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-body font-semibold text-white">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-background">
        <h2 className="text-3xl font-heading font-bold text-center mb-8">Latest Products</h2>
        <div className="bg-card grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {featuredProducts.map((product) => (
            <Link 
              key={product._id}
              href={`/products/${product._id}`}
              className="block hover:scale-[1.02] transition-transform duration-200"
            >
              <div className=" rounded-lg shadow p-6 flex flex-col items-center h-full">
                <div className="relative w-full aspect-square mb-4">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2 text-center">{product.name}</h3>
                <p className="text-gray-600 font-body mb-2 text-center line-clamp-2">{product.description}</p>
                <span className="text-lg font-body font-bold mb-4">${product.price}</span>
                <Button 
                  className="px-6 py-2 w-full font-body" 
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
      </section>
    </div>
  );
}
