import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import ArtistCard from "./artist/ArtistCard";
import type { User } from "@shared/schema";

const FeaturedArtists = () => {
  // Fetch all users who are artists
  const { data: artists, isLoading, error } = useQuery<User[]>({
    queryKey: ['/api/users'],
    select: (users) => users.filter(user => user.isArtist),
  });

  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Featured Artists</h2>
          <p className="text-light/80 max-w-2xl mx-auto">Discover extraordinary talent from around the world creating unique and inspiring artwork.</p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 h-64 animate-pulse">
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
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-accent">
            Failed to load artists. Please try again later.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artists?.slice(0, 3).map((artist) => (
                <ArtistCard key={artist.id} artist={artist} artworkCount={20} />
              ))}
            </div>
            
            <div className="mt-10 text-center">
              <Link href="/browse?type=artist">
                <a className="inline-block bg-accent hover:bg-white hover:text-primary text-white font-accent font-semibold px-8 py-3 rounded-full transition-colors">
                  Discover All Artists
                </a>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedArtists;
