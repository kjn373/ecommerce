"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, User, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export default function Navbar() {
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <nav className="fixed font-heading top-0 left-0 w-full z-50 flex justify-between items-center text-xl font-semibold p-5 bg-primary text-primary-foreground">
      <div>
        <h1 className="text-2xl font-bold font-heading">
          <Link href="/">VYV</Link>
        </h1>
      </div>

      {/* Desktop Navigation*/}
      <div className="hidden md:flex gap-3">
        <div>
          <Link href="/">Home</Link>
        </div>
        <div>
          <Link href="/products">Shop</Link>
        </div>
        <div>
          <Link href="/about">About</Link>
        </div>
        <div>
          <Link href="/contact">Contact</Link>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-3">
        <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <SheetTrigger asChild>
            <button className="p-2 hover:bg-accent rounded-full">
              <Search className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="top" className="pt-20 bg-none">
            <SheetHeader>
              <SheetTitle></SheetTitle>
            </SheetHeader>
            <form onSubmit={handleSearch} className="mt-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-lg"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </form>
          </SheetContent>
        </Sheet>
        <div>
          <Link href="/account">
            <User className="h-6 w-6" />
          </Link>
        </div>
        <div className="relative">
          <Link href="/cart">
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary/90 text-white text-sm rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger className="p-2">
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle className="font-heading text-2xl">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex pt-2 p-4 flex-col gap-4">
              <div>
                <Link href="/">Home</Link>
              </div>
              <div>
                <Link href="/products">Shop</Link>
              </div>
              <div>
                <Link href="/about">About</Link>
              </div>
              <div>
                <Link href="/contact">Contact</Link>
              </div>
              <hr className="my-2" />
              <div>
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                    <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  </div>
                </form>
              </div>
              <div>
                <Link href="/account">
                  <User className="h-5 w-5 inline mr-2" />
                  Account
                </Link>
              </div>
              <div className="relative">
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5 inline mr-2" />
                  Cart
                  {totalItems > 0 && (
                    <span className="ml-0.5">({totalItems})</span>
                  )}
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
