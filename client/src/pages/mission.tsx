import { Helmet } from "react-helmet-async";
import { Link } from "wouter";

export default function MissionPage() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Helmet>
        <title>Our Mission | TypeArts</title>
        <meta name="description" content="TypeArts is a mobile-first, AI-driven global art marketplace built to empower both emerging and established sculptors. Learn about our mission to transform the way art is discovered, collected, and shared worldwide." />
      </Helmet>

      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary">TypeArts Global Art Marketplace</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Connecting talented artists with global collectors</p>
      </header>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">1. Executive Summary</h2>
        <p className="mb-4">
          <strong>TypeArts</strong> is a mobile-first, AI-driven global art marketplace built to empower both emerging and established sculptors, including visionaries like John Type. We connect talented yet underrepresented artists to international collectors through cutting-edge technologies like artificial intelligence, augmented reality, and streamlined cross-border logistics. Our mission is to transform the way art is discovered, collected, and shared worldwide.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">2. The Opportunity</h2>
        <ul className="list-disc list-inside space-y-3 mb-4">
          <li><strong>Explosive Market Growth</strong>: The online art industry surged to $13.3B in 2024, with a compound annual growth rate of 13%, fueled by digital transformation and younger collectors entering the space.</li>
          <li><strong>Untapped Global Talent</strong>: Sculptors like John Type, with world-class artistry and unique narratives, remain largely invisible in mainstream art channels.</li>
          <li><strong>Platform Gap</strong>: No single digital platform currently provides a unified experience for AI-powered art discovery, immersive visualization, end-to-end payments, and international fulfillment—TypeArts fills that void.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">3. The Solution</h2>
        <p className="mb-4"><strong>TypeArts</strong> offers an end-to-end digital ecosystem tailored for the global art community:</p>
        <ul className="list-disc list-inside space-y-3 mb-4">
          <li><strong>AI Discovery Engine</strong> – Advanced algorithms learn user tastes and surface highly relevant, meaningful artworks.</li>
          <li><strong>AR Previews</strong> – See how each sculpture looks in your space via smartphone-based augmented reality.</li>
          <li><strong>Secure Global Payments</strong> – Support for major payment methods including Stripe, PayPal, and cryptocurrency.</li>
          <li><strong>Integrated Global Shipping</strong> – Real-time quotes and tracking via trusted partners like DHL and FedEx.</li>
          <li><strong>NFT Art Drops (Phase 3)</strong> – Introducing digital collectibles and ownership proofs for sculpture collections.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">4. Product Roadmap</h2>
        
        <div className="mb-4">
          <h3 className="text-xl font-medium mb-2">MVP (0–2 Months)</h3>
          <p>Onboard initial artists, enable listings, offer basic search, secure checkout, and simplified shipping interface.</p>
        </div>
        
        <div className="mb-4">
          <h3 className="text-xl font-medium mb-2">Phase 2 (3–4 Months)</h3>
          <p>Integrate AI-powered curation, AR viewer, collector profiles, and community-driven engagement features.</p>
        </div>
        
        <div className="mb-4">
          <h3 className="text-xl font-medium mb-2">Phase 3 (5–7 Months)</h3>
          <p>Launch NFT minting tools, host live-streamed global art auctions, and roll out the Affiliate Art Consultant program.</p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">5. Revenue Model</h2>
        <ul className="list-disc list-inside space-y-3 mb-4">
          <li><strong>Sales Commission</strong> – 5–10% fee on each transaction to fund platform growth.</li>
          <li><strong>Premium Artist Subscriptions</strong> – $20/month for featured placement, analytics, and marketing boosts.</li>
          <li><strong>Shipping Margins</strong> – Small markup on logistics to ensure fast and secure global delivery.</li>
          <li><strong>NFT Minting Fees</strong> – $5 per minted sculpture drop.</li>
        </ul>
        
        <p className="font-medium mt-4">Year 1 Financial Projections:</p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li><strong>Gross Merchandise Volume (GMV):</strong> $1.2M</li>
          <li><strong>Platform Revenue:</strong> Between $120K–$180K, with positive cash flow achievable in Year 2.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">6. Go-To-Market Strategy</h2>
        <ul className="list-disc list-inside space-y-3 mb-4">
          <li><strong>Ambassador Artists</strong> – Leverage storytellers like John Type to represent the platform's artistic soul.</li>
          <li><strong>Social Media Virality</strong> – Launch AR-based Instagram and TikTok filters, connect with design influencers.</li>
          <li><strong>Cultural Event Pop-Ups</strong> – Showcase sculptures at global expos, art fairs, and embassies.</li>
          <li><strong>Performance Marketing</strong> – Highly-targeted digital ads via Meta, TikTok, Google Display Network, and Pinterest.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">7. Competitive Edge</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-slate-800 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100 dark:bg-slate-700">
                <th className="px-4 py-2 text-left">Feature</th>
                <th className="px-4 py-2 text-left">TypeArts</th>
                <th className="px-4 py-2 text-left">Competitors</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b dark:border-slate-600">
                <td className="px-4 py-2">AI Discovery Engine</td>
                <td className="px-4 py-2">Advanced</td>
                <td className="px-4 py-2">Absent or Basic</td>
              </tr>
              <tr className="border-b dark:border-slate-600">
                <td className="px-4 py-2">AR Preview Tech</td>
                <td className="px-4 py-2">Fully Integrated</td>
                <td className="px-4 py-2">Limited or None</td>
              </tr>
              <tr className="border-b dark:border-slate-600">
                <td className="px-4 py-2">Global Shipping</td>
                <td className="px-4 py-2">Built-In, Real-Time</td>
                <td className="px-4 py-2">Disconnected</td>
              </tr>
              <tr className="border-b dark:border-slate-600">
                <td className="px-4 py-2">NFT Integration</td>
                <td className="px-4 py-2">Planned & Scalable</td>
                <td className="px-4 py-2">Minimal Effort</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Mobile-First UX</td>
                <td className="px-4 py-2">Seamless & Intuitive</td>
                <td className="px-4 py-2">Clunky</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">8. Success Metrics</h2>
        <ul className="list-disc list-inside space-y-3 mb-4">
          <li><strong>Artists Onboarded</strong> – 1,000+ active sculptors within 6 months</li>
          <li><strong>Collectors Engaged</strong> – 5,000+ international buyers with verified purchasing power</li>
          <li><strong>Monthly GMV</strong> – $100,000+ in organic art sales</li>
          <li><strong>App Store Rating</strong> – 4.5+ stars on iOS and Android</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">9. Investment Ask</h2>
        <ul className="list-disc list-inside space-y-3 mb-4">
          <li><strong>Seed Round Objective</strong> – $200,000 to finalize core platform, validate global logistics, and kickstart brand presence.</li>
          <li><strong>Equity Exchange</strong> – 15% of founder equity available to mission-aligned investors.</li>
          <li><strong>Operational Runway</strong> – 12 months of lean, high-impact execution.</li>
        </ul>
        
        <p className="font-medium mt-4">Capital Deployment Plan:</p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>40% – Platform Engineering & Feature Development</li>
          <li>30% – Global Growth Campaigns & Partner Outreach</li>
          <li>20% – Fulfillment Operations & Logistics Scaling</li>
          <li>10% – Legal Structure, IP Protection, and Regulatory Compliance</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-primary">10. Contact</h2>
        <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-medium mb-2">John Type – Sculptor & Co-Founder</h3>
          <p className="mb-1"><strong>Phone:</strong> +263 77 233 9516</p>
          <p className="mb-1"><strong>Email:</strong> <a href="mailto:jtypesculptures@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">jtypesculptures@gmail.com</a></p>
          <p><strong>Facebook:</strong> <a href="https://www.facebook.com/jtypesculptures" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">facebook.com/jtypesculptures</a></p>
        </div>
      </section>

      <div className="text-center italic text-gray-600 dark:text-gray-400">
        <p>Thank you for supporting TypeArts—a revolutionary marketplace where collectors discover spiritual elegance, movement, and genius carved in stone.</p>
      </div>

      <div className="mt-10 text-center">
        <Link to="/" className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}