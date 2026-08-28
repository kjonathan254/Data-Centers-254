import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms governing the use of Data Centre 254 — content ownership, permitted use, accuracy disclaimers, and liability. Governed by the laws of Kenya.",
  alternates: { canonical: "/terms" },
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: [
      "By accessing or using Data Centre 254 (\"DC254\", the \"Site\"), you agree to these Terms of Use. If you do not agree, please do not use the Site. We may update these terms from time to time; continued use of the Site after changes constitutes acceptance of the revised terms.",
    ],
  },
  {
    title: "2. About the Site",
    body: [
      "DC254 is an independent Kenyan educational and research platform covering data centres, connectivity, energy, and AI infrastructure. It is published by Kevin Jonathan Otieno, Nairobi, Kenya.",
    ],
  },
  {
    title: "3. Ownership of Content",
    body: [
      "All articles, data compilations, graphics, the DC Directory, and other content on this Site are the intellectual property of Data Centre 254 unless otherwise credited. All rights reserved.",
      "You may quote short excerpts with clear attribution and a link to the original page. You may not republish articles in full, resell our content or data, or use the Site's content or the DC Directory to train machine-learning models or build competing datasets without our prior written permission.",
    ],
  },
  {
    title: "4. Permitted Use",
    body: [
      "You may browse, read, print, and share links to the Site for personal, educational, and professional reference. Commercial reuse, systematic scraping, bulk downloading of the directory or article library, or any use that competes with the Site requires a licence — contact us.",
    ],
  },
  {
    title: "5. Accuracy and No Professional Advice",
    body: [
      "We work hard to verify every claim: articles label statistics as FACT, REPORTED, ESTIMATE, or DC254 DATABASE, with sources and last-verified dates. Even so, the Site is provided \"as is\" for general information and education. It is not engineering, legal, financial, or investment advice, and we make no warranty as to completeness or fitness for a particular purpose. Always verify critical figures with the primary source before acting on them.",
    ],
  },
  {
    title: "6. External Links",
    body: [
      "The Site links to third-party websites and sources. We do not control and are not responsible for their content, availability, or privacy practices.",
    ],
  },
  {
    title: "7. Limitation of Liability",
    body: [
      "To the maximum extent permitted by law, Data Centre 254 and its founder shall not be liable for any indirect, incidental, or consequential loss arising from your use of, or reliance on, the Site or its content.",
    ],
  },
  {
    title: "8. Governing Law",
    body: [
      "These terms are governed by the laws of the Republic of Kenya. Any dispute arising from the use of the Site shall be subject to the exclusive jurisdiction of the Kenyan courts.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto section-y">
          <p className="text-section-label mb-4">Legal</p>
          <h1 className="text-display-sm text-foreground mb-4">Terms of Use</h1>
          <p className="text-sm text-muted-foreground mb-12">
            Effective 29 August 2026 · data-centers-254.vercel.app
          </p>

          <div className="space-y-10">
            {sections.map((s) => (
              <section key={s.title}>
                <h2 className="text-lg font-semibold text-foreground mb-3">{s.title}</h2>
                <div className="space-y-3">
                  {s.body.map((p, i) => (
                    <p key={i} className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            <section className="rounded-xl border border-border/50 bg-accent/30 p-5">
              <h2 className="text-base font-semibold text-foreground mb-2">9. Contact</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Questions about these terms? Contact{" "}
                <a href="mailto:elmaccommunicationslimited@gmail.com" className="text-cyan hover:underline">
                  elmaccommunicationslimited@gmail.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
