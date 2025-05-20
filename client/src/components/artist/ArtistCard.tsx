import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import type { User } from "@shared/schema";

interface ArtistCardProps {
  artist: User;
  artworkCount?: number;
}

const ArtistCard = ({ artist, artworkCount = 0 }: ArtistCardProps) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-colors">
      <div className="flex items-center mb-6">
        <img 
          src={artist.profileImageUrl || 'https://via.placeholder.com/80'} 
          alt={`${artist.firstName} ${artist.lastName}`} 
          className="w-16 h-16 rounded-full object-cover border-2 border-accent mr-4" 
        />
        <div>
          <h3 className="font-heading text-xl font-semibold">{artist.firstName} {artist.lastName}</h3>
          <p className="text-light/80 text-sm">{artist.location || 'Artist'}</p>
        </div>
      </div>
      
      <p className="mb-6 text-light/90">
        {artist.bio || 'This artist has not provided a bio yet.'}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {/* This would ideally come from the artist's specialties or tags */}
        <span className="bg-white/20 text-light text-xs px-2 py-1 rounded">Abstract</span>
        <span className="bg-white/20 text-light text-xs px-2 py-1 rounded">Acrylic</span>
        <span className="bg-white/20 text-light text-xs px-2 py-1 rounded">Large Scale</span>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-sm mr-2">{artworkCount} works</span>
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full border border-primary bg-secondary"></div>
            <div className="w-6 h-6 rounded-full border border-primary bg-accent"></div>
            <div className="w-6 h-6 rounded-full border border-primary bg-light"></div>
          </div>
        </div>
        
        <Link href={`/artist/${artist.id}`}>
          <a className="text-accent hover:text-white transition-colors flex items-center">
            View Profile <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default ArtistCard;
