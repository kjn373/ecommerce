import ProductForm from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-heading  font-bold mb-6">Add New Product</h1>
      <ProductForm />
    </div>
  );
}
