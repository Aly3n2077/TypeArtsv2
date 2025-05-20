import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import ArtworkCard from "./artwork/ArtworkCard";
import { Artwork } from "@shared/schema";
import { ArrowLeft, ArrowRight } from "lucide-react";

const FeaturedArtworks = () => {
  const { data: artworks, isLoading, error } = useQuery<Artwork[]>({
    queryKey: ['/api/artworks/featured']
  });
  
  const [visibleArtworks, setVisibleArtworks] = useState<Artwork[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  
  useEffect(() => {
    if (artworks) {
      setVisibleArtworks(artworks.slice(currentIndex, currentIndex + itemsPerPage));
    }
  }, [artworks, currentIndex]);
  
  const handleNext = () => {
    if (artworks && currentIndex + itemsPerPage < artworks.length) {
      setCurrentIndex(currentIndex + itemsPerPage);
    }
  };
  
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - itemsPerPage);
    }
  };

  return (
    <section className="py-16 bg-light">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-4">Featured Artworks</h2>
            <p className="text-gray-600 max-w-2xl">Handpicked selections curated by our team of art specialists.</p>
          </div>
          
          <div className="hidden md:block">
            <div className="flex space-x-3">
              <button 
                onClick={handlePrev} 
                disabled={currentIndex === 0}
                className={`p-3 rounded-full bg-white shadow-sm hover:bg-primary hover:text-white transition-colors ${
                  currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={handleNext} 
                disabled={!artworks || currentIndex + itemsPerPage >= artworks.length}
                className={`p-3 rounded-full bg-white shadow-sm hover:bg-primary hover:text-white transition-colors ${
                  !artworks || currentIndex + itemsPerPage >= artworks.length ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-md h-96 animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Failed to load artworks. Please try again later.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {visibleArtworks?.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Link href="/browse">
                <a className="inline-block bg-primary hover:bg-accent text-white font-accent font-semibold px-8 py-3 rounded-full transition-colors">
                  View All Artworks
                </a>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedArtworks;
