import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ArtworkGrid from "@/components/artwork/ArtworkGrid";
import { User, Artwork } from "@shared/schema";
import { ArrowLeft, Mail, MapPin, Instagram, Twitter, Globe } from "lucide-react";

interface ArtistPageProps {
  onAddToCart?: (artwork: Artwork) => void;
}

const ArtistPage = ({ onAddToCart }: ArtistPageProps) => {
  const { id } = useParams<{ id: string }>();
  const artistId = parseInt(id);

  // Fetch artist details
  const { data: artist, isLoading: artistLoading, error: artistError } = useQuery<User>({
    queryKey: [`/api/users/${artistId}`],
  });

  // Fetch artist's artworks
  const { data: artworks, isLoading: artworksLoading, error: artworksError } = useQuery<Artwork[]>({
    queryKey: [`/api/artists/${artistId}/artworks`],
    enabled: !!artistId,
  });

  if (artistLoading) {
    return (
      <div className="container mx-auto px-4 py-16 mt-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          
          <div className="flex flex-col md:flex-row gap-10">
            <div className="md:w-1/3 space-y-4">
              <div className="h-40 w-40 bg-gray-200 rounded-full mx-auto"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
              <div className="h-24 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="md:w-2/3 space-y-4">
              <div className="h-10 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-60 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (artistError || !artist) {
    return (
      <div className="container mx-auto px-4 py-16 mt-16 text-center">
        <h1 className="font-heading text-2xl font-bold mb-4">Artist Not Found</h1>
        <p className="text-gray-600 mb-8">The artist you're looking for does not exist or has been removed.</p>
        <Link href="/browse?type=artist">
          <Button className="bg-primary hover:bg-accent text-white font-accent">
            <ArrowLeft className="mr-2 h-4 w-4" /> Browse Artists
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{artist.firstName} {artist.lastName} | Artist Profile | TypeArts</title>
        <meta name="description" content={artist.bio || `Discover artwork by ${artist.firstName} ${artist.lastName}, an artist on TypeArts.`} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 mt-16">
        <div className="mb-4">
          <Link href="/browse?type=artist">
            <span className="text-primary hover:text-accent flex items-center font-medium cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Artists
            </span>
          </Link>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Artist Info Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="flex flex-col items-center mb-6">
                <img 
                  src={artist.profileImageUrl || 'https://via.placeholder.com/150'} 
                  alt={`${artist.firstName} ${artist.lastName}`} 
                  className="w-32 h-32 rounded-full object-cover border-4 border-accent mb-4" 
                />
                <h1 className="font-heading text-2xl font-bold text-center">{artist.firstName} {artist.lastName}</h1>
                
                {artist.location && (
                  <div className="flex items-center text-gray-600 mt-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{artist.location}</span>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700">
                  {artist.bio || "This artist has not provided a bio yet."}
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="font-accent font-semibold mb-3">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-secondary/20 text-primary text-sm px-3 py-1 rounded-full">Abstract</span>
                  <span className="bg-secondary/20 text-primary text-sm px-3 py-1 rounded-full">Mixed Media</span>
                  <span className="bg-secondary/20 text-primary text-sm px-3 py-1 rounded-full">Large Scale</span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button className="bg-primary hover:bg-accent text-white font-accent rounded-full">
                  <Mail className="mr-2 h-4 w-4" /> Contact Artist
                </Button>
                
                <div className="flex justify-center space-x-4 mt-4">
                  <a href="#" className="text-primary hover:text-accent transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-primary hover:text-accent transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-primary hover:text-accent transition-colors">
                    <Globe className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Artist Portfolio */}
          <div className="lg:w-2/3">
            <Tabs defaultValue="artworks" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="artworks" className="font-accent">Artworks</TabsTrigger>
                <TabsTrigger value="exhibitions" className="font-accent">Exhibitions</TabsTrigger>
                <TabsTrigger value="about" className="font-accent">About</TabsTrigger>
              </TabsList>
              
              <TabsContent value="artworks">
                <h2 className="font-heading text-2xl font-bold mb-6">
                  Artworks by {artist.firstName} {artist.lastName}
                </h2>
                
                <ArtworkGrid
                  artworks={artworks || []}
                  isLoading={artworksLoading}
                  error={artworksError}
                  onAddToCart={onAddToCart}
                />
              </TabsContent>
              
              <TabsContent value="exhibitions">
                <h2 className="font-heading text-2xl font-bold mb-6">Exhibitions</h2>
                
                <div className="bg-white rounded-xl p-8 text-center">
                  <p className="text-gray-500">No exhibitions information available yet.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="about">
                <h2 className="font-heading text-2xl font-bold mb-6">About {artist.firstName} {artist.lastName}</h2>
                
                <div className="bg-white rounded-xl p-8 space-y-6">
                  <div>
                    <h3 className="font-accent font-semibold text-lg mb-3">Biography</h3>
                    <p className="text-gray-700">
                      {artist.bio || "This artist has not provided a bio yet."}
                    </p>
                    {artist.username === "johntype" && (
                      <div className="mt-4 bg-secondary/10 p-4 rounded-lg border border-accent/20">
                        <p className="text-gray-700 italic">
                          John Type is one of the co-founders of TypeArts. His abstract stone sculptures from Zimbabwe have influenced our 
                          <Link href="/mission">
                            <a className="text-accent font-semibold mx-1 hover:underline">mission</a>
                          </Link>
                          to connect artists with collectors worldwide in a more meaningful way.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-accent font-semibold text-lg mb-3">Education</h3>
                    <p className="text-gray-700">Information not provided</p>
                  </div>
                  
                  <div>
                    <h3 className="font-accent font-semibold text-lg mb-3">Artist Statement</h3>
                    <p className="text-gray-700">Information not provided</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArtistPage;
