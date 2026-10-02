"use client";

import { deleteProductAction } from "@/app/admin/actions";

export default function DeleteProductButton({
  slug,
  name,
}: {
  slug: string;
  name: string;
}) {
  return (
    <form
      action={deleteProductAction}
      onSubmit={(e) => {
        if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        className="icon-btn flex h-9 items-center justify-center rounded-full subtle-surface px-4 text-xs font-bold text-accent-orange"
      >
        Delete
      </button>
    </form>
  );
}
