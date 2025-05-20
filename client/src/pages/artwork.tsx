import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArtworkDetails from "@/components/artwork/ArtworkDetails";
import { Heart, Share2, Box, ShoppingCart, ArrowLeft } from "lucide-react";
import ArtworkCard from "@/components/artwork/ArtworkCard";
import { Artwork, User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ArtworkPageProps {
  onAddToCart?: (artwork: Artwork) => void;
}

const ArtworkPage = ({ onAddToCart }: ArtworkPageProps) => {
  const { id } = useParams<{ id: string }>();
  const artworkId = parseInt(id);
  const { toast } = useToast();

  // Fetch artwork details
  const { data: artwork, isLoading: artworkLoading, error: artworkError } = useQuery<Artwork & { artist: User }>({
    queryKey: [`/api/artworks/${artworkId}`],
  });

  // Fetch more artworks by the same artist
  const { data: artistArtworks, isLoading: artistArtworksLoading } = useQuery<Artwork[]>({
    queryKey: ['/api/artists', artwork?.artistId, 'artworks'],
    enabled: !!artwork?.artistId,
  });

  // Exclude current artwork from artist's works
  const otherArtistArtworks = artistArtworks?.filter(art => art.id !== artworkId).slice(0, 3);

  const handleAddToCart = () => {
    if (artwork && onAddToCart) {
      onAddToCart(artwork);
      toast({
        title: "Added to cart",
        description: `${artwork.title} has been added to your cart.`,
      });
    }
  };

  if (artworkLoading) {
    return (
      <div className="container mx-auto px-4 py-16 mt-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          
          <div className="flex flex-col md:flex-row gap-10">
            <div className="md:w-1/2 h-96 bg-gray-200 rounded"></div>
            <div className="md:w-1/2 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-10 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-10 bg-gray-200 rounded w-1/4 mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (artworkError || !artwork) {
    return (
      <div className="container mx-auto px-4 py-16 mt-16 text-center">
        <h1 className="font-heading text-2xl font-bold mb-4">Artwork Not Found</h1>
        <p className="text-gray-600 mb-8">The artwork you're looking for does not exist or has been removed.</p>
        <Link href="/browse">
          <Button className="bg-primary hover:bg-accent text-white font-accent">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Browse
          </Button>
        </Link>
      </div>
    );
  }

  const formatPrice = (price: string | number) => {
    return `$${Number(price).toLocaleString()}`;
  };

  const formatDimensions = () => {
    if (!artwork.width && !artwork.height) return "Dimensions not specified";
    
    let dimensions = "";
    if (artwork.width) dimensions += `W: ${artwork.width}"`;
    if (artwork.height) {
      if (dimensions) dimensions += " × ";
      dimensions += `H: ${artwork.height}"`;
    }
    if (artwork.depth) {
      if (dimensions) dimensions += " × ";
      dimensions += `D: ${artwork.depth}"`;
    }
    
    return dimensions;
  };

  return (
    <>
      <Helmet>
        <title>{artwork.title} by {artwork.artist?.firstName} {artwork.artist?.lastName} | TypeArts</title>
        <meta name="description" content={artwork.description || `${artwork.title}, a ${artwork.medium} artwork by ${artwork.artist?.firstName} ${artwork.artist?.lastName}`} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 mt-16">
        <div className="mb-4">
          <Link href="/browse">
            <a className="text-primary hover:text-accent flex items-center font-medium">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Browse
            </a>
          </Link>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Artwork Image */}
          <div className="lg:w-3/5">
            <div className="relative rounded-lg overflow-hidden bg-white shadow-lg">
              <img 
                src={artwork.imageUrl} 
                alt={artwork.title} 
                className="w-full object-contain max-h-[600px]" 
              />
              
              {/* AR Preview Button */}
              <button className="absolute bottom-4 right-4 bg-accent text-white px-3 py-2 rounded-full flex items-center text-sm font-accent font-semibold">
                <Box className="mr-1 h-4 w-4" />
                AR Preview
              </button>
            </div>
          </div>
          
          {/* Artwork Details */}
          <div className="lg:w-2/5">
            <div className="mb-2 flex items-center space-x-2">
              {artwork.isFeatured && (
                <span className="bg-accent/90 text-white text-xs font-accent font-semibold px-3 py-1 rounded-full">
                  Featured
                </span>
              )}
              {artwork.isNew && (
                <span className="bg-success/90 text-white text-xs font-accent font-semibold px-3 py-1 rounded-full">
                  New
                </span>
              )}
            </div>
            
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-2">{artwork.title}</h1>
            
            <div className="mb-6">
              <Link href={`/artist/${artwork.artistId}`}>
                <a className="flex items-center">
                  {artwork.artist?.profileImageUrl && (
                    <img 
                      src={artwork.artist.profileImageUrl} 
                      alt={`${artwork.artist.firstName} ${artwork.artist.lastName}`} 
                      className="w-10 h-10 rounded-full mr-3 object-cover" 
                    />
                  )}
                  <span className="text-primary hover:text-accent transition-colors font-medium">
                    {artwork.artist?.firstName} {artwork.artist?.lastName}
                  </span>
                </a>
              </Link>
            </div>
            
            <div className="text-2xl font-accent font-bold text-accent mb-6">
              {formatPrice(artwork.price)}
            </div>
            
            <div className="mb-8">
              <p className="text-gray-700 mb-4">
                {artwork.description || "No description provided."}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                {artwork.medium && (
                  <div>
                    <p className="text-sm text-gray-500">Medium</p>
                    <p className="font-medium">{artwork.medium}</p>
                  </div>
                )}
                {artwork.style && (
                  <div>
                    <p className="text-sm text-gray-500">Style</p>
                    <p className="font-medium">{artwork.style}</p>
                  </div>
                )}
                {(artwork.width || artwork.height) && (
                  <div>
                    <p className="text-sm text-gray-500">Dimensions</p>
                    <p className="font-medium">{formatDimensions()}</p>
                  </div>
                )}
                {artwork.year && (
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="font-medium">{artwork.year}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col space-y-3 mb-6">
              <Button 
                onClick={handleAddToCart}
                className="bg-primary hover:bg-accent text-white font-accent font-semibold px-8 py-6 rounded-full transition-colors flex items-center justify-center text-base"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1 border-primary text-primary hover:text-accent hover:border-accent rounded-full py-5">
                  <Heart className="mr-2 h-5 w-5" />
                  Save
                </Button>
                <Button variant="outline" className="flex-1 border-primary text-primary hover:text-accent hover:border-accent rounded-full py-5">
                  <Share2 className="mr-2 h-5 w-5" />
                  Share
                </Button>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-heading text-lg font-semibold mb-3">Shipping</h3>
              <p className="text-gray-600 text-sm">
                Ships from {artwork.artist?.location || "artist's location"}.
                Usually ships within 1-2 weeks.
                Free shipping on orders over $1000.
              </p>
            </div>
          </div>
        </div>
        
        {/* Additional Info Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="details" className="font-accent">Details</TabsTrigger>
              <TabsTrigger value="shipping" className="font-accent">Shipping & Returns</TabsTrigger>
              <TabsTrigger value="artist" className="font-accent">About the Artist</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="text-gray-700">
              <ArtworkDetails artwork={artwork} />
            </TabsContent>
            
            <TabsContent value="shipping" className="text-gray-700">
              <div className="max-w-3xl">
                <h3 className="font-heading text-xl font-semibold mb-4">Shipping Information</h3>
                <p className="mb-4">
                  At TypeArts, we work with experienced art handlers to ensure your artwork arrives 
                  safely and in perfect condition.
                </p>
                
                <h4 className="font-accent font-semibold mt-6 mb-2">Shipping Options</h4>
                <ul className="list-disc pl-5 space-y-2 mb-6">
                  <li>Standard Shipping (7-10 business days)</li>
                  <li>Express Shipping (3-5 business days)</li>
                  <li>International Shipping (10-14 business days)</li>
                </ul>
                
                <h4 className="font-accent font-semibold mt-6 mb-2">Returns & Refunds</h4>
                <p className="mb-4">
                  If you're not completely satisfied with your purchase, you may return it within 
                  14 days of delivery. The artwork must be returned in its original packaging and condition.
                </p>
                <p>
                  Please note that shipping costs for returns are the responsibility of the buyer 
                  unless the artwork arrived damaged or was misrepresented.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="artist" className="text-gray-700">
              <div className="max-w-3xl">
                <div className="flex items-start mb-6">
                  {artwork.artist?.profileImageUrl && (
                    <img 
                      src={artwork.artist.profileImageUrl} 
                      alt={`${artwork.artist.firstName} ${artwork.artist.lastName}`} 
                      className="w-24 h-24 rounded-full mr-6 object-cover" 
                    />
                  )}
                  <div>
                    <h3 className="font-heading text-xl font-semibold mb-2">
                      {artwork.artist?.firstName} {artwork.artist?.lastName}
                    </h3>
                    <p className="text-gray-500 mb-4">{artwork.artist?.location}</p>
                    <p className="mb-4">{artwork.artist?.bio || "No artist bio available."}</p>
                    <Link href={`/artist/${artwork.artistId}`}>
                      <a className="text-primary hover:text-accent transition-colors font-medium inline-flex items-center">
                        View Full Profile 
                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* More From This Artist */}
        {otherArtistArtworks && otherArtistArtworks.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-bold text-dark mb-6">
              More from {artwork.artist?.firstName} {artwork.artist?.lastName}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherArtistArtworks.map(otherArtwork => (
                <ArtworkCard key={otherArtwork.id} artwork={otherArtwork} onAddToCart={onAddToCart} />
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Link href={`/artist/${artwork.artistId}`}>
                <a className="inline-block bg-white border border-primary text-primary hover:bg-primary hover:text-white font-accent font-semibold px-8 py-3 rounded-full transition-colors">
                  View All Works by This Artist
                </a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ArtworkPage;
