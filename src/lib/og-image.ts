import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * OG image pipeline metadata helper (Task 65).
 *
 * scripts/generate_og_images.mjs (build step, runs before `next build`)
 * writes a 1200x630 JPEG derivative of every og:image source into
 * public/og/<stem>.jpg. This helper maps a source image path to that
 * derivative so og:image / twitter:image / JSON-LD always emit a
 * WhatsApp/LinkedIn-safe JPEG with canonical dimensions, instead of the
 * webp sources the crawler ecosystem mishandles.
 *
 * Falls back to the input path when no derivative exists (e.g. a fresh
 * dev server before the first build), and to the compliant site default
 * when the input is empty (covers frontmatter with a blank og_image).
 *
 * Build-time-only fs access: every consumer (generateMetadata, JSON-LD in
 * page bodies) runs during static generation, never in the client bundle.
 */
export const DEFAULT_OG_IMAGE = "/images/og-default.png";

const cache = new Map<string, string>();

export function ogImageFor(path?: string | null): string {
  if (!path) return DEFAULT_OG_IMAGE;
  const hit = cache.get(path);
  if (hit) return hit;
  let result = path;
  const m = path.match(/^\/images\/([^/]+)\.(webp|jpe?g|png)$/i);
  if (m && path !== DEFAULT_OG_IMAGE) {
    const derivative = `/og/${m[1]}.jpg`;
    if (existsSync(join(process.cwd(), "public", "og", `${m[1]}.jpg`))) {
      result = derivative;
    }
  }
  cache.set(path, result);
  return result;
}
