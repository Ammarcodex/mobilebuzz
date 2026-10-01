import Link from "next/link";
import { verifyAdminSession } from "@/lib/auth";
import { logoutAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifyAdminSession();

  return (
    <div className="mx-auto max-w-[1240px] px-6 pb-16 pt-8">
      <div className="glass mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[22px] px-5 py-3.5">
        <div className="flex flex-wrap items-center gap-5">
          <Link href="/admin" className="text-base font-extrabold text-ink">
            Admin
          </Link>
          <nav className="flex flex-wrap gap-4 text-sm font-semibold">
            <Link href="/admin" className="nav-link">
              Products
            </Link>
            <Link href="/admin/products/new" className="nav-link">
              Add New Phone
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted">Signed in as {session.username}</span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="pill-glass glass rounded-full px-4 py-2 text-xs font-bold text-ink"
            >
              Log Out
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
