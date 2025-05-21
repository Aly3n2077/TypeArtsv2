import { useState, useRef, useEffect } from "react";
import ArtworkCard from "./ArtworkCard";
import type { Artwork } from "@shared/schema";
import { Pagination } from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight, LayoutGrid, LayoutList } from "lucide-react";

interface ArtworkGridProps {
  artworks: Artwork[];
  isLoading: boolean;
  error: any;
  onAddToCart?: (artwork: Artwork) => void;
}

const ArtworkGrid = ({ artworks, isLoading, error, onAddToCart }: ArtworkGridProps) => {
  const [displayMode, setDisplayMode] = useState<"grid" | "carousel">("carousel");
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleCardIndex, setVisibleCardIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  const itemsPerPage = 9;
  
  // Calculate pagination for grid view
  const totalPages = artworks ? Math.ceil(artworks.length / itemsPerPage) : 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArtworks = artworks?.slice(startIndex, endIndex);
  
  // Check scroll position for carousel navigation
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    
    // Calculate visible card index for dot indicator
    if (scrollContainerRef.current.children.length > 0) {
      const cardWidth = scrollContainerRef.current.children[0].clientWidth;
      const scrollPosition = scrollLeft;
      const index = Math.round(scrollPosition / (cardWidth + 24)); // 24px for gap
      setVisibleCardIndex(Math.min(Math.max(0, index), artworks.length - 1));
    }
  };
  
  // Setup scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      // Initial check
      checkScrollPosition();
    }
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollPosition);
      }
    };
  }, [artworks]);
  
  // Handle pagination for grid view
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Carousel navigation
  const scrollToCard = (index: number) => {
    if (!scrollContainerRef.current || !scrollContainerRef.current.children[index]) return;
    
    const card = scrollContainerRef.current.children[index] as HTMLElement;
    scrollContainerRef.current.scrollTo({
      left: card.offsetLeft - 16, // 16px for padding
      behavior: 'smooth'
    });
    
    setVisibleCardIndex(index);
  };
  
  const scrollLeft = () => {
    const newIndex = Math.max(0, visibleCardIndex - 1);
    scrollToCard(newIndex);
  };
  
  const scrollRight = () => {
    const newIndex = Math.min(artworks.length - 1, visibleCardIndex + 1);
    scrollToCard(newIndex);
  };
  
  // Render loading state
  if (isLoading) {
    return displayMode === "grid" ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {[...Array(6)].map((_, i) => (
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
    ) : (
      <div className="relative mt-4 mb-12">
        <div className="flex overflow-x-auto gap-6 pb-8 px-4 snap-x snap-mandatory hide-scrollbar">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="flex-shrink-0 min-w-[280px] bg-white rounded-xl overflow-hidden shadow-md h-96 animate-pulse" 
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="h-64 bg-gray-200"></div>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Error and empty states
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 text-lg">Error loading artworks. Please try again later.</p>
      </div>
    );
  }
  
  if (!artworks || artworks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No artworks found matching your criteria.</p>
      </div>
    );
  }
  
  return (
    <div>
      {/* View mode toggle */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-heading text-lg">Browse Artworks</h3>
        <div className="flex items-center space-x-2 bg-gray-50 p-1 rounded-full">
          <button 
            onClick={() => setDisplayMode("grid")} 
            className={`p-2 rounded-full ${displayMode === "grid" ? "bg-white shadow-sm text-primary" : "text-gray-500"}`}
            aria-label="Grid view"
          >
            <LayoutGrid size={18} />
          </button>
          <button 
            onClick={() => setDisplayMode("carousel")} 
            className={`p-2 rounded-full ${displayMode === "carousel" ? "bg-white shadow-sm text-primary" : "text-gray-500"}`}
            aria-label="Carousel view"
          >
            <LayoutList size={18} />
          </button>
        </div>
      </div>
      
      {/* Grid View */}
      {displayMode === "grid" ? (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {currentArtworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} onAddToCart={onAddToCart} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <Pagination>
                <Pagination.PrevButton
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                <Pagination.List>
                  {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                </Pagination.List>
                <Pagination.NextButton
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </div>
      ) : (
        /* Carousel View */
        <div className="relative mt-4 mb-12">
          {/* Left Navigation Arrow */}
          {showLeftArrow && (
            <button 
              onClick={scrollLeft}
              className="absolute -left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 transition-all hover:scale-110"
              aria-label="Previous artwork"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
          )}
          
          {/* Horizontal Scrolling Artwork Cards */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-8 px-4 snap-x snap-mandatory hide-scrollbar"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch' 
            }}
          >
            {artworks.map((artwork, index) => (
              <div 
                key={artwork.id}
                className="flex-shrink-0 min-w-[280px] md:min-w-[320px] transition-all duration-300 snap-start"
                style={{ 
                  scrollSnapAlign: 'start',
                  transform: `scale(${index === visibleCardIndex ? '1' : '0.95'})`,
                  opacity: index === visibleCardIndex ? 1 : 0.8,
                }}
              >
                <ArtworkCard 
                  artwork={artwork} 
                  onAddToCart={onAddToCart} 
                />
              </div>
            ))}
          </div>
          
          {/* Right Navigation Arrow */}
          {showRightArrow && (
            <button 
              onClick={scrollRight}
              className="absolute -right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 transition-all hover:scale-110"
              aria-label="Next artwork"
            >
              <ChevronRight size={24} className="text-gray-700" />
            </button>
          )}
          
          {/* Carousel Position Indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {artworks.slice(0, Math.min(artworks.length, 8)).map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToCard(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === visibleCardIndex 
                    ? 'bg-primary w-4' 
                    : 'bg-gray-300'
                }`}
                aria-label={`Go to artwork ${idx + 1}`}
              />
            ))}
            {artworks.length > 8 && <span className="text-xs text-gray-500">...</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtworkGrid;
