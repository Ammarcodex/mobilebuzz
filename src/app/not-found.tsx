import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[700px] flex-col items-center px-6 py-24 text-center">
      <div className="glass rounded-[32px] p-12">
        <span className="text-sm font-bold tracking-[0.05em] text-accent">
          404
        </span>
        <h1 className="m-0 mb-3 mt-2 text-3xl font-extrabold tracking-tight text-ink">
          Page Not Found
        </h1>
        <p className="mb-6 text-muted">
          The page you&apos;re looking for doesn&apos;t exist or may have
          been moved.
        </p>
        <Link
          href="/"
          className="pill-solid inline-block rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(0,113,227,0.35)]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
