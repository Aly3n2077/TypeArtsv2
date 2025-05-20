import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import ArtworkGrid from "@/components/artwork/ArtworkGrid";
import ArtworkCollection from "@/components/artwork/ArtworkCollection";
import ArtworkFilters from "@/components/filters/ArtworkFilters";
import { Artwork, Category, User } from "@shared/schema";
import { Search, Filter, ChevronDown, ArrowDownUp, Grid3X3, LayoutGrid } from 'lucide-react';

const Browse = () => {
  const [location, params] = useLocation();
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedMediums, setSelectedMediums] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("artworks");
  const [viewMode, setViewMode] = useState<"grid" | "gallery">("gallery");
  const [sortOrder, setSortOrder] = useState<string>("newest");

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

  // Get collections from artworks by grouping
  const collections = [
    { id: 1, name: "Abstract Expressions", description: "Bold, abstract works that evoke emotion", imageUrl: "https://picsum.photos/seed/abstract/800/600" },
    { id: 2, name: "Contemporary Portraits", description: "Modern takes on portraiture", imageUrl: "https://picsum.photos/seed/portrait/800/600" },
    { id: 3, name: "Landscapes & Nature", description: "Stunning depictions of natural scenery", imageUrl: "https://picsum.photos/seed/landscape/800/600" },
    { id: 4, name: "Urban Perspectives", description: "City life and architecture", imageUrl: "https://picsum.photos/seed/urban/800/600" },
    { id: 5, name: "Minimalist Art", description: "Simplicity and elegance in form", imageUrl: "https://picsum.photos/seed/minimal/800/600" },
    { id: 6, name: "Experimental Media", description: "Pushing boundaries with mixed media", imageUrl: "https://picsum.photos/seed/experimental/800/600" },
  ];

  // Filter artworks based on selected filters
  const filteredArtworks = artworks?.filter(artwork => {
    // Filter by category
    if (categoryFilter) {
      // Since we don't have direct category information in the artwork data,
      // let's simulate this relationship for demo purposes
      const categoryMatch = artwork.style?.toLowerCase() === 
        categories?.find(c => c.id === categoryFilter)?.name.toLowerCase();
      
      if (!categoryMatch) return false;
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
  
  // Sort artworks based on selection
  const sortedArtworks = filteredArtworks ? [...filteredArtworks].sort((a, b) => {
    switch (sortOrder) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "price_high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "price_low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "title_az":
        return a.title.localeCompare(b.title);
      case "title_za":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  }) : [];

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
      
      <div className="w-full bg-gradient-to-b from-primary/5 to-transparent py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {activeTab === "artworks" ? "Discover Exceptional Artwork" : 
              activeTab === "artist" ? "Meet Our Talented Artists" :
              "Explore Curated Collections"}
            </h1>
            <p className="text-muted-foreground md:text-lg mb-8">
              Browse through our curated selection of exceptional artwork from talented artists worldwide.
              Find pieces that match your preferences and complement your space.
            </p>
            
            <div className="flex flex-wrap gap-3 justify-center">
              {categories?.slice(0, 6).map((category) => (
                <Badge 
                  key={category.id}
                  variant={categoryFilter === category.id ? "default" : "outline"} 
                  className="py-2 px-4 cursor-pointer text-sm"
                  onClick={() => handleCategoryChange(categoryFilter === category.id ? null : category.id)}
                >
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="artworks" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <TabsList className="mb-4 md:mb-0 bg-transparent rounded-none border-b w-full md:w-auto p-0">
              <TabsTrigger value="artworks" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent">Artworks</TabsTrigger>
              <TabsTrigger value="artist" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent">Artists</TabsTrigger>
              <TabsTrigger value="collection" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent">Collections</TabsTrigger>
            </TabsList>

            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {activeTab === "artworks" && (
                <>
                  <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search artworks..." 
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-10 w-full md:w-[200px]"
                    />
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <ArrowDownUp className="h-4 w-4 mr-1" />
                        Sort
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSortOrder("newest")}>
                        Newest First
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
                        Oldest First
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOrder("price_high")}>
                        Price: High to Low
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOrder("price_low")}>
                        Price: Low to High
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOrder("title_az")}>
                        Title: A-Z
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOrder("title_za")}>
                        Title: Z-A
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Filter className="h-4 w-4 mr-1" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[240px]">
                      <div className="p-2">
                        <div className="font-medium mb-2">Price Range</div>
                        <div className="flex items-center justify-between mb-6">
                          <span className="text-sm">${priceRange[0]}</span>
                          <span className="text-sm">${priceRange[1]}</span>
                        </div>
                        <div className="mb-4">
                          <Slider
                            value={priceRange}
                            min={0}
                            max={10000}
                            step={100}
                            onValueChange={(value: number[]) => handlePriceChange(value as [number, number])}
                          />
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="font-medium mb-2">Medium</div>
                        <ScrollArea className="h-[150px]">
                          <div className="space-y-1">
                            {availableMediums.map(medium => (
                              <div key={medium} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`medium-${medium}`}
                                  checked={selectedMediums.includes(medium)}
                                  onChange={() => handleMediumChange(medium)}
                                  className="mr-2"
                                />
                                <label htmlFor={`medium-${medium}`} className="text-sm cursor-pointer">
                                  {medium}
                                </label>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-4"
                          onClick={clearFilters}
                        >
                          Clear Filters
                        </Button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <div className="flex border rounded-md overflow-hidden">
                    <Button 
                      variant={viewMode === "gallery" ? "default" : "ghost"} 
                      size="sm" 
                      className="rounded-none px-2"
                      onClick={() => setViewMode("gallery")}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={viewMode === "grid" ? "default" : "ghost"} 
                      size="sm" 
                      className="rounded-none px-2"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <TabsContent value="artworks" className="w-full">
            {viewMode === "gallery" ? (
              <ArtworkCollection 
                title=""
                artworks={sortedArtworks || []}
              />
            ) : (
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/4">
                  <Card>
                    <CardContent className="p-4">
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
                    </CardContent>
                  </Card>
                </div>
                
                <div className="lg:w-3/4">
                  <ArtworkGrid
                    artworks={sortedArtworks || []}
                    isLoading={artworksLoading}
                    error={artworksError}
                  />
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="artist" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artistsLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="p-6 space-y-4 animate-pulse">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/20" />
                        <div className="space-y-2">
                          <div className="h-4 w-24 rounded bg-primary/20" />
                          <div className="h-3 w-20 rounded bg-primary/20" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 w-full rounded bg-primary/20" />
                        <div className="h-3 w-full rounded bg-primary/20" />
                        <div className="h-3 w-3/4 rounded bg-primary/20" />
                      </div>
                    </div>
                  </Card>
                ))
              ) : artistsError ? (
                <div className="col-span-full text-center py-8 text-destructive">
                  Failed to load artists. Please try again later.
                </div>
              ) : artists?.length === 0 ? (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  No artists found.
                </div>
              ) : (
                artists?.map(artist => {
                  // Count artworks for this artist
                  const artistArtworksCount = artworks?.filter(
                    artwork => artwork.artistId === artist.id
                  ).length || 0;
                  
                  return (
                    <Card key={artist.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-6">
                          <img 
                            src={artist.profileImageUrl || 'https://via.placeholder.com/80'} 
                            alt={`${artist.firstName} ${artist.lastName}`} 
                            className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 mr-4" 
                          />
                          <div>
                            <h3 className="text-xl font-semibold">{artist.firstName} {artist.lastName}</h3>
                            <p className="text-muted-foreground text-sm">{artist.location || 'Artist'}</p>
                          </div>
                        </div>
                        
                        <p className="mb-6 text-muted-foreground line-clamp-3">
                          {artist.bio || 'This artist has not provided a bio yet.'}
                        </p>
                        
                        <div className="flex justify-between items-center">
                          <Badge variant="outline">{artistArtworksCount} works</Badge>
                          
                          <Link href={`/artist/${artist.id}`}>
                            <Button size="sm" variant="outline">View Profile</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="collection" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map(collection => (
                <Card key={collection.id} className="overflow-hidden group">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={collection.imageUrl} 
                      alt={collection.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70"></div>
                    <div className="absolute bottom-0 left-0 p-6">
                      <h3 className="text-xl font-semibold text-white mb-1">{collection.name}</h3>
                      <p className="text-white/80 text-sm line-clamp-2">{collection.description}</p>
                    </div>
                  </div>
                  <CardContent className="p-4 flex justify-between items-center">
                    <Badge>{Math.floor(Math.random() * 35) + 5} artworks</Badge>
                    <Button size="sm" variant="outline">Explore Collection</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Browse;
