import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import EmailCaptureForm from "@/components/email-capture-form";

export const metadata: Metadata = {
  title: "Data Centre Directory - Coming Soon",
  description:
    "The most comprehensive directory of data centres in Kenya and East Africa is launching soon. Get early access to facility listings, pricing intelligence, and infrastructure insights.",
  alternates: { canonical: "https://datacentre254.com/data-centres" },
  openGraph: {
    title: "Data Centre Directory | Data Centre 254",
    description:
      "The definitive directory of data centres in Kenya and East Africa. Launching soon with facility listings, pricing, and connectivity information.",
    siteName: "Data Centre 254",
    type: "website",
    locale: "en_KE",
    images: [{ url: "/images/dc-servers-racks.png", width: 1200, height: 675, alt: "Data Centre 254 — Kenya Data Centres" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Centre Directory | Data Centre 254",
    description:
      "The definitive directory of data centres in Kenya and East Africa. Launching soon.",
    images: ["/images/dc-servers-racks.png"],
  },
};

export default function DataCentresPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
              Coming Soon
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              East Africa's Data Centre
              <span className="block text-blue-400">Intelligence Platform</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              The most comprehensive directory of data centres in Kenya and East Africa. 
              Access verified facility information, pricing intelligence, connectivity options, 
              and sustainability metrics.
            </p>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
              <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">50+ Facilities</h3>
                <p className="text-gray-400 text-sm">Verified data centres across Kenya, Uganda, Tanzania, Rwanda & Ethiopia</p>
              </div>
              
              <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Pricing Intelligence</h3>
                <p className="text-gray-400 text-sm">Colocation costs, power pricing, and TCO calculators</p>
              </div>
              
              <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-700">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Market Insights</h3>
                <p className="text-gray-400 text-sm">Sustainability metrics, outage tracking, and industry analysis</p>
              </div>
            </div>

            {/* Email Capture */}
            <div className="max-w-md mx-auto">
              <EmailCaptureForm 
                campaign="directory-launch"
                title="Get Early Access"
                description="Be the first to know when we launch. Join 500+ industry professionals on our waitlist."
              />
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-gray-800">
              <p className="text-sm text-gray-400 mb-4">Trusted by professionals at</p>
              <div className="flex flex-wrap justify-center items-center gap-6 opacity-60">
                <span className="text-gray-500 font-semibold">Safaricom</span>
                <span className="text-gray-500 font-semibold">Telkom Kenya</span>
                <span className="text-gray-500 font-semibold">Africa Data Centres</span>
                <span className="text-gray-500 font-semibold">Raxio</span>
                <span className="text-gray-500 font-semibold">Equinix</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Teaser */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              While You Wait, Explore Our Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['Beginner', 'Kenya', 'Internet'].map((cluster) => (
                <a
                  key={cluster}
                  href={`/${cluster.toLowerCase()}`}
                  className="group p-6 rounded-xl bg-gray-800 border border-gray-700 hover:border-blue-500 transition-all duration-200"
                >
                  <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 mb-2">
                    {cluster} Guides
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Expert insights on {cluster.toLowerCase()} topics in Kenya's data centre ecosystem
                  </p>
                  <span className="inline-flex items-center text-blue-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Explore →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
