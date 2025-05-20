import { Box, Camera, RotateCw, MonitorSmartphone, SquareEqual, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ARPreview = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="md:w-1/2 order-2 md:order-1">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1580136579312-94651dfd596d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="AR preview of artwork in a living room" 
                className="w-full rounded-xl shadow-lg" 
              />
              
              {/* AR UI Elements */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-heading font-semibold text-dark">AR Preview Active</h4>
                    <p className="text-sm text-gray-600">Viewing "Urban Rhythm" in your space</p>
                  </div>
                  <div className="flex space-x-3">
                    <button className="bg-primary text-white p-2 rounded-full hover:bg-accent transition-colors">
                      <Camera className="h-5 w-5" />
                    </button>
                    <button className="bg-primary text-white p-2 rounded-full hover:bg-accent transition-colors">
                      <RotateCw className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* AR Indicator */}
              <div className="absolute top-4 right-4 bg-accent text-white text-sm font-accent font-semibold px-3 py-1 rounded-full flex items-center">
                <Box className="mr-1 h-4 w-4" />
                AR Mode
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 order-1 md:order-2">
            <span className="text-accent font-accent font-semibold mb-2 block">AUGMENTED REALITY</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-6">See Art in Your Space Before You Buy</h2>
            <p className="text-gray-600 mb-8">
              Our cutting-edge AR technology lets you visualize any artwork in your own environment. See exactly how pieces will look in your space, at true scale and with accurate lighting.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="bg-secondary/30 p-2 rounded-full mr-4 text-primary">
                  <MonitorSmartphone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-accent font-semibold text-dark">MonitorSmartphone-First Experience</h4>
                  <p className="text-sm text-gray-600">Simply point your camera and place artwork anywhere in your space.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-secondary/30 p-2 rounded-full mr-4 text-primary">
                  <SquareEqual className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-accent font-semibold text-dark">True-to-Scale Sizing</h4>
                  <p className="text-sm text-gray-600">See artwork at its actual dimensions to ensure perfect fit.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-secondary/30 p-2 rounded-full mr-4 text-primary">
                  <Share2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-accent font-semibold text-dark">Share & Collaborate</h4>
                  <p className="text-sm text-gray-600">Share AR previews with friends, designers, or partners for feedback.</p>
                </div>
              </div>
            </div>
            
            <Button className="bg-primary hover:bg-accent text-white font-accent font-semibold px-6 py-3 rounded-full transition-colors flex items-center">
              <Box className="mr-2 h-5 w-5" />
              Try AR Preview
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ARPreview;
