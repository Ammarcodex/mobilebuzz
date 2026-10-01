import type { Metadata } from "next";
import Logo from "@/components/Logo";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
};

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[420px] flex-col items-center justify-center px-6 py-16">
      <div className="glass w-full rounded-[32px] p-8 sm:p-10">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Logo />
          <h1 className="m-0 text-2xl font-extrabold tracking-tight text-ink">
            Admin Login
          </h1>
          <p className="m-0 text-sm text-muted">
            Sign in to manage phones in the catalog.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
