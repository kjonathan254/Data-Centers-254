/**
 * "New" badge — green pill with a neon glow, shown on article cards in
 * listings. Displayed only when isArticleFresh() is true (see
 * src/lib/articles.ts), so badge state can never disagree with the
 * freshness sort that puts those same stories on top.
 * Server component; no client JS.
 */
export default function NewBadge({ className = "" }: { className?: string }) {
  return (
    <span
      aria-label="New story"
      className={`inline-flex shrink-0 items-center rounded-full border border-neon/50 bg-neon/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-neon glow-neon-sm ${className}`}
    >
      New
    </span>
  );
}
