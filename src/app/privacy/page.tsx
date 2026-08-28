import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Data Centre 254 collects, uses, and protects your data — newsletter subscriptions, contact messages, and analytics. Compliant with the Kenya Data Protection Act, 2019.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    title: "1. Who We Are",
    body: [
      "Data Centre 254 (\"DC254\", \"we\", \"us\") is an independent Kenyan educational and research platform explaining the physical infrastructure behind Kenya's digital economy. It is founded and published by Kevin Jonathan Otieno from Nairobi, Kenya.",
      "This policy explains what personal data we collect when you visit data-centers-254.vercel.app, subscribe to our newsletter, or contact us — and the rights you have over that data under the Kenya Data Protection Act, 2019.",
    ],
  },
  {
    title: "2. What We Collect",
    body: [
      "Newsletter subscriptions. When you subscribe to DC254 Brief, we collect your email address and the page or campaign you subscribed from. Subscribers are stored as contacts in Resend, our email service provider. We do not store subscriber data on this website's servers.",
      "Contact form messages. When you contact us through the contact form, we receive your name, email address, subject, and message. This is delivered to our email inbox through Resend and is used solely to respond to you.",
      "Analytics. We use Google Analytics 4 to understand how the site is used — pages visited, approximate location (country/city), device and browser type, and referring sources. Google Analytics may use cookies and collects IP addresses, which Google truncates/anonymises for GA4 properties.",
    ],
  },
  {
    title: "3. What We Do NOT Collect",
    body: [
      "We do not require accounts or logins — DC254 is a read-only publication. We do not collect names, phone numbers, or payment details through this website. We do not sell, rent, or trade your personal data to anyone, and we do not use your data for automated decision-making or profiling.",
    ],
  },
  {
    title: "4. Third-Party Services",
    body: [
      "We rely on a small number of processors to run the site: Vercel (web hosting and content delivery), Resend (newsletter contact storage and email delivery), and Google Analytics 4 (aggregate audience analytics). Each processes data on our instructions under its own privacy terms.",
    ],
  },
  {
    title: "5. Cookies",
    body: [
      "The website itself sets no tracking cookies of its own. The only cookies on this site come from Google Analytics, used to measure aggregate traffic. You can block or delete analytics cookies through your browser settings without losing access to any part of the site.",
    ],
  },
  {
    title: "6. How Long We Keep Data",
    body: [
      "Newsletter contacts are kept until you unsubscribe or ask us to delete them. Contact form correspondence is kept for as long as needed to handle your enquiry and for our records. Analytics data is retained by Google according to its standard retention settings.",
    ],
  },
  {
    title: "7. Your Rights",
    body: [
      "Under the Kenya Data Protection Act, 2019, you have the right to access the personal data we hold about you, to correct inaccurate data, to erasure, to withdraw consent, and to lodge a complaint with the Office of the Data Protection Commissioner (ODPC), Kenya.",
      "To unsubscribe from the newsletter, use the unsubscribe link in any email or contact us directly. For any data request, email elmaccommunicationslimited@gmail.com and we will respond within a reasonable timeframe.",
    ],
  },
  {
    title: "8. Changes to This Policy",
    body: [
      "We may update this policy as the platform grows. Material changes will be reflected on this page with a revised effective date. This policy is effective as of 29 August 2026.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto section-y">
          <p className="text-section-label mb-4">Legal</p>
          <h1 className="text-display-sm text-foreground mb-4">Privacy Policy</h1>
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
                Questions about this policy or your data? Contact Kevin Jonathan Otieno at{" "}
                <a href="mailto:elmaccommunicationslimited@gmail.com" className="text-cyan hover:underline">
                  elmaccommunicationslimited@gmail.com
                </a>{" "}
                — Nairobi, Kenya.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
