import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Hero from "@/components/Hero";
import ArtCategories from "@/components/ArtCategories";
import FeaturedArtworks from "@/components/FeaturedArtworks";
import ARPreview from "@/components/ARPreview";
import FeaturedArtists from "@/components/FeaturedArtists";
import HowItWorks from "@/components/HowItWorks";
import CallToAction from "@/components/CallToAction";
import TrendingNow from "@/components/TrendingNow";
import ArtSpark from "@/components/ArtSpark";
import { Helmet } from "react-helmet-async";
import { Artwork } from "@shared/schema";
import { CardsStack } from "@/components/ui/cards-stack";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const Home = () => {
  const [cart, setCart] = useState<Artwork[]>([]);
  const [likedArtworks, setLikedArtworks] = useState<number[]>([]);
  const [viewedArtworks, setViewedArtworks] = useState<number[]>([]);

  // Fetch featured artworks for the card stack
  const { data: featuredArtworks, isLoading } = useQuery<Artwork[]>({
    queryKey: ['/api/artworks/featured'],
  });
  
  // Initialize browsing history from local storage
  useEffect(() => {
    const storedLiked = localStorage.getItem('likedArtworks');
    const storedViewed = localStorage.getItem('viewedArtworks');
    
    if (storedLiked) {
      try {
        setLikedArtworks(JSON.parse(storedLiked));
      } catch (e) {
        console.error('Failed to parse liked artworks from localStorage');
      }
    }
    
    if (storedViewed) {
      try {
        setViewedArtworks(JSON.parse(storedViewed));
      } catch (e) {
        console.error('Failed to parse viewed artworks from localStorage');
      }
    }
  }, []);

  // Function to handle card swipe votes
  const handleCardVote = (direction: "left" | "right", artwork: Artwork) => {
    // Track viewed artwork
    if (!viewedArtworks.includes(artwork.id)) {
      const newViewedArtworks = [...viewedArtworks, artwork.id];
      setViewedArtworks(newViewedArtworks);
      // Save to local storage
      localStorage.setItem('viewedArtworks', JSON.stringify(newViewedArtworks));
    }
    
    if (direction === "right") {
      // Like/Save the artwork
      const newLikedArtworks = [...likedArtworks, artwork.id];
      setLikedArtworks(newLikedArtworks);
      // Save to local storage
      localStorage.setItem('likedArtworks', JSON.stringify(newLikedArtworks));
      // Also add to cart if they "liked" it
      addToCart(artwork);
    }
  };

  // Function to add artwork to cart
  const addToCart = (artwork: Artwork) => {
    setCart(prev => {
      // Check if already in cart
      const exists = prev.find(item => item.id === artwork.id);
      if (exists) {
        return prev; // Already in cart, don't add again
      }
      return [...prev, artwork];
    });
  };

  return (
    <>
      <Helmet>
        <title>TypeArts - Global Art Marketplace</title>
        <meta name="description" content="Discover and collect exceptional art from talented artists worldwide. TypeArts connects artists and collectors through innovative technology." />
        <meta property="og:title" content="TypeArts - Global Art Marketplace" />
        <meta property="og:description" content="Discover and collect exceptional art from talented artists worldwide. TypeArts connects artists and collectors through innovative technology." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Hero />
      <ArtCategories />
      
      {/* Interactive artwork discovery carousel */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover New Art</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Swipe through our curated collection and discover artwork that speaks to you.
            Swipe right to like, left to skip.
          </p>
        </div>
        
        <div className="max-w-md mx-auto h-[550px]">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : featuredArtworks && featuredArtworks.length > 0 ? (
            <CardsStack
              onVote={(direction) => {
                if (featuredArtworks[0]) {
                  handleCardVote(direction, featuredArtworks[0]);
                }
              }}
            >
              {featuredArtworks.map((artwork) => (
                <div key={artwork.id} className="w-full h-full flex flex-col">
                  <div className="flex-grow bg-cover bg-center" 
                       style={{ backgroundImage: `url(${artwork.imageUrl})` }}>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-4">
                    <h3 className="text-xl font-bold">{artwork.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">by {typeof artwork.artistId === 'number' ? `Artist #${artwork.artistId}` : 'Unknown Artist'}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-semibold">${artwork.price}</span>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/artwork/${artwork.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardsStack>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center p-8 border border-dashed rounded-lg">
                <p className="text-slate-500 dark:text-slate-400">No artworks found</p>
              </div>
            </div>
          )}
        </div>
      </section>
      
      <TrendingNow />
      <FeaturedArtworks />
      
      {/* Art Spark - AI-powered art recommendation engine */}
      {viewedArtworks.length > 0 && (
        <ArtSpark 
          viewedArtworks={viewedArtworks} 
          likedArtworks={likedArtworks} 
          onAddToCart={addToCart} 
        />
      )}
      
      <ARPreview />
      <FeaturedArtists />
      <HowItWorks />
      <CallToAction />
    </>
  );
};

export default Home;
