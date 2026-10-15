import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Privacy Policy & Data Practices",
  description:
    "How Data Centre 254 collects, uses, and protects your data: subscriptions, contact messages, analytics. Compliant with the Kenya Data Protection Act.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  {
    title: "1. Who We Are",
    body: [
      "Data Centre 254 (\"DC254\", \"we\", \"us\") is an independent Kenyan educational and research platform explaining the physical infrastructure behind Kenya's digital economy. It is founded and published by Kevin Jonathan Otieno from Nairobi, Kenya.",
      "This policy explains what personal data we collect when you visit data-centers-254.vercel.app, subscribe to our briefing, or contact us, and the rights you have over that data under the Kenya Data Protection Act, 2019.",
    ],
  },
  {
    title: "2. What We Collect",
    body: [
      "Briefing subscriptions. When you subscribe to The Rack Report, our monthly intelligence briefing, we collect your email address, the page or campaign you subscribed from, and an optional, self-declared role descriptor (for example \"investor\" or \"journalist\") and organisation name you may choose to provide. Subscribing is a two-step, double opt-in process: your request is stored locally and a confirmation email is sent with a signed, single-purpose link - your address is only added to the briefing list after you follow that link, and only then is it shared with Resend, our email service provider. The role and organisation fields are entirely optional and are used only in aggregate, anonymised form to describe our audience to prospective sponsors. You can unsubscribe at any time using the link in every briefing email; unsubscribing erases the personal details in your subscription record (email, role, organisation, source) immediately, leaving only an anonymised placeholder so the same address is not counted twice.",
      "Contact form messages. When you contact us through the contact form, we receive your name, email address, subject, and message. This is delivered to our email inbox through Resend and is used solely to respond to you.",
      "Opportunity Brief enquiries. When you request the Kenya Data Centre Opportunity Brief through /opportunity-brief, we collect your name, work email address, and (optionally) your organisation, role, the buyer category you select, the decision question you type, and your preferred format. We use this solely to reply to you, confirm scope and pricing, and deliver the brief you asked about. Enquiries are stored in our hosting infrastructure's data store (Upstash Redis) with a reference number shown to you, are never used for marketing lists, and are automatically erased two years after the enquiry. Asking us to delete an enquiry earlier erases it immediately.",
      "Analytics and consent. We use Google Analytics 4 and Microsoft Clarity to understand aggregate site usage - pages visited, approximate location (country/city), device and browser type, and referring sources, plus Clarity's heatmaps and scroll-depth data. Neither tool loads until you agree through the consent banner shown on your first visit; your choice is stored on your device, applies across visits, and analytics stay off entirely if you decline. The site remains fully functional either way. GA4 may use cookies and collects IP addresses, which Google truncates/anonymises for GA4 properties. Clarity is cookieless, masks all text that visitors type, records no form entries or passwords, and sets no cookies.",
    ],
  },
  {
    title: "3. What We Do NOT Collect",
    body: [
      "We do not require accounts or logins; apart from the briefing subscription and the enquiry forms described above, DC254 is a read-only publication. Apart from those forms, we do not collect names or phone numbers. We do not collect payment details through this website (pilot purchases are invoiced through direct communication instead). We do not sell, rent, or trade your personal data to anyone, and we do not use your data for automated decision-making or profiling.",
    ],
  },
  {
    title: "4. Third-Party Services",
    body: [
      "We rely on a small number of processors to run the site: Vercel (web hosting and content delivery), Upstash (data storage for subscription records, enquiry records, rate-limit counters and aggregate click tallies), Resend (briefing contact storage and email delivery), Google Analytics 4 (aggregate audience analytics), and Microsoft Clarity (cookieless, masked usage analytics). Each processes data on our instructions under its own privacy terms.",
    ],
  },
  {
    title: "5. Cookies",
    body: [
      "The website itself sets no tracking cookies of its own, and no analytics of any kind runs before you consent through the on-site banner. Once you accept, the only cookies on this site come from Google Analytics, used to measure aggregate traffic; Microsoft Clarity, our other analytics tool, is cookieless and sets no cookies at all. You can block or delete analytics cookies through your browser settings, without losing access to any part of the site. To change or withdraw your consent at any time, use the \"Privacy settings\" link in the footer of every page - it re-opens the consent banner so you can accept or decline again, and analytics stop (or start) immediately according to your new choice.",
    ],
  },
  {
    title: "6. How Long We Keep Data",
    body: [
      "Briefing contacts are kept until you unsubscribe or ask us to delete them; unsubscribing erases the personal details of the record immediately, leaving an anonymised placeholder. Unconfirmed (double opt-in) signup requests that are never verified are treated as abandoned and erased automatically after 60 days. Opportunity Brief enquiries are kept for up to two years from the enquiry date, then erased automatically; quote your reference number and we will erase one earlier on request. Contact form correspondence is kept for as long as needed to handle your enquiry and for our records. Analytics data, where consented to, is retained by Google according to its standard retention settings.",
    ],
  },
  {
    title: "7. Your Rights",
    body: [
      "Under the Kenya Data Protection Act, 2019, you have the right to access the personal data we hold about you, to correct inaccurate data, to erasure, to withdraw consent, and to lodge a complaint with the Office of the Data Protection Commissioner (ODPC), Kenya.",
      "To unsubscribe from the briefing, use the unsubscribe link in any briefing email - it takes effect immediately and erases your details from our records - or contact us directly. To change your analytics consent, clear this site's storage in your browser and the banner will reappear. For any data request, email elmaccommunicationslimited@gmail.com and we will respond within a reasonable timeframe.",
    ],
  },
  {
    title: "8. Changes to This Policy",
    body: [
      "We may update this policy as the platform grows. Material changes will be reflected on this page with a revised effective date. This policy was last revised on 15 October 2026.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        <div className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto section-y">
          <p className="text-section-label mb-4">Legal</p>
          <h1 className="text-display-sm text-foreground mb-4">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-12">
            Effective 29 August 2026 · Revised 15 October 2026 · data-centers-254.vercel.app
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
                <a href="mailto:elmaccommunicationslimited@gmail.com" className="text-cyan underline hover:underline">
                  elmaccommunicationslimited@gmail.com
                </a>{", "}
                Nairobi, Kenya.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
