import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { Artwork, User } from "@shared/schema";
import ArtworkCollection from "./artwork/ArtworkCollection";
import ArtworkViewer3D from "./artwork/ArtworkViewer3D";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function TrendingNow() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [fullscreenViewer, setFullscreenViewer] = useState(false);
  
  // Fetch trending artworks (using featured as a proxy for now)
  const { data: artworks, isLoading: artworksLoading } = useQuery<Artwork[]>({
    queryKey: ['/api/artworks/featured'],
  });
  
  // Fetch artists
  const { data: artists } = useQuery<User[]>({
    queryKey: ['/api/users'],
    select: (users) => users.filter(user => user.isArtist),
  });
  
  // Find artist for selected artwork
  const selectedArtist = selectedArtwork 
    ? artists?.find(artist => artist.id === selectedArtwork.artistId)
    : undefined;
  
  return (
    <section className="py-16 bg-gradient-to-b from-primary/5 to-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Trending Now
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Discover the artwork that's capturing attention right now, from established and emerging artists worldwide.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8">
            <ArtworkCollection 
              title="" 
              artworks={artworks || []}
              onAddToCart={() => {}}
            />
          </div>
          
          <div className="md:col-span-4">
            <motion.div 
              className="bg-primary/5 rounded-2xl p-6 h-full flex flex-col"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold mb-4">Experience Art in 3D</h3>
              <p className="text-muted-foreground mb-6">
                Explore our artwork in immersive 3D view. Rotate, zoom, and see details like never before.
              </p>
              
              <div className="flex-1 relative bg-black/5 rounded-lg overflow-hidden mb-6">
                {artworks && artworks.length > 0 ? (
                  <ArtworkViewer3D 
                    imageUrl={selectedArtwork?.imageUrl || artworks[0].imageUrl} 
                    title={selectedArtwork?.title || artworks[0].title}
                    onToggleFullscreen={() => setFullscreenViewer(true)}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {artworks?.slice(0, 4).map((artwork) => (
                  <div 
                    key={artwork.id}
                    className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
                      selectedArtwork?.id === artwork.id ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedArtwork(artwork)}
                  >
                    <img 
                      src={artwork.imageUrl} 
                      alt={artwork.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ))}
              </div>
              
              <Button className="mt-6 w-full" onClick={() => setFullscreenViewer(true)}>
                View in Fullscreen
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Fullscreen 3D Viewer Dialog */}
      <Dialog open={fullscreenViewer} onOpenChange={setFullscreenViewer}>
        <DialogContent className="max-w-6xl w-full h-[90vh] p-0 overflow-hidden bg-black">
          <div className="absolute top-2 right-2 z-10">
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <X className="h-6 w-6" />
              </Button>
            </DialogClose>
          </div>
          
          <div className="h-full">
            <ArtworkViewer3D 
              imageUrl={selectedArtwork?.imageUrl || (artworks && artworks.length > 0 ? artworks[0].imageUrl : '')} 
              title={selectedArtwork?.title || (artworks && artworks.length > 0 ? artworks[0].title : 'Artwork')}
              fullscreen={true}
            />
          </div>
          
          {selectedArtwork && selectedArtist && (
            <div className="absolute left-6 bottom-6 bg-black/40 backdrop-blur-sm text-white p-4 rounded-lg max-w-md">
              <h3 className="font-medium text-lg">{selectedArtwork.title}</h3>
              <p className="text-white/80 text-sm">{selectedArtist.firstName} {selectedArtist.lastName}</p>
              <p className="text-white/70 text-sm mt-1">{selectedArtwork.medium} • {selectedArtwork.width}" × {selectedArtwork.height}"</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="default" className="bg-white/90 text-black hover:bg-white">
                  Add to Cart
                </Button>
                <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  View Details
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}