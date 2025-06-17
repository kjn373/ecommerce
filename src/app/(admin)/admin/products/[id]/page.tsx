import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/models/product";
import "@/models/category";
import ProductForm from "@/components/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectToDatabase();
  const product = await Product.findById(id).populate("category");

  if (!product) {
    return <div>Product not found</div>;
  }

  // Convert Mongoose document to plain object and serialize ObjectIds
  const plainProduct = {
    ...product.toObject(),
    _id: product._id.toString(),
    category: product.category
      ? {
          ...product.category.toObject(),
          _id: product.category._id.toString(),
        }
      : null,
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-heading  font-bold mb-6">Edit Product</h1>
      <ProductForm product={plainProduct} />
    </div>
  );
}
