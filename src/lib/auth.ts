import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { decrypt, getAdminSessionCookieValue } from "./session";

export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const expectedUsername = process.env.ADMIN_USERNAME;
  const passwordHashB64 = process.env.ADMIN_PASSWORD_HASH_BASE64;

  if (!expectedUsername || !passwordHashB64) {
    throw new Error(
      "ADMIN_USERNAME / ADMIN_PASSWORD_HASH_BASE64 are not set. Add them to .env.local."
    );
  }

  if (username !== expectedUsername) return false;

  // Stored base64-encoded: a raw bcrypt hash (e.g. "$2b$10$...") contains
  // "$name" sequences that Next's env loader (dotenv-expand) interprets as
  // variable references and silently strips, corrupting the value.
  const passwordHash = Buffer.from(passwordHashB64, "base64").toString("utf8");
  return bcrypt.compare(password, passwordHash);
}

/** Verifies the admin session cookie. Redirects to /admin/login if missing/invalid. */
export const verifyAdminSession = cache(async () => {
  const cookie = await getAdminSessionCookieValue();
  const session = await decrypt(cookie);

  if (!session?.username) {
    redirect("/admin/login");
  }

  return { username: session.username as string };
});
