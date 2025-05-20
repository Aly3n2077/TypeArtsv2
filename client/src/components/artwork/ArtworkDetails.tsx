import { Artwork, User } from "@shared/schema";

interface ArtworkDetailsProps {
  artwork: Artwork & { artist?: User };
}

const ArtworkDetails = ({ artwork }: ArtworkDetailsProps) => {
  const formatDimensions = () => {
    if (!artwork.width && !artwork.height) return "Dimensions not specified";
    
    let dimensions = "";
    if (artwork.width) dimensions += `Width: ${artwork.width} inches`;
    if (artwork.height) {
      if (dimensions) dimensions += " × ";
      dimensions += `Height: ${artwork.height} inches`;
    }
    if (artwork.depth) {
      if (dimensions) dimensions += " × ";
      dimensions += `Depth: ${artwork.depth} inches`;
    }
    
    return dimensions;
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h3 className="font-heading text-xl font-semibold mb-4">Artwork Details</h3>
        <p className="mb-4">
          {artwork.description || "No detailed description provided for this artwork."}
        </p>
        
        {artwork.style && (
          <p className="mb-2">
            This piece exemplifies the {artwork.style} style, characterized by its unique aesthetic approach and artistic vision.
          </p>
        )}
        
        {artwork.year && (
          <p>
            Created in {artwork.year}, this artwork represents an important moment in the artist's creative journey.
          </p>
        )}
      </div>
      
      <div>
        <h3 className="font-heading text-xl font-semibold mb-4">Technical Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {artwork.medium && (
            <div>
              <h4 className="font-accent font-semibold text-sm text-gray-500">Medium</h4>
              <p>{artwork.medium}</p>
            </div>
          )}
          
          {artwork.style && (
            <div>
              <h4 className="font-accent font-semibold text-sm text-gray-500">Style</h4>
              <p>{artwork.style}</p>
            </div>
          )}
          
          {(artwork.width || artwork.height) && (
            <div>
              <h4 className="font-accent font-semibold text-sm text-gray-500">Dimensions</h4>
              <p>{formatDimensions()}</p>
            </div>
          )}
          
          {artwork.year && (
            <div>
              <h4 className="font-accent font-semibold text-sm text-gray-500">Year</h4>
              <p>{artwork.year}</p>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h3 className="font-heading text-xl font-semibold mb-4">Care Instructions</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Keep artwork away from direct sunlight to prevent fading and damage.
          </li>
          <li>
            Maintain a consistent environment with stable temperature and humidity levels.
          </li>
          <li>
            Dust gently with a soft, clean brush or microfiber cloth.
          </li>
          <li>
            If framed, clean glass with a non-ammonia glass cleaner, spraying the cloth rather than the glass directly.
          </li>
          <li>
            For specific care questions about this piece, please contact the artist directly.
          </li>
        </ul>
      </div>
      
      <div>
        <h3 className="font-heading text-xl font-semibold mb-4">Authenticity</h3>
        <p>
          All artworks on TypeArts come with a certificate of authenticity signed by the artist. 
          This artwork includes proper documentation verifying its provenance and authenticity.
        </p>
      </div>
    </div>
  );
};

export default ArtworkDetails;
