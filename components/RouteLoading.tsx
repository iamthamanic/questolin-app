/**
 * Route loading spinner for feed and topic pages.
 * Location: components/RouteLoading.tsx
 */

export function RouteLoading({ label = "Wird geladen …" }: { label?: string }) {
  return (
    <main className="max-w-lg mx-auto min-h-[100dvh] flex flex-col items-center justify-center px-4 gap-4">
      <span
        className="loading loading-spinner loading-lg text-primary"
        aria-hidden="true"
      />
      <p className="text-sm text-base-content/70" role="status">
        {label}
      </p>
    </main>
  );
}
