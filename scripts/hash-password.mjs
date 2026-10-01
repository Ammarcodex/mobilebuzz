// Generates a bcrypt hash (base64-encoded) to put in ADMIN_PASSWORD_HASH_BASE64
// in .env.local. It's base64-encoded because a raw "$2b$10$..." hash contains
// "$name" sequences that Next's env loader (dotenv-expand) would otherwise
// mangle by interpreting them as variable references.
// Usage: npm run hash-password -- "your-new-password"
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run hash-password -- "your-password"');
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
console.log(Buffer.from(hash, "utf8").toString("base64"));
