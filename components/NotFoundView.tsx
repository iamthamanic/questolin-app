/**
 * German not-found screen — shared by app and topic routes.
 * Location: components/NotFoundView.tsx
 */

import Link from "next/link";

interface NotFoundViewProps {
  message?: string;
}

export function NotFoundView({
  message = "Dieses Thema oder diese Seite existiert nicht.",
}: NotFoundViewProps) {
  return (
    <main className="max-w-lg mx-auto min-h-[100dvh] flex flex-col items-center justify-center px-4">
      <div className="card bg-base-200 shadow-xl w-full">
        <div className="card-body items-center text-center gap-3">
          <h1 className="card-title text-2xl">Seite nicht gefunden</h1>
          <p className="text-base-content/80">{message}</p>
          <Link href="/" className="btn btn-primary min-h-11">
            Zurück zum Feed
          </Link>
        </div>
      </div>
    </main>
  );
}
