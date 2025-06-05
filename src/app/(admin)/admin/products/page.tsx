"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Filter, X } from 'lucide-react';
import DeleteProductButton from '@/components/DeleteProductButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';

interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category?: {
    _id: string;
    name: string;
  };
  stock: number;
}

interface ICategory {
  _id: string;
  name: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter states
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [priceSort, setPriceSort] = useState<string>('none');
    const [stockFilter, setStockFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filterProducts = useCallback(() => {
        let filtered = [...products];

        // Apply category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(product => 
                product.category?._id === categoryFilter
            );
        }

        // Apply stock filter
        if (stockFilter === 'in-stock') {
            filtered = filtered.filter(product => product.stock > 0);
        } else if (stockFilter === 'out-of-stock') {
            filtered = filtered.filter(product => product.stock === 0);
        }

        // Apply search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query)
            );
        }

        // Apply price sorting
        if (priceSort !== 'none') {
            filtered.sort((a, b) => {
                if (priceSort === 'price-low-high') {
                    return a.price - b.price;
                } else {
                    return b.price - a.price;
                }
            });
        }

        setFilteredProducts(filtered);
    }, [products, categoryFilter, stockFilter, searchQuery, priceSort]);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [filterProducts]);

    const fetchProducts = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                fetch('/api/products'),
                fetch('/api/categories')
            ]);

            if (!productsRes.ok || !categoriesRes.ok) {
                throw new Error('Failed to fetch data');
            }

            const [productsData, categoriesData] = await Promise.all([
                productsRes.json(),
                categoriesRes.json()
            ]);

            setProducts(productsData);
            setFilteredProducts(productsData);
            setCategories(categoriesData);
        } catch (err) {
            setError('Failed to load products');
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (categoryFilter !== 'all') count++;
        if (priceSort !== 'none') count++;
        if (stockFilter !== 'all') count++;
        if (searchQuery) count++;
        return count;
    };

    const clearFilters = () => {
        setCategoryFilter('all');
        setPriceSort('none');
        setStockFilter('all');
        setSearchQuery('');
    };

    if (loading) return <div className="p-4">Loading...</div>;

    if (error) return (
        <div className="p-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        </div>
    );

    return (
        <div className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h1 className="text-2xl font-bold font-heading">Products</h1>
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="relative">
                                <Filter className="h-4 w-4 mr-2" />
                                Filters
                                {getActiveFiltersCount() > 0 && (
                                    <Badge 
                                        variant="secondary" 
                                        className="ml-2 rounded-full h-5 w-5 flex items-center justify-center p-0"
                                    >
                                        {getActiveFiltersCount()}
                                    </Badge>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium font-heading">Filters</h4>
                                    {getActiveFiltersCount() > 0 && (
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={clearFilters}
                                            className="h-8 px-2"
                                        >
                                            <X className="h-4 w-4 mr-1" />
                                            Clear
                                        </Button>
                                    )}
                                </div>
                                
                                <div className="space-y-4">
                                    <div>
                                        <Label className='mb-1' htmlFor="search">Search</Label>
                                        <Input
                                            id="search"
                                            placeholder="Search products..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label className='mb-1'htmlFor="category-filter">Category</Label>
                                        <Select
                                            value={categoryFilter}
                                            onValueChange={setCategoryFilter}
                                        >
                                            <SelectTrigger id="category-filter">
                                                <SelectValue placeholder="Filter by category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Categories</SelectItem>
                                                {categories.map((category) => (
                                                    <SelectItem key={category._id} value={category._id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label className='mb-1' htmlFor="price-sort">Sort by Price</Label>
                                        <Select
                                            value={priceSort}
                                            onValueChange={setPriceSort}
                                        >
                                            <SelectTrigger id="price-sort">
                                                <SelectValue placeholder="Sort by price" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">No Sort</SelectItem>
                                                <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                                                <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label className='mb-1' htmlFor="stock-filter">Stock Status</Label>
                                        <Select
                                            value={stockFilter}
                                            onValueChange={setStockFilter}
                                        >
                                            <SelectTrigger id="stock-filter">
                                                <SelectValue placeholder="Filter by stock" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Stock</SelectItem>
                                                <SelectItem value="in-stock">In Stock</SelectItem>
                                                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    <Link href="/admin/products/new">
                        <Button className="w-full sm:w-auto">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="overflow-x-auto">
                <div className="bg-card rounded-lg shadow overflow-hidden min-w-full">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-subcard">
                            <tr>
                                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Stock
                                </th>
                                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-gray-200">
                            {filteredProducts.map((product) => (
                                <tr key={product._id}>
                                    <td className="px-4 sm:px-6 py-4">
                                        <div className="flex items-center">
                                            {product.images[0] && (
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="h-10 w-10 rounded-full object-cover mr-3"
                                                    width={40}
                                                    height={40}
                                                />
                                            )}
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {product.name}
                                                </div>
                                                <div className="text-xs sm:text-sm text-gray-500">
                                                    {product.description.substring(0, 50)}...
                                                </div>
                                                <div className="sm:hidden text-xs text-gray-500 mt-1">
                                                    ${product.price} | {product.stock} in stock
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="hidden sm:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {product.category?.name || 'Uncategorized'}
                                    </td>
                                    <td className="hidden md:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ${product.price}
                                    </td>
                                    <td className="hidden lg:table-cell px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {product.stock}
                                    </td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <Link href={`/admin/products/${product._id}`}>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <DeleteProductButton productId={product._id} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center text-gray-500 mt-6">
                    No products found
                </div>
            )}
        </div>
    );
}
