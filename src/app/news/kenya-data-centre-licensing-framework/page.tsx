import { permanentRedirect } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kenya Data Centre Licensing: NFP-T1 and NFP-T2 Explained",
  description: "Kenya now requires data centre operators to hold an NFP-T2 licence. Read the full analysis.",
  alternates: { canonical: "/articles/kenya-data-centre-licensing-framework" },
};

export default function NewsRedirect() {
  permanentRedirect("/articles/kenya-data-centre-licensing-framework");
}
