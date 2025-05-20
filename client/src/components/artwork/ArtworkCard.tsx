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
    <div className="artwork-card">
      <div className="relative overflow-hidden h-64 sm:h-72">
        <img 
          src={artwork.imageUrl} 
          alt={artwork.title} 
          className="w-full h-full object-cover" 
        />
        <div className="overlay opacity-0 absolute inset-0 bg-dark/60 flex items-center justify-center transition-opacity">
          <Link href={`/artwork/${artwork.id}`}>
            <a className="bg-white text-dark hover:bg-accent hover:text-white p-3 rounded-full mr-3 transition-colors">
              <Eye className="h-5 w-5" />
            </a>
          </Link>
          <button className="bg-white text-dark hover:bg-accent hover:text-white p-3 rounded-full transition-colors">
            <Heart className="h-5 w-5" />
          </button>
        </div>
        {artwork.isFeatured && (
          <div className="absolute top-3 right-3">
            <span className="bg-accent/90 text-white text-xs font-accent font-semibold px-3 py-1 rounded-full">
              Featured
            </span>
          </div>
        )}
        {artwork.isNew && (
          <div className="absolute top-3 right-3">
            <span className="bg-success/90 text-white text-xs font-accent font-semibold px-3 py-1 rounded-full">
              New
            </span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-heading text-xl font-semibold">{artwork.title}</h3>
          <div className="text-accent font-accent font-bold">{formatPrice(artwork.price)}</div>
        </div>
        
        <div className="flex items-center mb-4">
          {artist?.profileImageUrl && (
            <img 
              src={artist.profileImageUrl} 
              alt={`${artist.firstName} ${artist.lastName}`} 
              className="w-6 h-6 rounded-full mr-2 object-cover" 
            />
          )}
          <span className="text-sm text-gray-600">
            {artist ? `${artist.firstName} ${artist.lastName}` : 'Artist'}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            {artwork.medium && (
              <span className="bg-secondary/20 text-primary text-xs px-2 py-1 rounded">
                {artwork.medium}
              </span>
            )}
            {artwork.style && (
              <span className="bg-secondary/20 text-primary text-xs px-2 py-1 rounded">
                {artwork.style}
              </span>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="text-primary hover:text-accent transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;
