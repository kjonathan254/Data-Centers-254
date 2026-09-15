/**
 * Hand-maintained crop focus for photos that sit in ArticlePageClient's
 * fixed-height object-cover bands, where a centred crop would cut off
 * people's heads (portraits are handled separately by portrait-images.ts).
 * Values are CSS object-position, keyed by public image path.
 *
 * Rule of thumb: heads near the top third of a photo need the vertical
 * percentage set so the visible band starts above the hairline, e.g.
 * "50% 15%" shows roughly the top 9-47% of a typical inline band.
 */
export const IMAGE_FOCUS: Record<string, string> = {
  // Hero shot: the PS's head starts ~2% from the top edge, so a centred
  // desktop hero band (showing 18-82%) sliced through his forehead.
  "/images/tanui-ps-konza-podium.webp": "50% 0%",
  // Inline shot: head spans roughly 10-35% of image height; a centred
  // inline band (31-69%) cut the top half of his head off.
  "/images/tanui-ps-konza-address.webp": "50% 15%",
};
