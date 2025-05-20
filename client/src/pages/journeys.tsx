import { Helmet } from 'react-helmet-async';
import UserJourneyMap from '@/components/journey/UserJourneyMap';

export default function JourneysPage() {
  return (
    <>
      <Helmet>
        <title>User Journeys | TypeArts</title>
        <meta 
          name="description" 
          content="Explore the user journeys for artists, collectors, and administrators in the TypeArts marketplace. See how artwork is created, listed, discovered, and sold."
        />
      </Helmet>
      
      <div className="w-full bg-gradient-to-b from-primary/5 to-transparent py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Platform User Journeys</h1>
            <p className="text-muted-foreground md:text-lg">
              Discover how different users experience the TypeArts marketplace, from creating and 
              listing artwork as an artist to browsing and purchasing as a collector, and managing
              the platform as an administrator.
            </p>
          </div>
        </div>
      </div>
      
      <UserJourneyMap />
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-primary/5 rounded-xl p-8">
            <h3 className="text-xl font-bold mb-4">For Artists</h3>
            <p className="text-muted-foreground mb-6">
              As an artist on TypeArts, you can showcase your work to a global audience, 
              manage listings and sales, and track shipments in one place.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Easy profile setup and artwork listing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Optional NFT creation for digital certification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Simplified shipping and order management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Analytics dashboard for sales performance</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-primary/5 rounded-xl p-8">
            <h3 className="text-xl font-bold mb-4">For Collectors</h3>
            <p className="text-muted-foreground mb-6">
              As a collector, discover exceptional artwork, preview pieces in your space 
              using AR technology, and build your collection with secure purchases.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Advanced search and filtering options</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>AR preview to visualize art in your space</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Multiple payment options including crypto</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Detailed order tracking and history</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-primary/5 rounded-xl p-8">
            <h3 className="text-xl font-bold mb-4">For Administrators</h3>
            <p className="text-muted-foreground mb-6">
              Platform administrators have powerful tools to moderate content, 
              analyze marketplace performance, and resolve user disputes.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Content moderation and artist verification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Comprehensive analytics and reporting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Transaction verification and dispute resolution</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>System configuration and user management</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}