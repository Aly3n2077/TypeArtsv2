import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArtworkGrid from "@/components/artwork/ArtworkGrid";
import ArtworkFilters from "@/components/filters/ArtworkFilters";
import { Artwork, Category, User } from "@shared/schema";

const Browse = () => {
  const [location, params] = useLocation();
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedMediums, setSelectedMediums] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("artworks");

  // Parse URL params
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    
    if (type) {
      setActiveTab(type);
    }
    
    if (category) {
      setCategoryFilter(parseInt(category));
    }
  }, [params]);

  // Fetch all artworks
  const { data: artworks, isLoading: artworksLoading, error: artworksError } = useQuery<Artwork[]>({
    queryKey: ['/api/artworks'],
  });

  // Fetch all categories
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Fetch all artists
  const { data: artists, isLoading: artistsLoading, error: artistsError } = useQuery<User[]>({
    queryKey: ['/api/users'],
    select: (users) => users.filter(user => user.isArtist),
  });

  // Filter artworks based on selected filters
  const filteredArtworks = artworks?.filter(artwork => {
    // Filter by category
    if (categoryFilter && !artwork.categoryIds?.includes(categoryFilter)) {
      return false;
    }
    
    // Filter by price range
    const price = parseFloat(artwork.price.toString());
    if (price < priceRange[0] || price > priceRange[1]) {
      return false;
    }
    
    // Filter by medium
    if (selectedMediums.length > 0 && !selectedMediums.includes(artwork.medium || "")) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        artwork.title.toLowerCase().includes(query) ||
        (artwork.description && artwork.description.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  // Get all available mediums from artwork data
  const availableMediums = Array.from(
    new Set(artworks?.map(artwork => artwork.medium).filter(Boolean) as string[])
  );

  // Handle filter changes
  const handleCategoryChange = (categoryId: number | null) => {
    setCategoryFilter(categoryId);
  };

  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range);
  };

  const handleMediumChange = (medium: string) => {
    if (selectedMediums.includes(medium)) {
      setSelectedMediums(selectedMediums.filter(m => m !== medium));
    } else {
      setSelectedMediums([...selectedMediums, medium]);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const clearFilters = () => {
    setCategoryFilter(null);
    setPriceRange([0, 10000]);
    setSelectedMediums([]);
    setSearchQuery("");
  };

  return (
    <>
      <Helmet>
        <title>Browse Art | TypeArts</title>
        <meta name="description" content="Discover exceptional artwork from talented artists around the world. Browse by category, medium, or price range to find the perfect piece for your collection." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16 mt-16">
        <div className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-4">
            {activeTab === "artworks" ? "Discover Artwork" : 
             activeTab === "artist" ? "Discover Artists" :
             "Discover Collections"}
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Browse through our curated selection of exceptional artwork from talented artists worldwide. 
            Use filters to find pieces that match your preferences and aesthetic.
          </p>
        </div>
        
        <Tabs defaultValue="artworks" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="artworks" className="font-accent">Artworks</TabsTrigger>
            <TabsTrigger value="artist" className="font-accent">Artists</TabsTrigger>
            <TabsTrigger value="collection" className="font-accent">Collections</TabsTrigger>
          </TabsList>
          
          <TabsContent value="artworks" className="w-full">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/4">
                <ArtworkFilters
                  categories={categories || []}
                  selectedCategory={categoryFilter}
                  priceRange={priceRange}
                  availableMediums={availableMediums}
                  selectedMediums={selectedMediums}
                  searchQuery={searchQuery}
                  onCategoryChange={handleCategoryChange}
                  onPriceChange={handlePriceChange}
                  onMediumChange={handleMediumChange}
                  onSearchChange={handleSearchChange}
                  onClearFilters={clearFilters}
                />
              </div>
              
              <div className="lg:w-3/4">
                <ArtworkGrid
                  artworks={filteredArtworks || []}
                  isLoading={artworksLoading}
                  error={artworksError}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="artist" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artistsLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 h-80 animate-pulse bg-primary">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-white/30 mr-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-white/30 rounded w-24"></div>
                        <div className="h-3 bg-white/30 rounded w-20"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-white/30 rounded w-full"></div>
                      <div className="h-3 bg-white/30 rounded w-full"></div>
                      <div className="h-3 bg-white/30 rounded w-3/4"></div>
                    </div>
                  </div>
                ))
              ) : artistsError ? (
                <div className="col-span-full text-center py-8 text-red-500">
                  Failed to load artists. Please try again later.
                </div>
              ) : artists?.length === 0 ? (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No artists found.
                </div>
              ) : (
                artists?.map(artist => {
                  // Count artworks for this artist
                  const artistArtworksCount = artworks?.filter(
                    artwork => artwork.artistId === artist.id
                  ).length || 0;
                  
                  return (
                    <div key={artist.id} className="bg-primary">
                      {/* Use the ArtistCard component with proper counts */}
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors">
                        <div className="flex items-center mb-6">
                          <img 
                            src={artist.profileImageUrl || 'https://via.placeholder.com/80'} 
                            alt={`${artist.firstName} ${artist.lastName}`} 
                            className="w-16 h-16 rounded-full object-cover border-2 border-accent mr-4" 
                          />
                          <div>
                            <h3 className="font-heading text-xl font-semibold text-white">{artist.firstName} {artist.lastName}</h3>
                            <p className="text-light/80 text-sm">{artist.location || 'Artist'}</p>
                          </div>
                        </div>
                        
                        <p className="mb-6 text-light/90 line-clamp-3">
                          {artist.bio || 'This artist has not provided a bio yet.'}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="text-sm mr-2 text-white">{artistArtworksCount} works</span>
                          </div>
                          
                          <a href={`/artist/${artist.id}`} className="text-accent hover:text-white transition-colors flex items-center">
                            View Profile 
                            <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="collection" className="w-full">
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Collections feature coming soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Browse;
