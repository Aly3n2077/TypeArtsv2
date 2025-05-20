import { Link } from "wouter";
import { UserPlus, Info } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Art Experience?</h2>
            <p className="text-light/90 mb-8 text-lg">
              Join thousands of artists and collectors around the world who are already using TypeArts to discover, experience, and collect exceptional artwork.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/signup">
                <a className="bg-accent hover:bg-white hover:text-primary text-white font-accent font-semibold px-8 py-3 rounded-full transition-colors inline-flex items-center justify-center">
                  <UserPlus className="mr-2 h-5 w-5" /> Create Account
                </a>
              </Link>
              <Link href="/about">
                <a className="bg-transparent hover:bg-white/10 text-white border border-white font-accent font-semibold px-8 py-3 rounded-full transition-colors inline-flex items-center justify-center">
                  <Info className="mr-2 h-5 w-5" /> Learn More
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
