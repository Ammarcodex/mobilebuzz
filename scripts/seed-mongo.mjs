// One-time/idempotent import of src/data/products.json into MongoDB Atlas.
// Usage: npm run seed   (reads MONGODB_URI / MONGODB_DB from .env.local)
import { readFile } from "node:fs/promises";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "mobile_buzz";

if (!uri) {
  console.error("MONGODB_URI is not set. Add it to .env.local first.");
  process.exit(1);
}

const raw = await readFile(
  new URL("../src/data/products.json", import.meta.url),
  "utf-8"
);
const products = JSON.parse(raw);

const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db(dbName);
  const col = db.collection("products");

  await col.createIndex({ slug: 1 }, { unique: true });

  let inserted = 0;
  let updated = 0;
  const now = new Date();

  for (const product of products) {
    const result = await col.updateOne(
      { slug: product.slug },
      {
        $set: { ...product, updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );
    if (result.upsertedCount > 0) inserted += 1;
    else updated += 1;
  }

  console.log(
    `Seed complete: ${inserted} inserted, ${updated} updated (${products.length} total).`
  );
} finally {
  await client.close();
}
