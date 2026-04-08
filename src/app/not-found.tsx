import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="font-[family-name:var(--font-mono)] text-neutral-800 text-[120px] sm:text-[180px] leading-none font-bold select-none">
          404
        </div>

        <div className="relative -mt-8 sm:-mt-12">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl font-bold text-white mb-2 glitch-hover">
            SIGNAL LOST
          </h1>
          <p className="font-[family-name:var(--font-mono)] text-xs text-muted tracking-wider">
            // TARGET LOCATION NOT FOUND IN DATABASE
          </p>
        </div>

        <div className="mt-8 border border-border bg-surface p-4 text-left font-[family-name:var(--font-mono)] text-xs text-muted space-y-1">
          <div>
            <span className="text-neutral-600">&gt;</span> SCANNING_NETWORK...
          </div>
          <div>
            <span className="text-neutral-600">&gt;</span> ROUTE_RESOLUTION:{" "}
            <span className="text-danger">FAILED</span>
          </div>
          <div>
            <span className="text-neutral-600">&gt;</span> STATUS:{" "}
            <span className="text-white">RESOURCE_NOT_FOUND</span>
          </div>
          <div>
            <span className="text-neutral-600">&gt;</span> RECOMMENDATION:{" "}
            <span className="text-white">RETURN_TO_BASE</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="bg-white text-black font-[family-name:var(--font-heading)] font-bold px-6 py-2.5 text-sm tracking-wider hover:bg-neutral-200 transition-colors"
          >
            RETURN TO BASE
          </Link>
          <Link
            href="/missions"
            className="border border-border text-muted font-[family-name:var(--font-mono)] px-6 py-2.5 text-xs tracking-wider hover:text-white hover:border-white/30 transition-colors"
          >
            VIEW MISSIONS
          </Link>
        </div>

        <div className="mt-12 font-[family-name:var(--font-mono)] text-[10px] text-neutral-800">
          TWP_NETWORK // ERR_404 // SIGNAL_LOST
        </div>
      </div>
    </div>
  );
}
