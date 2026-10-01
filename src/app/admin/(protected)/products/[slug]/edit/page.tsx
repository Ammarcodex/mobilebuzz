import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories } from "@/lib/data";
import { getProductBySlug } from "@/lib/products";
import AdminProductForm from "@/components/admin/AdminProductForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product ? `Edit ${product.name}` : "Edit Phone" };
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div>
      <h1 className="m-0 mb-6 text-2xl font-extrabold tracking-tight text-ink">
        Edit {product.name}
      </h1>
      <AdminProductForm
        mode="edit"
        categories={categories}
        initialProduct={product}
      />
    </div>
  );
}
