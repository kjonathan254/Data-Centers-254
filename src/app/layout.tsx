import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import PwaRegister from "@/components/PwaRegister";
import { siteUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0b1e3c",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Data Centre 254 | Inside Kenya's Digital Infrastructure",
    template: "%s | Data Centre 254",
  },
  description:
    "An independent Kenyan educational and research platform explaining the infrastructure behind Kenya's digital economy. Data centres, connectivity, power, AI, and the systems that make the digital world work.",
  keywords: [
    "data centres Kenya",
    "data center Nairobi",
    "Kenya digital infrastructure",
    "subsea cables Kenya",
    "M-Pesa infrastructure",
    "AI infrastructure Kenya",
    "cloud computing Africa",
    "data sovereignty Kenya",
    "Silicon Savannah",
    "iXAfrica",
    "Africa Data Centres",
    "Kenya fibre optic",
    "Kenya electricity grid",
    "data centre careers Kenya",
    "digital economy Kenya",
    "hyperscale East Africa",
  ],
  authors: [{ name: "Kevin Jonathan Otieno", url: siteUrl("/about") }],
  creator: "Kevin Jonathan Otieno",
  publisher: "Data Centre 254",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/icon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    title: "DC254",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Data Centre 254 | Inside Kenya's Digital Infrastructure",
    description:
      "Understanding the physical infrastructure behind Kenya's digital economy. Data centres, connectivity, power, cloud, AI, and the systems that make the digital world work.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
    images: [{
      url: "/images/og-default.png",
      width: 1152,
      height: 864,
      alt: "Data Centre 254 — Understanding Kenya's Digital Infrastructure",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Centre 254 | Kenya's Digital Infrastructure",
    description:
      "Understanding the infrastructure behind Kenya's digital economy -- data centres, connectivity, power, cloud, AI, and more.",
    images: ["/images/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Data Centre 254",
              url: siteUrl(),
              logo: siteUrl("/logo.png"),
              description:
                "Kenya's independent knowledge and intelligence platform for digital infrastructure. Translating complex data centre, connectivity, and power infrastructure into accessible knowledge.",
              founder: {
                "@type": "Person",
                name: "Kevin Jonathan Otieno",
                jobTitle: "Founder & Researcher",
                description: "Kenyan founder, writer and content creator with a background in communications, digital media, digital marketing and technology. Self-taught in AI, cloud computing and digital infrastructure.",
                email: "elmaccommunicationslimited@gmail.com",
                sameAs: [
                  "https://x.com/FinallyKayvoh",
                  "https://www.linkedin.com/in/kevin-jonathan-otieno",
                  "https://www.instagram.com/kayvoh_da_5_7",
                ],
              },
              foundingLocation: {
                "@type": "Place",
                name: "Nairobi, Kenya",
              },
              sameAs: [
                "https://x.com/FinallyKayvoh",
                "https://www.linkedin.com/in/kevin-jonathan-otieno",
                "https://www.instagram.com/kayvoh_da_5_7",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "editorial",
                email: "elmaccommunicationslimited@gmail.com",
                availableLanguage: ["English"],
              },
            }),
          }}
        />
        {/* WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Data Centre 254",
              url: siteUrl(),
              description:
                "Understanding the infrastructure behind Kenya's digital economy. Data centres, connectivity, power, cloud computing, AI, and the physical systems that make the digital world work.",
              publisher: {
                "@type": "Organization",
                name: "Data Centre 254",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${siteUrl()}/search?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <GoogleAnalytics gaId="G-GDS6XW6RS3" />
        {children}
        <Analytics />
        <PwaRegister />
        <Toaster />
      </body>
    </html>
  );
}
