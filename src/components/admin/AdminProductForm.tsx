"use client";

import { useActionState, useMemo, useState } from "react";
import Image from "next/image";
import type { Category, Product, ProductColor, Spec, StorageOption } from "@/lib/types";
import { createProductAction, updateProductAction } from "@/app/admin/actions";
import ColorNameInput from "./ColorNameInput";
import { parseSpecText } from "@/lib/specParser";

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function AdminProductForm({
  mode,
  categories,
  initialProduct,
}: {
  mode: "create" | "edit";
  categories: Category[];
  initialProduct?: Product;
}) {
  const action = mode === "create" ? createProductAction : updateProductAction;
  const [state, formAction, pending] = useActionState(action, undefined);

  const [categorySlug, setCategorySlug] = useState(
    initialProduct?.category ?? ""
  );
  const [specs, setSpecs] = useState<Spec[]>(initialProduct?.specs ?? []);
  const [pasteText, setPasteText] = useState("");
  const [pasteResultCount, setPasteResultCount] = useState<number | null>(
    null
  );
  const [colors, setColors] = useState<ProductColor[]>(
    initialProduct?.colors ?? []
  );
  const [storageOptions, setStorageOptions] = useState<StorageOption[]>(
    initialProduct?.storageOptions ?? []
  );
  const existingImages =
    initialProduct?.images && initialProduct.images.length > 0
      ? initialProduct.images
      : initialProduct?.image
        ? [initialProduct.image]
        : [];

  const selectedCategory = useMemo(
    () => categories.find((c) => c.slug === categorySlug),
    [categories, categorySlug]
  );
  const categoryName = selectedCategory?.name ?? "";
  const brandSuggestions = selectedCategory?.brands ?? [];

  function handleParseSpecs() {
    const parsed = parseSpecText(pasteText);
    setSpecs((prev) => {
      const next = [...prev];
      const indexByLabel = new Map(
        next.map((s, idx) => [s.label.toLowerCase(), idx])
      );
      for (const spec of parsed) {
        const existingIndex = indexByLabel.get(spec.label.toLowerCase());
        if (existingIndex !== undefined) {
          next[existingIndex] = spec;
        } else {
          next.push(spec);
          indexByLabel.set(spec.label.toLowerCase(), next.length - 1);
        }
      }
      return next;
    });
    setPasteResultCount(parsed.length);
    setPasteText("");
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {mode === "edit" && initialProduct ? (
        <input type="hidden" name="originalSlug" value={initialProduct.slug} />
      ) : null}
      <input type="hidden" name="categoryName" value={categoryName} />
      <input type="hidden" name="specsJson" value={JSON.stringify(specs)} />
      <input type="hidden" name="colorsJson" value={JSON.stringify(colors)} />
      <input
        type="hidden"
        name="storageOptionsJson"
        value={JSON.stringify(storageOptions)}
      />

      <div className="glass flex flex-col gap-4 rounded-3xl p-6 sm:p-8">
        <h2 className="m-0 text-lg font-bold text-ink">Basic Details</h2>

        <FormField label="Phone Name">
          <input
            name="name"
            type="text"
            required
            defaultValue={initialProduct?.name}
            placeholder="e.g. Samsung Galaxy S25 Ultra"
            className="input"
          />
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Category">
            <select
              name="category"
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="input"
            >
              <option value="">Select category…</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Brand">
            <input
              name="brand"
              type="text"
              list="brand-suggestions"
              defaultValue={initialProduct?.brandName ?? ""}
              placeholder="e.g. Samsung"
              className="input"
            />
            <datalist id="brand-suggestions">
              {brandSuggestions.map((b) => (
                <option key={b.slug} value={b.name} />
              ))}
            </datalist>
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField label="Price (PKR)">
            <input
              name="price"
              type="number"
              min={0}
              step={1}
              defaultValue={initialProduct?.price ?? ""}
              placeholder="0 for Contact for Price"
              className="input"
            />
          </FormField>
          <FormField label="RAM">
            <input
              name="ram"
              type="text"
              defaultValue={initialProduct?.ram ?? ""}
              placeholder="e.g. 8GB"
              className="input"
            />
          </FormField>
          <FormField label="Storage (ROM)">
            <input
              name="rom"
              type="text"
              defaultValue={initialProduct?.rom ?? ""}
              placeholder="e.g. 128GB"
              className="input"
            />
          </FormField>
        </div>
      </div>

      <div className="glass flex flex-col gap-4 rounded-3xl p-6 sm:p-8">
        <h2 className="m-0 text-lg font-bold text-ink">Homepage Placement</h2>
        <p className="m-0 text-xs text-muted">
          Controls what shows on the homepage. Only one product can be the
          hero banner — checking it here unchecks it everywhere else.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              name="isHero"
              defaultChecked={initialProduct?.isHero ?? false}
            />
            Feature as Homepage Hero
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              name="isHotDeal"
              defaultChecked={initialProduct?.isHotDeal ?? false}
            />
            Hot Deal
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={initialProduct?.isFeatured ?? false}
            />
            Featured Product
          </label>
        </div>
      </div>

      <div className="glass flex flex-col gap-4 rounded-3xl p-6 sm:p-8">
        <h2 className="m-0 text-lg font-bold text-ink">Photos</h2>
        {existingImages.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {existingImages.map((img) => (
              <label
                key={img}
                className="relative flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl bg-white/50 p-1 text-center"
              >
                <Image
                  src={img}
                  alt=""
                  width={64}
                  height={64}
                  unoptimized
                  className="max-h-14 max-w-full object-contain"
                />
                <span className="flex items-center gap-1 text-[10px] text-muted">
                  <input type="checkbox" name="removeImages" value={img} />
                  Remove
                </span>
              </label>
            ))}
          </div>
        ) : null}
        <FormField
          label={
            existingImages.length > 0 ? "Add More Photos" : "Photos"
          }
        >
          <input
            name="images"
            type="file"
            accept="image/*"
            multiple
            className="input"
          />
        </FormField>
        <p className="m-0 text-xs text-muted">
          The first photo is used as the main product image.
        </p>
      </div>

      <div className="glass flex flex-col gap-4 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="m-0 text-lg font-bold text-ink">
            Storage / GB Options
          </h2>
          <button
            type="button"
            onClick={() =>
              setStorageOptions((prev) => [
                ...prev,
                { label: "", price: initialProduct?.price ?? 0 },
              ])
            }
            className="pill-glass glass rounded-full px-4 py-2 text-xs font-bold text-ink"
          >
            + Add Option
          </button>
        </div>
        <p className="m-0 text-xs text-muted">
          Shown as buttons on the product page (e.g. 128GB, 256GB). Enter the
          full selling price for each option — not an adjustment on top of
          the base price. If you add any options here, the base Price field
          above is only used as a fallback (e.g. for the shop grid) and is
          not shown on the product page itself.
        </p>
        {storageOptions.map((option, i) => (
          <div key={i} className="flex flex-wrap items-end gap-3">
            <div className="min-w-[140px] flex-1">
              <span className="mb-1.5 block text-sm font-semibold text-ink">
                Label
              </span>
              <input
                type="text"
                value={option.label}
                onChange={(e) =>
                  setStorageOptions((prev) =>
                    prev.map((o, idx) =>
                      idx === i ? { ...o, label: e.target.value } : o
                    )
                  )
                }
                placeholder="e.g. 256GB"
                className="input"
              />
            </div>
            <div className="w-36">
              <span className="mb-1.5 block text-sm font-semibold text-ink">
                Price for this option
              </span>
              <input
                type="number"
                value={option.price}
                onChange={(e) =>
                  setStorageOptions((prev) =>
                    prev.map((o, idx) =>
                      idx === i
                        ? { ...o, price: Number(e.target.value) || 0 }
                        : o
                    )
                  )
                }
                className="input"
              />
            </div>
            <button
              type="button"
              onClick={() =>
                setStorageOptions((prev) => prev.filter((_, idx) => idx !== i))
              }
              className="icon-btn flex h-11 items-center justify-center rounded-full bg-black/5 px-4 text-xs font-bold text-accent-orange"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="glass flex flex-col gap-4 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="m-0 text-lg font-bold text-ink">Colors</h2>
          <button
            type="button"
            onClick={() =>
              setColors((prev) => [...prev, { name: "", hex: "#0071e3" }])
            }
            className="pill-glass glass rounded-full px-4 py-2 text-xs font-bold text-ink"
          >
            + Add Color
          </button>
        </div>
        <p className="m-0 text-xs text-muted">
          Shown as selectable color swatches on the product page. Search a
          color name for a ready-made swatch, or fine-tune it with the
          picker.
        </p>
        {colors.map((color, i) => (
          <div key={i} className="flex flex-wrap items-end gap-3">
            <input
              type="color"
              value={color.hex}
              onChange={(e) =>
                setColors((prev) =>
                  prev.map((c, idx) =>
                    idx === i ? { ...c, hex: e.target.value } : c
                  )
                )
              }
              className="h-11 w-14 rounded-lg border border-black/10 bg-transparent"
            />
            <div className="min-w-[180px] flex-1">
              <ColorNameInput
                value={color.name}
                onChange={(name) =>
                  setColors((prev) =>
                    prev.map((c, idx) => (idx === i ? { ...c, name } : c))
                  )
                }
                onSelectSuggestion={(suggestion) =>
                  setColors((prev) =>
                    prev.map((c, idx) =>
                      idx === i
                        ? { ...c, name: suggestion.name, hex: suggestion.hex }
                        : c
                    )
                  )
                }
              />
            </div>
            <button
              type="button"
              onClick={() =>
                setColors((prev) => prev.filter((_, idx) => idx !== i))
              }
              className="icon-btn flex h-11 items-center justify-center rounded-full bg-black/5 px-4 text-xs font-bold text-accent-orange"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="glass flex flex-col gap-4 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="m-0 text-lg font-bold text-ink">Specifications</h2>
          <button
            type="button"
            onClick={() =>
              setSpecs((prev) => [...prev, { label: "", value: "" }])
            }
            className="pill-glass glass rounded-full px-4 py-2 text-xs font-bold text-ink"
          >
            + Add Spec
          </button>
        </div>

        <div className="rounded-2xl bg-black/[0.04] p-4">
          <span className="mb-1.5 block text-sm font-semibold text-ink">
            Paste Specs From Anywhere
          </span>
          <p className="m-0 mb-2 text-xs text-muted">
            Copy a spec sheet from GSMArena, Wikipedia, or the maker&apos;s
            page in your browser, paste it below, and it&apos;ll split into
            rows automatically. Works best with one &quot;Label: Value&quot;
            per line.
          </p>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            rows={4}
            placeholder={"OS: Android 14\nChipset: Snapdragon 8 Gen 3\nBattery: 5000 mAh"}
            className="input resize-none"
          />
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={handleParseSpecs}
              disabled={!pasteText.trim()}
              className="pill-glass glass rounded-full px-4 py-2 text-xs font-bold text-ink disabled:opacity-50"
            >
              Parse &amp; Add to Specifications
            </button>
            {pasteResultCount !== null ? (
              <span className="text-xs text-muted">
                {pasteResultCount} spec{pasteResultCount === 1 ? "" : "s"}{" "}
                added below — review and edit as needed.
              </span>
            ) : null}
          </div>
        </div>

        {specs.map((spec, i) => (
          <div key={i} className="flex flex-wrap items-end gap-3">
            <div className="w-full sm:w-44">
              <input
                type="text"
                value={spec.label}
                onChange={(e) =>
                  setSpecs((prev) =>
                    prev.map((s, idx) =>
                      idx === i ? { ...s, label: e.target.value } : s
                    )
                  )
                }
                placeholder="Label (e.g. Chipset)"
                className="input"
              />
            </div>
            <div className="min-w-[160px] flex-1">
              <input
                type="text"
                value={spec.value}
                onChange={(e) =>
                  setSpecs((prev) =>
                    prev.map((s, idx) =>
                      idx === i ? { ...s, value: e.target.value } : s
                    )
                  )
                }
                placeholder="Value"
                className="input"
              />
            </div>
            <button
              type="button"
              onClick={() =>
                setSpecs((prev) => prev.filter((_, idx) => idx !== i))
              }
              className="icon-btn flex h-11 items-center justify-center rounded-full bg-black/5 px-4 text-xs font-bold text-accent-orange"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {state?.error ? (
        <p className="text-sm font-semibold text-accent-orange">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="pill-solid self-start rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(0,113,227,0.35)] disabled:opacity-60"
      >
        {pending
          ? "Saving…"
          : mode === "create"
            ? "Add Phone"
            : "Save Changes"}
      </button>
    </form>
  );
}
