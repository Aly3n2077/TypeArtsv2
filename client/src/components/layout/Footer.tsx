import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link href="/">
              <div className="flex items-center space-x-2 mb-6 cursor-pointer">
                <span className="text-white text-2xl font-heading font-bold">TypeArts</span>
              </div>
            </Link>
            <p className="text-light/80 mb-6">
              A global marketplace connecting artists with collectors through innovative technology and seamless logistics.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-light hover:text-accent transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="text-light hover:text-accent transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a href="#" className="text-light hover:text-accent transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-light hover:text-accent transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pinterest">
                  <line x1="12" x2="12" y1="8" y2="16"></line>
                  <line x1="8" x2="16" y1="12" y2="12"></line>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6">For Artists</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-light/80 hover:text-accent transition-colors">Apply to Sell</a></li>
              <li><a href="#" className="text-light/80 hover:text-accent transition-colors">Pricing & Fees</a></li>
              <li><a href="#" className="text-light/80 hover:text-accent transition-colors">Artist Resources</a></li>
              <li><a href="#" className="text-light/80 hover:text-accent transition-colors">Success Stories</a></li>
              <li><a href="#" className="text-light/80 hover:text-accent transition-colors">Artwork Guidelines</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6">For Collectors</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-light/80 hover:text-accent transition-colors">Buy Art</a></li>
              <li><a href="#" className="text-light/80 hover:text-accent transition-colors">AR Preview Guide</a></li>
              <li><a href="#" className="text-light/80 hover:text-accent transition-colors">Shipping Information</a></li>
              <li><a href="#" className="text-light/80 hover:text-accent transition-colors">Returns Policy</a></li>
              <li><a href="#" className="text-light/80 hover:text-accent transition-colors">Collector Benefits</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold text-lg mb-6">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-light/80 hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#" className="text-light/80 hover:text-accent transition-colors">Careers</a></li>
              <li><a href="#" className="text-light/80 hover:text-accent transition-colors">Press</a></li>
              <li><a href="#" className="text-light/80 hover:text-accent transition-colors">Contact</a></li>
              <li><a href="#" className="text-light/80 hover:text-accent transition-colors">Help Center</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-light/60 text-sm">
                &copy; {new Date().getFullYear()} TypeArts. All rights reserved.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#" className="text-light/60 hover:text-accent text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-light/60 hover:text-accent text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-light/60 hover:text-accent text-sm transition-colors">Cookie Policy</a>
              <a href="#" className="text-light/60 hover:text-accent text-sm transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
