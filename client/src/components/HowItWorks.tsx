import { Search, Box, Truck, Check, ArrowRight } from "lucide-react";
import { Link } from "wouter";

const HowItWorks = () => {
  return (
    <section className="py-16 bg-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-4">How TypeArts Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Our platform makes discovering, experiencing, and collecting art seamless and enjoyable.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <div className="bg-secondary/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-dark mb-4">Discover Art</h3>
            <p className="text-gray-600 mb-4">Browse thousands of original artworks from emerging and established artists worldwide.</p>
            <ul className="text-left text-sm text-gray-600 space-y-2 mb-6">
              <li className="flex items-center">
                <Check className="text-success mr-2 h-4 w-4" />
                AI-powered recommendations
              </li>
              <li className="flex items-center">
                <Check className="text-success mr-2 h-4 w-4" />
                Detailed search filters
              </li>
              <li className="flex items-center">
                <Check className="text-success mr-2 h-4 w-4" />
                Curated collections
              </li>
            </ul>
            <Link href="/browse">
              <a className="text-primary hover:text-accent transition-colors font-accent font-medium inline-flex items-center">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Link>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <div className="bg-secondary/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
              <Box className="h-8 w-8" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-dark mb-4">Experience Art</h3>
            <p className="text-gray-600 mb-4">Visualize artwork in your space with our advanced AR technology before making a purchase.</p>
            <ul className="text-left text-sm text-gray-600 space-y-2 mb-6">
              <li className="flex items-center">
                <Check className="text-success mr-2 h-4 w-4" />
                True-to-scale AR preview
              </li>
              <li className="flex items-center">
                <Check className="text-success mr-2 h-4 w-4" />
                Virtual gallery tours
              </li>
              <li className="flex items-center">
                <Check className="text-success mr-2 h-4 w-4" />
                Artist studio visits
              </li>
            </ul>
            <Link href="/arpreview">
              <a className="text-primary hover:text-accent transition-colors font-accent font-medium inline-flex items-center">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Link>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <div className="bg-secondary/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
              <Truck className="h-8 w-8" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-dark mb-4">Collect Art</h3>
            <p className="text-gray-600 mb-4">Purchase with confidence knowing all logistics and transactions are handled securely.</p>
            <ul className="text-left text-sm text-gray-600 space-y-2 mb-6">
              <li className="flex items-center">
                <Check className="text-success mr-2 h-4 w-4" />
                Secure payment options
              </li>
              <li className="flex items-center">
                <Check className="text-success mr-2 h-4 w-4" />
                Global shipping solutions
              </li>
              <li className="flex items-center">
                <Check className="text-success mr-2 h-4 w-4" />
                Authenticity guarantee
              </li>
            </ul>
            <Link href="/shipping">
              <a className="text-primary hover:text-accent transition-colors font-accent font-medium inline-flex items-center">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
