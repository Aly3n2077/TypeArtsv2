import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Hero from "@/components/Hero";
import ArtCategories from "@/components/ArtCategories";
import FeaturedArtworks from "@/components/FeaturedArtworks";
import ARPreview from "@/components/ARPreview";
import FeaturedArtists from "@/components/FeaturedArtists";
import HowItWorks from "@/components/HowItWorks";
import CallToAction from "@/components/CallToAction";
import TrendingNow from "@/components/TrendingNow";
import { Helmet } from "react-helmet-async";
import { Artwork } from "@shared/schema";
import { CardsStack } from "@/components/ui/cards-stack";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const Home = () => {
  const [cart, setCart] = useState<Artwork[]>([]);
  const [likedArtworks, setLikedArtworks] = useState<number[]>([]);

  // Fetch featured artworks for the card stack
  const { data: featuredArtworks, isLoading } = useQuery<Artwork[]>({
    queryKey: ['/api/artworks/featured'],
  });

  // Function to handle card swipe votes
  const handleCardVote = (direction: "left" | "right", artwork: Artwork) => {
    if (direction === "right") {
      // Like/Save the artwork
      setLikedArtworks(prev => [...prev, artwork.id]);
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
      <TrendingNow />
      <FeaturedArtworks />
      <ARPreview />
      <FeaturedArtists />
      <HowItWorks />
      <CallToAction />
    </>
  );
};

export default Home;
