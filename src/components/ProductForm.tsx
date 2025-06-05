"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { IProduct } from '@/models/product';
import { ICategory } from '@/models/category';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

interface ProductFormProps {
    product?: IProduct;
}

export default function ProductForm({ product }: ProductFormProps) {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [formData, setFormData] = useState({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || 0,
        stock: product?.stock || 0,
        category: product?.category?._id?.toString() || '',
        images: product?.images || [''],
    });
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                images: product.images || [''],
                category: product.category?._id?.toString() || '',
            });
        }
    }, [product]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const productData = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
                images: formData.images.filter(img => img.trim() !== '')
            };

            if (product?._id) {
                await axios.put(`/api/products/${product._id}`, productData);
                router.push('/admin/products');
            } else {
                await axios.post('/api/products', productData);
                setFormData({
                    name: '',
                    description: '',
                    price: 0,
                    stock: 0,
                    category: '',
                    images: [''],
                });
            }

            router.refresh();
        } catch (err) {
            setError('Failed to save product');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData(prev => ({ ...prev, images: newImages }));
    };

    const addImageField = () => {
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, '']
        }));
    };

    const removeImageField = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                    value={formData.description}
                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-2 border rounded"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <Input
                        type="number"
                        value={formData.price}
                        onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                        required
                        min="0"
                        step="0.01"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Stock</label>
                    <Input
                        type="number"
                        value={formData.stock}
                        onChange={e => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                        required
                        min="0"
                        step="1"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                    value={formData.category}
                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border rounded"
                    required
                >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                        <option key={category._id.toString()} value={category._id.toString()}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Images</label>
                {formData.images.map((image, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                        <Input
                            value={image}
                            onChange={e => handleImageChange(index, e.target.value)}
                            placeholder="Image URL"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => removeImageField(index)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    onClick={addImageField}
                    className="mt-2"
                >
                    Add Image
                </Button>
            </div>

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : product?._id ? 'Update Product' : 'Add Product'}
            </Button>
        </form>
    );
} 