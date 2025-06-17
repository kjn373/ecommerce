import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ShinyText from "@/blocks/TextAnimations/ShinyText/ShinyText";
import { toast } from "sonner";
import { useCartStore } from "@/store/cartStore";

export interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
  stock: number;
  category?: {
    _id: string;
    name: string;
  };
  createdAt?: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();

    if (product.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
    });
    toast.success("Added to cart!");
  };

  return (
    <Link
      href={`/products/${product._id}`}
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
        <h2 className="text-xl font-heading font-semibold mb-2 line-clamp-1 w-full text-center">
          {product.name}
        </h2>
        <p className="text-gray-600 mb-2 font-body text-center line-clamp-2 h-12">
          {product.description}
        </p>
        <span className="text-lg font-body font-bold mb-4">
          ${product.price}
        </span>
        <Button
          className="px-6 py-2 w-full"
          variant="default"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          {product.stock > 0 ? (
              <ShinyText
                text="Add to Cart"
                disabled={false}
                speed={3}
                className="animate-shine"
              />
            )
           : (
            "Out of Stock"
          )}
        </Button>
      </div>
    </Link>
  );
}
