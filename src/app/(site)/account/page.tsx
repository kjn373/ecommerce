"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useWishlistStore } from "@/store/wishlistStore";
import { Heart, Package, Truck, CheckCircle, XCircle } from "lucide-react";

interface OrderProduct {
  productId: {
    _id: string;
    name: string;
    images: string[];
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  userId: string;
  products: OrderProduct[];
  total: number;
  shippingCost: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export default function AccountPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { items: wishlistItems, removeItem: removeFromWishlist } =
    useWishlistStore();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (status === "loading" || (!session?.user?.id && !session?.user?.email)) return;

      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/user/orders", {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch orders");
        }

        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch orders",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [session, status]);

  const getStatusColor = (status: Order["status"]) => {
    const colors = {
      pending: "bg-muted text-foreground",
      processing: "bg-primary/20 text-primary",
      shipped: "bg-secondary/20 text-secondary",
      delivered: "bg-accent/20 text-accent",
      cancelled: "bg-destructive/20 text-destructive",
    };
    return colors[status];
  };

  const getStatusIcon = (status: Order["status"]) => {
    const icons = {
      pending: Package,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle,
    };
    const Icon = icons[status];
    return <Icon className="h-4 w-4" />;
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col min-[250px]:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-heading font-bold">My Account</h1>
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          variant="destructive"
          size="sm"
          className="mt-1"
        >
          Logout
        </Button>
      </div>

      {/* Profile Information */}
      <div className="bg-card shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-heading  font-semibold mb-4">
          Profile Information
        </h2>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Username:</span>{" "}
            {session.user.username}
          </p>
          <p>
            <span className="font-medium">Email:</span> {session.user.email}
          </p>
        </div>
      </div>

      {/* Wishlist */}
      <div className="bg-card shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-heading  font-semibold mb-4">
          My Wishlist
        </h2>
        {wishlistItems.length === 0 ? (
          <p className="text-muted-foreground">Your wishlist is empty</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {wishlistItems.map((item) => (
              <div key={item._id} className="flex gap-4 p-4 border rounded-lg">
                <div className="relative w-20 h-20">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-primary font-medium">
                    ${item.price.toFixed(2)}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromWishlist(item._id)}
                    >
                      <Heart className="h-4 w-4 fill-primary text-primary mr-2" />
                      Remove
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={`/products/${item._id}`}>View Product</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order History */}
      <div className="bg-card shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-heading  font-semibold mb-4">
          Order History
        </h2>
        {error ? (
          <div className="text-destructive">{error}</div>
        ) : orders.length === 0 ? (
          <p className="text-muted-foreground">No orders found</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Order #{order._id.slice(-6)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.createdAt), "PPp")}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </Badge>
                </div>

                <div className="space-y-2">
                  {order.products.map((product) => (
                    <div key={product.productId._id} className="flex gap-4">
                      <div className="relative w-16 h-16">
                        <Image
                          src={product.productId.images[0]}
                          alt={product.productId.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">
                          {product.productId.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {product.quantity}
                        </p>
                        <p className="text-sm text-primary">
                          ${(product.price * product.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span>${order.shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium mt-2">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
