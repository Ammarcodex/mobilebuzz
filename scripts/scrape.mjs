// One-time scraper for mobilenbazaar.com's real product catalog.
// Run manually with: node scripts/scrape.mjs
// Writes src/data/products.json, src/data/categories.json, src/data/brands.json.
// This is NOT run at build/request time — the output JSON is committed and used directly.

import * as cheerio from "cheerio";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const BASE = "https://mobilenbazaar.com";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "src", "data");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchText(url, retries = 2) {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return await res.text();
    } catch (err) {
      if (attempt >= retries) throw err;
      await sleep(500 * (attempt + 1));
    }
  }
}

// A couple of brand names come out of the site's own breadcrumb schema with
// typos/odd spacing (e.g. "TECHNO", "REAL ME") — normalize display only,
// slugs (used for routing) are left exactly as scraped from the real URLs.
const BRAND_NAME_FIXES = {
  TECHNO: "Tecno",
  "REAL ME": "Realme",
};

function lastSegment(url) {
  return url.replace(/\/$/, "").split("/").pop();
}

function titleCaseBrand(name) {
  if (!name) return name;
  if (BRAND_NAME_FIXES[name]) return BRAND_NAME_FIXES[name];
  // Breadcrumb brand names are often ALL CAPS ("APPLE"); title-case them,
  // but keep short all-caps acronyms like "HP" as-is.
  if (name.length <= 3) return name.toUpperCase();
  if (name === name.toUpperCase()) {
    return name
      .toLowerCase()
      .split(" ")
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
      .join(" ");
  }
  return name;
}

function parseRamRom(description) {
  if (!description) return { ram: null, rom: null };
  const ramMatch = description.match(/RAM\s*:\s*\r?\n?\s*([^\r\n]+)/i);
  const romMatch = description.match(/ROM\s*:\s*\r?\n?\s*([^\r\n]+)/i);
  return {
    ram: ramMatch ? ramMatch[1].trim() : null,
    rom: romMatch ? romMatch[1].trim() : null,
  };
}

// Best-effort parse of the pasted GSMArena-style specs table:
// <table class="specs"> ... <tr><td class="specs-mainHeading" rowspan>Section</td>
//   <th class="specs-subHeading">Label</th><td class="specs-value">Value</td></tr> ...
function parseSpecsTable($) {
  const specs = [];
  $("table.specs tr").each((_, tr) => {
    const $tr = $(tr);
    const label = $tr.find("th.specs-subHeading").first().text().trim();
    const $value = $tr.find("td.specs-value").first();
    if (!label || $value.length === 0) return;
    $value.find("script, style").remove();
    const value = $value
      .text()
      .replace(/\s+/g, " ")
      .trim();
    if (label && value) specs.push({ label, value });
  });
  return specs.length ? specs : undefined;
}

// WooCommerce variable products expose a JSON blob of variations on the
// add-to-cart form via data-product_variations. Most products on this site
// are simple products (each color/storage is its own product page), so this
// will often be absent — that's expected, not a scraping failure.
function parseVariations($) {
  const el = $("[data-product_variations]").first();
  if (!el.length) return undefined;
  const raw = el.attr("data-product_variations");
  if (!raw || raw === "false") return undefined;
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data) || data.length === 0) return undefined;
    return data.map((v) => ({
      attributes: v.attributes || {},
      price: v.display_price ?? v.price ?? null,
      image: v.image?.src || v.image?.full_src || v.image?.thumb_src || null,
      sku: v.sku || null,
    }));
  } catch {
    return undefined;
  }
}

async function scrapeProduct(url) {
  const html = await fetchText(url);
  const $ = cheerio.load(html);

  let productNode;
  let breadcrumbNode;
  $('script[type="application/ld+json"]').each((_, el) => {
    let json;
    try {
      json = JSON.parse($(el).contents().text());
    } catch {
      return;
    }
    const graph = Array.isArray(json["@graph"]) ? json["@graph"] : [json];
    for (const node of graph) {
      if (node["@type"] === "Product") productNode = node;
      if (node["@type"] === "BreadcrumbList") breadcrumbNode = node;
    }
  });

  if (!productNode) {
    console.warn(`  ! no Product JSON-LD found for ${url}`);
    return null;
  }

  const items = breadcrumbNode?.itemListElement || [];
  let categoryName = null;
  let categorySlug = null;
  let brandName = null;
  let brandSlug = null;

  if (items.length >= 3) {
    categoryName = items[1].item.name;
    categorySlug = lastSegment(items[1].item["@id"]);
  }
  if (items.length >= 4) {
    brandName = titleCaseBrand(items[2].item.name);
    brandSlug = lastSegment(items[2].item["@id"]);
  }

  const { ram, rom } = parseRamRom(productNode.description || "");

  const priceRaw =
    productNode.offers?.[0]?.priceSpecification?.[0]?.price ??
    productNode.offers?.[0]?.price ??
    "0";
  const price = Number(priceRaw) || 0;

  const galleryImages = [
    ...new Set(
      $("[data-large_image]")
        .map((_, el) => $(el).attr("data-large_image"))
        .get()
        .filter(Boolean)
    ),
  ];

  const image = productNode.image || galleryImages[0] || null;
  const images = galleryImages.length > 1 ? galleryImages : undefined;

  const specs = parseSpecsTable($);
  const variants = parseVariations($);

  return {
    slug: lastSegment(url),
    name: productNode.name,
    category: categorySlug,
    categoryName,
    brand: brandSlug,
    brandName,
    price,
    ram,
    rom,
    image,
    ...(images ? { images } : {}),
    ...(variants ? { variants } : {}),
    ...(specs ? { specs } : {}),
  };
}

async function main() {
  console.log("Fetching product sitemap...");
  const sitemapXml = await fetchText(`${BASE}/product-sitemap.xml`);
  const $sitemap = cheerio.load(sitemapXml, { xmlMode: true });
  const urls = $sitemap("loc")
    .map((_, el) => $sitemap(el).text().trim())
    .get()
    .filter((u) => u.includes("/product/"));

  console.log(`Found ${urls.length} product URLs.`);

  const products = [];
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    process.stdout.write(`[${i + 1}/${urls.length}] ${url}\n`);
    try {
      const product = await scrapeProduct(url);
      if (product) products.push(product);
    } catch (err) {
      console.error(`  ! failed: ${err.message}`);
    }
    await sleep(150 + Math.random() * 150);
  }

  console.log(`Scraped ${products.length} products successfully.`);

  console.log("Fetching homepage to cross-check category counts...");
  let homeCounts = {};
  try {
    const homeHtml = await fetchText(`${BASE}/`);
    const $home = cheerio.load(homeHtml);
    $home('a[href*="/product-category/"]').each((_, el) => {
      const href = $home(el).attr("href") || "";
      const text = $home(el).text().trim();
      const m = text.match(/^(\d+)\s+products?$/i);
      if (!m) return;
      const slug = lastSegment(href);
      homeCounts[slug] = Number(m[1]);
    });
    console.log("Homepage category counts:", homeCounts);
  } catch (err) {
    console.warn(`Could not fetch homepage counts: ${err.message}`);
  }

  // Group scraped products by real (actual) category/brand.
  const byCategory = new Map();
  for (const p of products) {
    if (!p.category) continue;
    if (!byCategory.has(p.category)) byCategory.set(p.category, []);
    byCategory.get(p.category).push(p);
  }

  const smartphoneProducts = byCategory.get("smartphone") || [];
  const smartwatchProducts = byCategory.get("smartwatches") || [];

  const brandMap = new Map();
  for (const p of smartphoneProducts) {
    if (p.brand && !brandMap.has(p.brand)) {
      brandMap.set(p.brand, p.brandName || p.brand);
    }
  }
  const smartphoneBrands = [...brandMap.entries()].map(([slug, name]) => ({
    slug,
    name,
  }));

  const categories = [
    {
      slug: "smartphone",
      name: "Smartphones",
      count: smartphoneProducts.length,
      brands: smartphoneBrands,
    },
    {
      slug: "smartwatches",
      name: "Smart Watches",
      count: smartwatchProducts.length,
    },
    {
      slug: "laptops",
      name: "Laptops",
      count: 0,
      brands: [
        { slug: "hp", name: "HP" },
        { slug: "dell", name: "Dell" },
        { slug: "applelaptops", name: "Apple" },
        { slug: "ilife", name: "iLife" },
        { slug: "lenovo", name: "Lenovo" },
      ],
    },
    {
      slug: "tablet",
      name: "Tablets",
      count: 0,
      brands: [
        { slug: "samsungtab", name: "Samsung" },
        { slug: "danytabs", name: "Dany" },
        { slug: "alcateltabs", name: "Alcatel" },
        { slug: "xiaomi-tablet", name: "Xiaomi" },
      ],
    },
    {
      slug: "accessories",
      name: "Accessories",
      count: 0,
      brands: [
        { slug: "speakers", name: "Speakers" },
        { slug: "apple-doc", name: "Apple Dock" },
        { slug: "samsung-doc", name: "Samsung Dock" },
        { slug: "airpod", name: "Airpods" },
        { slug: "power-bank", name: "Power Bank" },
        { slug: "cables", name: "Cables" },
        { slug: "connector", name: "Connector" },
        { slug: "handsfree", name: "Handsfree" },
      ],
    },
  ];

  const brands = [
    {
      name: "Apple",
      logo: "https://mobilenbazaar.com/wp-content/uploads/2019/09/apple_logo_PNG19670.png",
    },
    {
      name: "Samsung",
      logo: "https://mobilenbazaar.com/wp-content/uploads/2019/09/1280px-Samsung_Logo.svg.png",
    },
    {
      name: "Oppo",
      logo: "https://mobilenbazaar.com/wp-content/uploads/2019/09/OPPO_LOGO_2019.png",
    },
    {
      name: "Vivo",
      logo: "https://mobilenbazaar.com/wp-content/uploads/2019/09/Vivo_mobile_logo.png",
    },
    {
      name: "Infinix",
      logo: "https://mobilenbazaar.com/wp-content/uploads/2019/09/Infinix-Logo.png",
    },
    {
      name: "Honor",
      logo: "https://mobilenbazaar.com/wp-content/uploads/2019/09/Honor-Logo.png",
    },
    {
      name: "Huawei",
      logo: "https://mobilenbazaar.com/wp-content/uploads/2019/09/huawi.png",
    },
    {
      name: "HP",
      logo: "https://mobilenbazaar.com/wp-content/uploads/2019/09/HP_logo_630x630.png",
    },
    {
      name: "Nokia",
      logo: "https://mobilenbazaar.com/wp-content/uploads/2019/09/nokia.png",
    },
  ];

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    path.join(DATA_DIR, "products.json"),
    JSON.stringify(products, null, 2)
  );
  await fs.writeFile(
    path.join(DATA_DIR, "categories.json"),
    JSON.stringify(categories, null, 2)
  );
  await fs.writeFile(
    path.join(DATA_DIR, "brands.json"),
    JSON.stringify(brands, null, 2)
  );

  console.log("\n=== Done ===");
  console.log(`Products written: ${products.length}`);
  console.log(
    `Smartphone: ${smartphoneProducts.length} (homepage said ${homeCounts.smartphone ?? "?"})`
  );
  console.log(
    `Smart Watches: ${smartwatchProducts.length} (homepage said ${homeCounts.smartwatches ?? "?"})`
  );
  console.log(`Smartphone brands found: ${smartphoneBrands.map((b) => b.name).join(", ")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
