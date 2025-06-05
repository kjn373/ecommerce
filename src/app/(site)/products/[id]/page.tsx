'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { toast } from 'sonner';
import { ShoppingCart, Heart, Share2 } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: {
    _id: string;
    name: string;
  };
  stock: number;
}

export default function ProductPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const fetchProduct = useCallback(async () => {
    try {
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = () => {
    if (!product) return;
    
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
    toast.success('Added to cart');
  };

  const handleWishlistToggle = async () => {
    if (!session) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    if (!product) return;

    try {
      if (isInWishlist(product._id)) {
        // Remove from wishlist
        await fetch('/api/wishlist', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId: product._id }),
        });
        removeFromWishlist(product._id);
        toast.success('Removed from wishlist');
      } else {
        // Add to wishlist
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId: product._id }),
        });
        addToWishlist({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.images[0],
        });
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-destructive">Product not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-card">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover transition-transform hover:scale-105"
              priority
            />
          </div>
          
          {/* Thumbnail Gallery */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-primary' 
                      : 'border-transparent hover:border-muted'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 font-heading">{product.name}</h1>
            <p className="text-muted-foreground font-body ">Category: {product.category.name}</p>
          </div>
          
          <div className="space-y-4">
            <p className="text-2xl font-bold text-primary font-heading">${product.price.toFixed(2)}</p>
            <p className="text-muted-foreground font-body  leading-relaxed">{product.description}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={handleAddToCart}
              className="flex-1 font-body sm:flex-none gap-2"
              size="lg"
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="h-5 w-5" />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            
            <Button
              variant="outline"
              className="flex-1 sm:flex-none gap-2 font-body "
              size="lg"
              onClick={handleWishlistToggle}
            >
              <Heart className={`h-5 w-5 ${isInWishlist(product._id) ? 'fill-primary text-primary' : ''}`} />
              {isInWishlist(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </Button>
            
            <Button
              variant="ghost"
              className="flex-1 sm:flex-none font-body  gap-2"
              size="lg"
            >
              <Share2 className="h-5 w-5" />
              Share
            </Button>
          </div>
          
          {/* Additional Info */}
          <div className="border-t border-border pt-6 mt-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium font-heading  text-foreground">Availability</p>
                {product.stock > 0 ? (
                  <p className="text-muted-foreground font-body">In Stock</p>
                ) : (
                  <p className="text-destructive font-body">Out of Stock</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 