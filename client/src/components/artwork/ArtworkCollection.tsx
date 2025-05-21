import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn,
  Heart,
  Share2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Artwork, User } from '@shared/schema';
import { cn } from '@/lib/utils';

interface ArtworkCollectionProps {
  title: string;
  description?: string;
  artworks: Artwork[];
  artist?: User;
  onAddToCart?: (artwork: Artwork) => void;
}

export default function ArtworkCollection({ 
  title, 
  description, 
  artworks, 
  artist,
  onAddToCart 
}: ArtworkCollectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [focusedArtwork, setFocusedArtwork] = useState<Artwork | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [itemWidth, setItemWidth] = useState(300); // Default width
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        setContainerWidth(containerRect.width);
        
        // Calculate item width based on container size (responsive)
        const newItemWidth = containerRect.width < 640 
          ? containerRect.width * 0.85 // Small screens
          : containerRect.width < 1024 
            ? containerRect.width * 0.45 // Medium screens
            : containerRect.width * 0.3; // Large screens
        
        setItemWidth(newItemWidth);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    // Update scroll capability flags
    setCanScrollLeft(currentIndex > 0);
    setCanScrollRight(currentIndex < artworks.length - Math.floor(containerWidth / itemWidth));
  }, [currentIndex, artworks.length, containerWidth, itemWidth]);

  const scrollPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const scrollNext = () => {
    if (currentIndex < artworks.length - Math.floor(containerWidth / itemWidth)) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-baseline mb-6">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          
          {artworks.length > Math.floor(containerWidth / itemWidth) && (
            <div className="flex space-x-2">
              <Button 
                size="icon" 
                variant="outline" 
                className="rounded-full w-10 h-10"
                onClick={scrollPrev}
                disabled={!canScrollLeft}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button 
                size="icon" 
                variant="outline" 
                className="rounded-full w-10 h-10"
                onClick={scrollNext}
                disabled={!canScrollRight}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        <div 
          ref={containerRef} 
          className="relative overflow-hidden"
        >
          <motion.div 
            className="flex" 
            animate={{ x: -currentIndex * itemWidth }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {artworks.map((artwork, idx) => (
              <div
                key={artwork.id}
                className="relative flex-shrink-0 px-2"
                style={{ width: itemWidth }}
              >
                <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg">
                  <div className="relative bg-black aspect-square overflow-hidden">
                    <img 
                      src={artwork.imageUrl} 
                      alt={artwork.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <div className="flex justify-between mb-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50"
                              onClick={() => setFocusedArtwork(artwork)}
                            >
                              <ZoomIn className="h-4 w-4 text-white" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>{artwork.title}</DialogTitle>
                              <DialogDescription>
                                {artist?.firstName} {artist?.lastName} • {artwork.medium}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div className="aspect-square bg-black overflow-hidden rounded-md">
                                <img 
                                  src={artwork.imageUrl} 
                                  alt={artwork.title} 
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="space-y-4">
                                <div>
                                  <h3 className="text-xl font-bold">{artwork.title}</h3>
                                  <p className="text-primary text-xl font-medium">${parseFloat(artwork.price).toLocaleString()}</p>
                                  <div className="flex gap-2 mt-2 flex-wrap">
                                    {artwork.medium && <Badge variant="outline">{artwork.medium}</Badge>}
                                    {artwork.style && <Badge variant="outline">{artwork.style}</Badge>}
                                    {artwork.width && artwork.height && (
                                      <Badge variant="outline">{artwork.width}" × {artwork.height}"</Badge>
                                    )}
                                  </div>
                                </div>
                                
                                <p className="text-muted-foreground">
                                  {artwork.description || "No description available for this artwork."}
                                </p>
                                
                                <div className="pt-4 space-y-2">
                                  <Button 
                                    className="w-full"
                                    onClick={() => onAddToCart && onAddToCart(artwork)}
                                  >
                                    Add to Cart
                                  </Button>
                                  
                                  <div className="flex gap-2">
                                    <Button variant="outline" className="flex-1">
                                      <Heart className="h-4 w-4 mr-2" /> Save
                                    </Button>
                                    <Button variant="outline" className="flex-1">
                                      <Share2 className="h-4 w-4 mr-2" /> Share
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50"
                        >
                          <Heart className="h-4 w-4 text-white" />
                        </Button>
                      </div>
                      
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="w-full"
                        onClick={() => onAddToCart && onAddToCart(artwork)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <Link href={`/artwork/${artwork.id}`}>
                      <div className="block hover:text-primary cursor-pointer">
                        <h3 className="font-medium line-clamp-1">{artwork.title}</h3>
                      </div>
                    </Link>
                    
                    {artist && (
                      <Link href={`/artist/${artist.id}`}>
                        <div className="text-sm text-muted-foreground hover:text-primary cursor-pointer">
                          {artist.firstName} {artist.lastName || ""}
                        </div>
                      </Link>
                    )}
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-medium">${parseFloat(artwork.price).toLocaleString()}</span>
                      <div className="flex space-x-1">
                        {artwork.isFeatured && <Badge variant="secondary" className="px-2 py-0 text-xs">Featured</Badge>}
                        {artwork.isNew && <Badge variant="secondary" className="px-2 py-0 text-xs">New</Badge>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </motion.div>
        </div>
        
        <div className="flex justify-center mt-6">
          <Link href="/browse">
            <div className={cn(
              "inline-flex items-center text-sm font-medium transition-colors cursor-pointer",
              "text-primary hover:text-primary/80"
            )}>
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}