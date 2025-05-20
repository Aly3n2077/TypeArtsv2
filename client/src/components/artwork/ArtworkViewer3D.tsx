import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

interface ArtworkViewer3DProps {
  imageUrl: string;
  title: string;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export default function ArtworkViewer3D({ 
  imageUrl, 
  title,
  fullscreen = false,
  onToggleFullscreen
}: ArtworkViewer3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [lightPosition, setLightPosition] = useState(30);

  // Reset the viewer to default state
  const resetView = () => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
    setLightPosition(30);
  };

  // Handle mouse down for rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastPosition({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse move for rotation
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastPosition.x;
    const deltaY = e.clientY - lastPosition.y;
    
    setRotation({
      x: rotation.x + deltaY * 0.5,
      y: rotation.y + deltaX * 0.5
    });
    
    setLastPosition({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse up to stop rotation
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle zoom in/out
  const handleZoom = (zoomIn: boolean) => {
    setZoom(prev => {
      const newZoom = zoomIn ? prev + 0.1 : prev - 0.1;
      return Math.min(Math.max(newZoom, 0.5), 2.5);
    });
  };

  // Handle light position change
  const handleLightChange = (value: number[]) => {
    setLightPosition(value[0]);
  };

  // Clean up event listeners
  useEffect(() => {
    const handleMouseUpGlobal = () => {
      setIsDragging(false);
    };
    
    window.addEventListener('mouseup', handleMouseUpGlobal);
    
    return () => {
      window.removeEventListener('mouseup', handleMouseUpGlobal);
    };
  }, []);

  return (
    <div 
      className={`relative ${fullscreen ? 'fixed inset-0 z-50 bg-black' : 'h-full w-full'}`}
      style={{ perspective: '1000px' }}
    >
      {/* 3D Viewer Area */}
      <div 
        ref={containerRef}
        className={`h-full w-full flex items-center justify-center overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div 
          className="relative transition-transform"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* The artwork on a "canvas" */}
          <div
            className="relative shadow-xl rounded-md overflow-hidden bg-black"
            style={{
              boxShadow: `${lightPosition - 50}px 20px 60px rgba(0,0,0,0.4)`,
              transition: 'box-shadow 0.3s ease'
            }}
          >
            <div className="aspect-square relative" style={{ minWidth: '300px', maxWidth: '80vh' }}>
              <img 
                src={imageUrl} 
                alt={title}
                className="w-full h-full object-contain"
                style={{ transform: 'translateZ(2px)' }} // Small 3D effect
              />
            </div>
          </div>
        </div>
      </div>

      {/* Controls Panel */}
      <div className={`absolute bottom-4 left-0 right-0 mx-auto w-full max-w-md px-4 ${fullscreen ? 'text-white' : ''}`}>
        <div className="bg-black/20 backdrop-blur-sm rounded-full p-3 flex items-center space-x-3">
          {/* Zoom Controls */}
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
            onClick={() => handleZoom(false)}
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="h-5 w-5" />
          </Button>
          
          <div className="flex-1">
            <Slider
              value={[zoom * 50]}
              max={100}
              min={25}
              step={1}
              onValueChange={(value) => setZoom(value[0] / 50)}
              className="h-1"
            />
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
            onClick={() => handleZoom(true)}
            disabled={zoom >= 2.5}
          >
            <ZoomIn className="h-5 w-5" />
          </Button>
          
          {/* Light direction */}
          <div className="mx-2 h-6 border-r border-white/20"></div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
          >
            <ChevronsLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex-1">
            <Slider
              value={[lightPosition]}
              max={100}
              min={0}
              step={1}
              onValueChange={handleLightChange}
              className="h-1"
            />
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
          >
            <ChevronsRight className="h-5 w-5" />
          </Button>
          
          {/* Reset & Fullscreen Controls */}
          <div className="mx-2 h-6 border-r border-white/20"></div>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
            onClick={resetView}
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
          
          {onToggleFullscreen && (
            <Button 
              variant="ghost" 
              size="icon"
              className="text-white hover:bg-white/20 rounded-full"
              onClick={onToggleFullscreen}
            >
              {fullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>
      
      {/* Title (only in fullscreen) */}
      {fullscreen && (
        <div className="absolute top-4 left-0 right-0 text-center">
          <h2 className="text-white text-xl font-medium">{title}</h2>
        </div>
      )}
    </div>
  );
}