import Image from "next/image";
import type { ArticleImage } from "@/lib/articles";
import { PORTRAIT_IMAGE_DIMS } from "@/lib/portrait-images";
import { IMAGE_FOCUS } from "@/lib/image-focus";

/**
 * Shared article media blocks. No "use client" on purpose: they contain zero
 * hooks or browser APIs, so they render server-side inside the RSC tree
 * (ArticleBody) and still work when imported from client components
 * (ArticlePageClient's hero slot).
 */

// Portrait photos (taller than wide) lose heads and feet to the fixed-height
// object-cover bands below, so they render at their natural aspect ratio,
// centred, at a readable column width instead of being cropped.
export function PortraitFigure({
  src, alt, caption, priority,
}: { src: string; alt: string; caption?: string; priority?: boolean }) {
  const dims = PORTRAIT_IMAGE_DIMS[src];
  if (!dims) return null;
  return (
    <figure className="my-8">
      <div className="flex justify-center">
        <Image
          src={src}
          alt={alt}
          width={dims.width}
          height={dims.height}
          priority={priority}
          sizes="(max-width: 768px) 100vw, 448px"
          className="w-full max-w-md rounded-xl h-auto"
        />
      </div>
      {caption && (
        <figcaption className="text-xs text-muted-foreground mt-2 leading-relaxed max-w-md mx-auto">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function ArticleImageBlock({ image }: { image: ArticleImage }) {
  const isHero = image.position === "hero";
  const isInfographic = image.position === "infographic";
  const isSectionBreak = image.position === "section-break";
  const isDiagram = image.position === "diagram";
  // Animated diagrams delivered as muted looping H.264 (GIF of the same
  // animation would be several MB heavier); poster shows the final frame.
  const isVideo = image.src.endsWith(".mp4");

  if (!isDiagram && PORTRAIT_IMAGE_DIMS[image.src]) {
    return (
      <PortraitFigure
        src={image.src}
        alt={image.alt}
        caption={image.caption}
        priority={isHero}
      />
    );
  }

  return (
    <figure
      className={`my-8 ${
        isHero
          ? "-mx-4 sm:-mx-6 lg:-mx-8"
          : isSectionBreak || isInfographic
          ? "-mx-4 sm:-mx-6"
          : ""
      } ${isInfographic || isDiagram || isVideo ? "glass-card rounded-xl overflow-hidden border border-border/50" : ""}`}
    >
      {isDiagram || isVideo ? (
        <div className="bg-surface/60">
          {isVideo ? (
            <video
              src={image.src}
              poster={image.src.replace(/\.mp4$/, "-poster.webp")}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-auto"
              aria-label={image.alt}
            />
          ) : (
            <Image
              src={image.src}
              alt={image.alt}
              width={736}
              height={920}
              className="w-full h-auto"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          )}
        </div>
      ) : (
        <div
          className={`relative overflow-hidden ${
            isHero
              ? "rounded-xl h-48 sm:h-64 lg:h-80"
              : isSectionBreak
              ? "rounded-xl h-48 sm:h-56"
              : isInfographic
              ? "h-48 sm:h-64"
              : "rounded-xl h-40 sm:h-48"
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            style={
              IMAGE_FOCUS[image.src]
                ? { objectPosition: IMAGE_FOCUS[image.src] }
                : undefined
            }
            sizes={
              isHero
                ? "(max-width: 1024px) 100vw, 896px"
                : "(max-width: 768px) 100vw, 768px"
            }
            priority={isHero}
          />
        </div>
      )}
      {image.caption && (
        <figcaption
          className={`text-xs text-muted-foreground mt-2 leading-relaxed ${
            isHero ? "px-4 sm:px-6 lg:px-8" : isSectionBreak ? "px-4 sm:px-6" : ""
          }`}
        >
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
}
