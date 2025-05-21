import { Link } from "wouter";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-primary pt-20">
      <div className="container mx-auto px-4 py-12 md:py-20 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left z-10 mb-10 md:mb-0">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Discover, Collect<br />Exceptional Art
          </h1>
          <p className="text-light text-lg mb-8 max-w-lg mx-auto md:mx-0">
            Connect with top artists worldwide and build your collection with confidence. Experience art in a whole new dimension.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
            <Link href="/browse">
              <button className="bg-accent hover:bg-accent/90 text-white font-accent font-semibold rounded-full px-8 py-3 transition-colors text-center w-full sm:w-auto">
                Explore Artwork
              </button>
            </Link>
            <Link href="/browse?type=artist">
              <button className="bg-transparent hover:bg-white/10 text-white border border-white font-accent font-semibold rounded-full px-8 py-3 transition-colors text-center w-full sm:w-auto">
                Meet Artists
              </button>
            </Link>
          </div>
        </div>
        
        <div className="md:w-1/2 relative z-10">
          {/* Hero Image Gallery */}
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-8 row-span-2 transform translate-y-8">
              <img 
                src="https://images.unsplash.com/photo-1578301978018-3005759f48f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800" 
                alt="Abstract painting with vibrant colors" 
                className="w-full h-full object-cover rounded-lg shadow-lg" 
              />
            </div>
            <div className="col-span-4 h-48">
              <img 
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200" 
                alt="Portrait painting" 
                className="w-full h-full object-cover rounded-lg shadow-lg" 
              />
            </div>
            <div className="col-span-4 h-48">
              <img 
                src="https://pixabay.com/get/g654040275d5c2acf506c5f81831217b40c0b1b15a7e781878105183d129640c98d86bf3197a7630f92049422b0616304dc7ddc12e62860f35a21a5d2ce3a74ed_1280.jpg" 
                alt="Minimalist sculpture" 
                className="w-full h-full object-cover rounded-lg shadow-lg" 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary opacity-10 rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-accent opacity-10 rounded-tr-full"></div>
    </section>
  );
};

export default Hero;
