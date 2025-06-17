"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IProduct } from "@/models/product";
import { ICategory } from "@/models/category";
import axios from "axios";
import { Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useFormik, FieldArray, FormikProvider } from "formik";
import * as Yup from "yup";

interface ProductFormProps {
  product?: IProduct;
}

// Validation schema using Yup
const ProductSchema = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number()
    .required("Price is required")
    .min(0, "Price must be at least 0")
    .typeError("Price must be a number"),
  stock: Yup.number()
    .required("Stock is required")
    .min(0, "Stock must be at least 0")
    .integer("Stock must be a whole number")
    .typeError("Stock must be a number"),
  category: Yup.string().required("Category is required"),
  images: Yup.array().of(Yup.string()),
});

export default function ProductForm({ product }: ProductFormProps) {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      stock: product?.stock || 0,
      category: product?.category?._id?.toString() || "",
      images: product?.images?.length ? product.images : [""],
    },
    validationSchema: ProductSchema,
    onSubmit: async (values) => {
      setError("");

      try {
        const productData = {
          ...values,
          images: values.images.filter((img: string) => img.trim() !== ""),
        };

        if (product?._id) {
          await axios.put(`/api/products/${product._id}`, productData);
          router.push("/admin/products");
        } else {
          await axios.post("/api/products", productData);
          formik.resetForm();
        }

        router.refresh();
      } catch (err) {
        setError("Failed to save product");
        console.error(err);
      }
    },
  });

  return (
    <FormikProvider value={formik}>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.name}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 border rounded"
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.description}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <Input
              type="number"
              id="price"
              name="price"
              value={formik.values.price || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              min="0"
              step="0.1"
            />
            {formik.touched.price && formik.errors.price && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.price}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <Input
              type="number"
              id="stock"
              name="stock"
              value={formik.values.stock || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              min="0"
              step="1"
            />
            {formik.touched.stock && formik.errors.stock && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.stock}
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Select
            value={formik.values.category}
            onValueChange={(value) => formik.setFieldValue("category", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem
                  key={category._id.toString()}
                  value={category._id.toString()}
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formik.touched.category && formik.errors.category && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.category}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Images</label>
          <FieldArray
            name="images"
            render={(arrayHelpers) => (
              <div>
                {formik.values.images && formik.values.images.length > 0
                  ? formik.values.images.map((image, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          name={`images.${index}`}
                          value={image}
                          onChange={formik.handleChange}
                          placeholder="Image URL"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => arrayHelpers.remove(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  : null}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => arrayHelpers.push("")}
                  className="mt-2"
                >
                  Add Image
                </Button>
              </div>
            )}
          />
        </div>

        <Button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting
            ? "Saving..."
            : product?._id
              ? "Update Product"
              : "Add Product"}
        </Button>
      </form>
    </FormikProvider>
  );
}
