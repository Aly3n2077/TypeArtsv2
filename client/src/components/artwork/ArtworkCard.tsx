import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Eye, Heart, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Artwork, User } from "@shared/schema";

interface ArtworkCardProps {
  artwork: Artwork;
  onAddToCart?: (artwork: Artwork) => void;
}

const ArtworkCard = ({ artwork, onAddToCart }: ArtworkCardProps) => {
  const { toast } = useToast();
  
  // Fetch artist details
  const { data: artist } = useQuery<User>({
    queryKey: [`/api/users/${artwork.artistId}`],
  });
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onAddToCart) {
      onAddToCart(artwork);
      
      toast({
        title: "Added to cart",
        description: `${artwork.title} has been added to your cart.`,
      });
    }
  };
  
  const formatPrice = (price: string | number) => {
    return `$${Number(price).toLocaleString()}`;
  };
  
  return (
    <div className="artwork-card group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500">
      <div className="relative overflow-hidden h-64 sm:h-72">
        <img 
          src={artwork.imageUrl} 
          alt={artwork.title} 
          className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105" 
        />
        
        {/* Interactive overlay with buttons */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <Link href={`/artwork/${artwork.id}`}>
              <button 
                className="bg-white text-dark hover:bg-accent hover:text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow hover:shadow-lg"
                style={{ transitionDelay: '0.1s' }}
              >
                <Eye className="h-5 w-5" />
              </button>
            </Link>
            
            <button 
              className="bg-white text-dark hover:bg-accent hover:text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow hover:shadow-lg"
              style={{ transitionDelay: '0.2s' }}
            >
              <Heart className="h-5 w-5" />
            </button>
            
            <button 
              onClick={handleAddToCart}
              className="bg-white text-dark hover:bg-accent hover:text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow hover:shadow-lg"
              style={{ transitionDelay: '0.3s' }}
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {artwork.isFeatured && (
            <span className="bg-accent/90 text-white text-xs font-accent font-semibold px-3 py-1 rounded-full shadow-md transform transition-transform duration-300 group-hover:scale-105">
              Featured
            </span>
          )}
          {artwork.isNew && (
            <span className="bg-success/90 text-white text-xs font-accent font-semibold px-3 py-1 rounded-full shadow-md transform transition-transform duration-300 group-hover:scale-105" style={{ animationDelay: '0.1s' }}>
              New
            </span>
          )}
        </div>
      </div>
      
      <div className="p-5 relative overflow-hidden">
        {/* Subtle accent line that animates on hover */}
        <div className="absolute left-0 top-0 w-0 h-1 bg-accent group-hover:w-full transition-all duration-500 ease-in-out"></div>
        
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-heading text-xl font-semibold group-hover:text-primary transition-colors duration-300">{artwork.title}</h3>
          <div className="text-accent font-accent font-bold transform group-hover:scale-110 transition-transform duration-300">{formatPrice(artwork.price)}</div>
        </div>
        
        <div className="flex items-center mb-4">
          {artist?.profileImageUrl && (
            <div className="relative mr-2 overflow-hidden rounded-full w-6 h-6 border border-transparent group-hover:border-accent/50 transition-all duration-300">
              <img 
                src={artist.profileImageUrl} 
                alt={`${artist.firstName} ${artist.lastName}`} 
                className="w-6 h-6 rounded-full object-cover" 
              />
            </div>
          )}
          <span className="text-sm text-gray-600 group-hover:text-primary/80 transition-colors duration-300">
            {artist ? `${artist.firstName} ${artist.lastName}` : 'Artist'}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-2">
            {artwork.medium && (
              <span className="bg-secondary/20 group-hover:bg-secondary/30 text-primary text-xs px-2 py-1 rounded transition-colors duration-300 transform origin-left hover:scale-105">
                {artwork.medium}
              </span>
            )}
            {artwork.style && (
              <span className="bg-secondary/20 group-hover:bg-secondary/30 text-primary text-xs px-2 py-1 rounded transition-colors duration-300 transform origin-left hover:scale-105">
                {artwork.style}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;
