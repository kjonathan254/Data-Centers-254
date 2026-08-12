import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "About",
  description:
    "Data Centre 254 is Kenya's independent knowledge platform for digital infrastructure. Founded by Kevin Jonathan Otieno, we translate complex data centre, connectivity, and power infrastructure into accessible knowledge.",
  alternates: { canonical: "https://datacentre254.com/about" },
  openGraph: {
    title: "About | Data Centre 254",
    description:
      "Kenya's independent knowledge platform for digital infrastructure. Our mission, methodology, and the person behind it.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Data Centre 254",
    description:
      "Kenya's independent knowledge platform for digital infrastructure.",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="relative">
          <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_10%,oklch(0.78_0.14_195/3%),transparent_70%)]"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            {/* Header */}
            <div className="mb-16">
              <span className="inline-block font-mono text-xs sm:text-sm tracking-widest text-cyan mb-4 uppercase">
                About
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight mb-6">
                Why Data Centre 254 Exists
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                There is no single place where a Kenyan can go to understand the physical infrastructure
                that makes their digital life possible. Data Centre 254 exists to fill that gap.
              </p>
            </div>

            {/* The Problem */}
            <section className="mb-16">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                The Problem We Are Solving
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  When you send an M-Pesa payment, stream a video on YouTube, or store a file on Google
                  Drive, your data travels through a physical chain of infrastructure: submarine cables
                  landing in Mombasa, fibre optic networks crossing the country, internet exchange points
                  in Nairobi, and data centres humming with servers, cooling systems, and backup
                  generators.
                </p>
                <p>
                  This infrastructure is real, it is being built at staggering speed in Kenya, and it
                  matters to everyone who uses the internet. Yet almost nobody outside the industry
                  understands how it works, where it is, who owns it, or why it matters. The information
                  that does exist is scattered across investor presentations, technical whitepapers,
                  news articles behind paywalls, and industry conference talks that never reach a public
                  audience.
                </p>
                <p>
                  Data Centre 254 was built to be the antidote to that fragmentation: a single, free,
                  independent platform where anyone can learn about Kenya's digital infrastructure in
                  plain language.
                </p>
              </div>
            </section>

            {/* Who We Are */}
            <section className="mb-16">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                Who Is Behind This
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Data Centre 254 was founded and is operated by <strong className="text-foreground">Kevin Jonathan Otieno</strong>,
                  a Kenyan founder, writer and content creator with a background in communications,
                  digital media, digital marketing and technology. He is self-taught in areas of AI,
                  cloud computing and digital infrastructure.
                </p>
                <p>
                  The platform is not backed by any data centre operator, telecom company, or government
                  agency. It is an independent project built out of a conviction that public understanding
                  of digital infrastructure is essential for a healthy digital economy.
                </p>
                <p>
                  This platform does not claim special insider expertise or industry credentials. The
                  strength behind DC254 is translation: taking complex technology and infrastructure topics
                  and making them clear and accessible for the Kenyan public, businesses, students and
                  aspiring professionals. Every topic is researched, verified, and explained with
                  transparency about where information comes from and how confident we are in each claim.
                </p>
              </div>

              {/* Social Links */}
              <div className="mt-6 flex items-center gap-3">
                <a
                  href="https://x.com/FinallyKayvoh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card rounded-lg px-3 py-2 border border-border/50 text-sm text-muted-foreground hover:text-cyan hover:border-cyan/30 transition-all inline-flex items-center gap-2"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  X/Twitter
                </a>
                <a
                  href="https://www.linkedin.com/in/kevin-jonathan-otieno"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card rounded-lg px-3 py-2 border border-border/50 text-sm text-muted-foreground hover:text-cyan hover:border-cyan/30 transition-all inline-flex items-center gap-2"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
                  LinkedIn
                </a>
                <a
                  href="https://www.instagram.com/kayvoh_da_5_7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card rounded-lg px-3 py-2 border border-border/50 text-sm text-muted-foreground hover:text-cyan hover:border-cyan/30 transition-all inline-flex items-center gap-2"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  Instagram
                </a>
              </div>
            </section>

            {/* What We Cover */}
            <section className="mb-16">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                What We Cover
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: "Data Centres", desc: "What they are, how they work, and where Kenya's facilities are located" },
                  { title: "Connectivity", desc: "Submarine cables, KIXP, fibre networks, and how the internet reaches Kenya" },
                  { title: "Power & Energy", desc: "Electricity consumption, Kenya's geothermal advantage, and the AI energy challenge" },
                  { title: "Policy & Regulation", desc: "Data protection laws, data sovereignty, and government digital strategy" },
                  { title: "Business & Investment", desc: "How data centres make money, market dynamics, and investment opportunities" },
                  { title: "Careers", desc: "Job paths, certifications, skills needed, and how to enter the industry" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="glass-card rounded-xl p-5 border border-border/50"
                  >
                    <h3 className="text-sm font-semibold text-cyan mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Methodology — THE KEY E-E-A-T SECTION */}
            <section className="mb-16">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                Our Methodology
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    Reported Facts vs. Analysis vs. Opinion
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Every piece of content on Data Centre 254 clearly separates three types of
                    information. <strong className="text-foreground">Reported facts</strong> are specific,
                    verifiable claims tied to named sources: company announcements, government reports,
                    regulatory filings, and interviews. <strong className="text-foreground">Analysis</strong> is
                    our interpretation of what those facts mean, and we always explain the reasoning.{" "}
                    <strong className="text-foreground">Opinion</strong> is clearly labelled as such and
                    represents the platform's editorial view, not established fact.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    The Verification Chain
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Every factual claim in our articles is tracked through a verification chain: the
                    claim itself, the source it came from, the date it was last verified, and a
                    confidence rating (High, Medium, Low, or Unverified). You can see this chain on every
                    article page under "Claims & Sources." We do not ask you to trust us blindly; we show
                    you the evidence so you can evaluate it yourself.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    Primary Sources First
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We prioritise primary sources wherever possible: official company publications,
                    government gazettes, regulatory filings, and direct statements from named officials.
                    Where primary sources are unavailable, we clearly note this and cite the secondary
                    source. We never present speculation or rumours as fact.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    The DC Directory Standard
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Our DC Directory follows a strict evidentiary standard. Every facility listing
                    includes a data source, a last-verified date, and a confidence level. When we are
                    uncertain about a data point, we say so rather than presenting an estimate as fact.
                    The directory is updated regularly, and older claims are re-verified against new
                    evidence.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    Corrections & Updates
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    When we get something wrong, we correct it. If you find an error or outdated
                    information, contact us at{" "}
                    <a
                      href="mailto:elmaccommunicationslimited@gmail.com"
                      className="text-cyan hover:underline"
                    >
                      elmaccommunicationslimited@gmail.com
                    </a>{" "}
                    and we will review and update the content promptly. Significant corrections are noted
                    in the article's verification record.
                  </p>
                </div>
              </div>
            </section>

            {/* Independence */}
            <section className="mb-16">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                Editorial Independence
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Data Centre 254 is not affiliated with, funded by, or influenced by any data centre
                  operator, telecom company, cloud provider, or government body. The platform is
                  independently funded and operated. This independence is core to our value: you can
                  trust that our coverage is not shaped by any commercial relationship.
                </p>
                <p>
                  In the future, the platform may generate revenue through premium reports,
                  advertising, or sponsorships. If and when that happens, any commercial relationships
                  will be clearly disclosed, and they will never influence editorial content. The
                  verification chain and confidence ratings exist precisely to ensure that commercial
                  pressure cannot compromise the integrity of the information.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                Contact & Corrections
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  For corrections, tips, feedback, or collaboration inquiries, use our{" "}
                  <a href="/contact" className="text-cyan hover:underline">contact page</a>{" "}
                  or email directly:
                </p>
                <div className="glass-card rounded-xl p-5 border border-border/50 inline-flex items-center gap-3">
                  <span className="text-cyan">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </span>
                  <a
                    href="mailto:elmaccommunicationslimited@gmail.com"
                    className="text-foreground hover:text-cyan transition-colors font-medium"
                  >
                    elmaccommunicationslimited@gmail.com
                  </a>
                </div>
                <p className="text-sm">
                  We read every message. We may not reply to all of them, but we do review every
                  correction and update claims when new evidence is provided.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
