"use client";

import { useActionState, useMemo, useState } from "react";
import Image from "next/image";
import type { Category, Product, ProductColor, Spec, StorageOption } from "@/lib/types";
import { createProductAction, updateProductAction } from "@/app/admin/actions";
import ColorNameInput from "./ColorNameInput";
import SelectWithOther from "./SelectWithOther";
import PhotoUploadInput from "./PhotoUploadInput";
import { parseSpecText } from "@/lib/specParser";
import { RAM_OPTIONS, STORAGE_OPTIONS } from "@/lib/phoneSpecOptions";

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
  const [photosProcessing, setPhotosProcessing] = useState(false);

  const [categorySlug, setCategorySlug] = useState(
    initialProduct?.category ?? ""
  );
  const [brandName, setBrandName] = useState(initialProduct?.brandName ?? "");
  const [ram, setRam] = useState(initialProduct?.ram ?? "");
  const [rom, setRom] = useState(initialProduct?.rom ?? "");
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

  // Brand options are scoped to the selected category (e.g. Smartphones ->
  // Samsung/Apple/Tecno/...), not pooled across every category — Accessories'
  // "brands" are actually product types (Cables, Docks, ...), not real brands.
  // Before a category is picked, default to Smartphones since that's what
  // this admin is for most of the time.
  const brandOptions = useMemo(() => {
    const brands =
      selectedCategory?.brands ??
      categories.find((c) => c.slug === "smartphone")?.brands ??
      [];
    return brands.map((b) => b.name);
  }, [categories, selectedCategory]);

  function updateStorageOption(index: number, patch: Partial<StorageOption>) {
    setStorageOptions((prev) =>
      prev.map((o, idx) => (idx === index ? { ...o, ...patch } : o))
    );
  }

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
            <SelectWithOther
              name="brand"
              value={brandName}
              onChange={setBrandName}
              options={brandOptions}
              placeholder="Type brand name"
              emptyLabel="Select brand…"
            />
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
            <SelectWithOther
              name="ram"
              value={ram}
              onChange={setRam}
              options={RAM_OPTIONS}
              placeholder="e.g. 8"
            />
          </FormField>
          <FormField label="Storage (ROM)">
            <SelectWithOther
              name="rom"
              value={rom}
              onChange={setRom}
              options={STORAGE_OPTIONS}
              placeholder="e.g. 128"
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
                className="relative flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl bg-white/90 p-1 text-center"
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
        <PhotoUploadInput
          name="images"
          label={existingImages.length > 0 ? "Add More Photos" : "Photos"}
          onProcessingChange={setPhotosProcessing}
        />
        <p className="m-0 text-xs text-muted">
          The first photo is used as the main product image. Background
          removal works best on plain white/light studio photos — turn it
          off if a photo comes out wrong and re-upload it as-is.
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
                {
                  ram: "",
                  rom: "",
                  price: initialProduct?.price ?? 0,
                  ptaStatus: "pta",
                },
              ])
            }
            className="pill-glass glass rounded-full px-4 py-2 text-xs font-bold text-ink"
          >
            + Add Option
          </button>
        </div>
        <p className="m-0 text-xs text-muted">
          Each option is a RAM + Storage combo with its own price and PTA
          status, shown as a button like &quot;8 - 128&quot; or &quot;12 -
          256&quot;. Enter the full selling price for each — not an
          adjustment on top of the base price. To sell the same RAM + Storage
          combo at two prices, add it twice: once marked PTA Approved, once
          marked Non-PTA. If you add any options here, the base Price field
          above is only used as a fallback (e.g. for the shop grid) and is
          not shown on the product page itself.
        </p>
        {storageOptions.map((option, i) => (
          <div key={i} className="flex flex-wrap items-end gap-3">
            <div className="w-32">
              <span className="mb-1.5 block text-sm font-semibold text-ink">
                RAM
              </span>
              <SelectWithOther
                value={option.ram}
                onChange={(value) => updateStorageOption(i, { ram: value })}
                options={RAM_OPTIONS}
                placeholder="e.g. 8"
              />
            </div>
            <div className="w-32">
              <span className="mb-1.5 block text-sm font-semibold text-ink">
                Storage
              </span>
              <SelectWithOther
                value={option.rom}
                onChange={(value) => updateStorageOption(i, { rom: value })}
                options={STORAGE_OPTIONS}
                placeholder="e.g. 128"
              />
            </div>
            <div>
              <span className="mb-1.5 block text-sm font-semibold text-ink">
                PTA Status
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateStorageOption(i, { ptaStatus: "pta" })
                  }
                  className={`rounded-full px-3 py-2.5 text-xs font-bold transition-colors ${
                    (option.ptaStatus ?? "pta") === "pta"
                      ? "bg-accent text-white"
                      : "pill-glass glass text-ink"
                  }`}
                >
                  PTA Approved
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateStorageOption(i, { ptaStatus: "non-pta" })
                  }
                  className={`rounded-full px-3 py-2.5 text-xs font-bold transition-colors ${
                    option.ptaStatus === "non-pta"
                      ? "bg-accent text-white"
                      : "pill-glass glass text-ink"
                  }`}
                >
                  Non-PTA
                </button>
              </div>
            </div>
            <div className="w-36 flex-1">
              <span className="mb-1.5 block text-sm font-semibold text-ink">
                Price for this option
              </span>
              <input
                type="number"
                value={option.price}
                onChange={(e) =>
                  updateStorageOption(i, { price: Number(e.target.value) || 0 })
                }
                className="input"
              />
            </div>
            <button
              type="button"
              onClick={() =>
                setStorageOptions((prev) => prev.filter((_, idx) => idx !== i))
              }
              className="icon-btn flex h-11 items-center justify-center rounded-full subtle-surface px-4 text-xs font-bold text-accent-orange"
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
              className="icon-btn flex h-11 items-center justify-center rounded-full subtle-surface px-4 text-xs font-bold text-accent-orange"
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

        <div className="rounded-2xl subtle-surface p-4">
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
              className="icon-btn flex h-11 items-center justify-center rounded-full subtle-surface px-4 text-xs font-bold text-accent-orange"
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
        disabled={pending || photosProcessing}
        className="pill-solid self-start rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(0,113,227,0.35)] disabled:opacity-60"
      >
        {photosProcessing
          ? "Removing background…"
          : pending
            ? "Saving…"
            : mode === "create"
              ? "Add Phone"
              : "Save Changes"}
      </button>
    </form>
  );
}
