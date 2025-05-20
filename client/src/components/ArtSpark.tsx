import React, { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Artwork, Category } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CardsStack } from "@/components/ui/cards-stack";
import { ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArtSparkProps {
  viewedArtworks: number[];
  likedArtworks: number[];
  onAddToCart?: (artwork: Artwork) => void;
}

export default function ArtSpark({ viewedArtworks, likedArtworks, onAddToCart }: ArtSparkProps) {
  const [recommendations, setRecommendations] = useState<Artwork[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Fetch all artworks
  const { data: allArtworks, isLoading: isAllArtworksLoading } = useQuery<Artwork[]>({
    queryKey: ['/api/artworks'],
  });
  
  // Fetch all categories
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  // Generate recommendations based on user's browsing history
  useEffect(() => {
    if (!allArtworks || allArtworks.length === 0 || viewedArtworks.length === 0) return;
    
    // Get data for viewed artworks
    const viewed = allArtworks.filter(artwork => viewedArtworks.includes(artwork.id));
    const liked = allArtworks.filter(artwork => likedArtworks.includes(artwork.id));
    
    // Extract attributes from viewed and liked artworks
    const preferredStyles = new Map<string, number>();
    const preferredMediums = new Map<string, number>();
    const preferredArtists = new Map<number, number>();
    const preferredCategories = new Map<number, number>();
    
    // Add higher weight to liked artworks
    const analyzeArtwork = (artwork: Artwork, weight: number) => {
      if (artwork.style) {
        preferredStyles.set(
          artwork.style, 
          (preferredStyles.get(artwork.style) || 0) + weight
        );
      }
      
      if (artwork.medium) {
        preferredMediums.set(
          artwork.medium, 
          (preferredMediums.get(artwork.medium) || 0) + weight
        );
      }
      
      preferredArtists.set(
        artwork.artistId, 
        (preferredArtists.get(artwork.artistId) || 0) + weight
      );
    };
    
    // Analyze viewed artworks with weight 1
    viewed.forEach(artwork => analyzeArtwork(artwork, 1));
    
    // Analyze liked artworks with weight 3 (more important)
    liked.forEach(artwork => analyzeArtwork(artwork, 3));
    
    // Score each artwork based on preferences
    const scoredArtworks = allArtworks
      .filter(artwork => !viewedArtworks.includes(artwork.id)) // Filter out already viewed
      .map(artwork => {
        let score = 0;
        
        // Add points for matching style
        if (artwork.style && preferredStyles.has(artwork.style)) {
          score += preferredStyles.get(artwork.style) || 0;
        }
        
        // Add points for matching medium
        if (artwork.medium && preferredMediums.has(artwork.medium)) {
          score += preferredMediums.get(artwork.medium) || 0;
        }
        
        // Add points for same artist
        if (preferredArtists.has(artwork.artistId)) {
          score += preferredArtists.get(artwork.artistId) || 0;
        }
        
        return { artwork, score };
      })
      .filter(item => item.score > 0) // Only include items with a positive score
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .map(item => item.artwork); // Extract only the artwork
    
    // Select top 10 recommendations
    setRecommendations(scoredArtworks.slice(0, 10));
  }, [allArtworks, viewedArtworks, likedArtworks]);
  
  const handleCardVote = (direction: "left" | "right", artwork: Artwork) => {
    if (direction === "right" && onAddToCart) {
      onAddToCart(artwork);
    }
  };
  
  if (isAllArtworksLoading || isCategoriesLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (recommendations.length === 0) {
    return null; // Don't show anything if no recommendations
  }
  
  return (
    <section className="py-20 px-4 bg-white dark:bg-slate-950">
      <div className="container mx-auto">
        <div className="flex items-center mb-8">
          <Zap className="text-yellow-500 w-8 h-8 mr-3" />
          <h2 className="text-3xl md:text-4xl font-bold">Art Spark</h2>
        </div>
        
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-10">
          Based on your browsing history, we think you might like these artworks. 
          Swipe right to add to cart, left to skip.
        </p>
        
        <div className="max-w-md mx-auto h-[550px]">
          {recommendations.length > 0 ? (
            <CardsStack
              onVote={(direction) => {
                if (recommendations[activeIndex]) {
                  handleCardVote(direction, recommendations[activeIndex]);
                }
                setActiveIndex(prev => Math.min(prev + 1, recommendations.length - 1));
              }}
            >
              {recommendations.map((artwork) => (
                <div key={artwork.id} className="w-full h-full flex flex-col">
                  <div className="flex-grow bg-cover bg-center relative" 
                       style={{ backgroundImage: `url(${artwork.imageUrl})` }}>
                    <div className="absolute top-3 right-3 bg-yellow-500 text-white rounded-full p-1">
                      <Zap className="w-5 h-5" />
                    </div>
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
                <p className="text-slate-500 dark:text-slate-400">
                  Keep browsing to get personalized recommendations
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}