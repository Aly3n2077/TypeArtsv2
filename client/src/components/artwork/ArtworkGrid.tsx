import { useState } from "react";
import ArtworkCard from "./ArtworkCard";
import type { Artwork } from "@shared/schema";
import { Pagination } from "@/components/ui/pagination";

interface ArtworkGridProps {
  artworks: Artwork[];
  isLoading: boolean;
  error: any;
  onAddToCart?: (artwork: Artwork) => void;
}

const ArtworkGrid = ({ artworks, isLoading, error, onAddToCart }: ArtworkGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
  // Calculate pagination
  const totalPages = artworks ? Math.ceil(artworks.length / itemsPerPage) : 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArtworks = artworks?.slice(startIndex, endIndex);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of grid
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (isLoading) {
    return (
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
    );
  }
  
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
  );
};

export default ArtworkGrid;
