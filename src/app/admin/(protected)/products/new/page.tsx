import type { Metadata } from "next";
import { categories } from "@/lib/data";
import AdminProductForm from "@/components/admin/AdminProductForm";

export const metadata: Metadata = {
  title: "Add New Phone",
};

export default function NewProductPage() {
  return (
    <div>
      <h1 className="m-0 mb-6 text-2xl font-extrabold tracking-tight text-ink">
        Add New Phone
      </h1>
      <AdminProductForm mode="create" categories={categories} />
    </div>
  );
}
