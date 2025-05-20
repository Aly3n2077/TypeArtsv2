import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Check, 
  ChevronRight,
  Palette, 
  ShoppingBag, 
  Shield,
  Upload,
  CreditCard,
  Truck,
  Search,
  Eye,
  Zap,
  Flag,
  BarChart2,
  MessageCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type JourneyStep = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  substeps?: {
    title: string;
    description: string;
  }[];
};

type JourneyType = {
  title: string;
  description: string;
  icon: React.ReactNode;
  steps: JourneyStep[];
};

export default function UserJourneyMap() {
  const [activeJourney, setActiveJourney] = useState<string>("artist");
  const [activeStep, setActiveStep] = useState<string>("onboarding");

  const journeys: Record<string, JourneyType> = {
    artist: {
      title: "Artist Journey",
      description: "From signing up to shipping your sold artwork",
      icon: <Palette className="h-5 w-5" />,
      steps: [
        {
          id: "onboarding",
          title: "Onboarding",
          description: "Set up your artist profile to start selling",
          icon: <Upload className="h-5 w-5" />,
          substeps: [
            {
              title: "Sign up",
              description: "Create your account with email or social media"
            },
            {
              title: "Complete profile",
              description: "Add your bio, profile picture, and background"
            },
            {
              title: "Set up payment methods",
              description: "Link your bank account or digital wallet"
            }
          ]
        },
        {
          id: "listing",
          title: "Listing Artwork",
          description: "Create detailed listings for your artwork",
          icon: <Upload className="h-5 w-5" />,
          substeps: [
            {
              title: "Create new listing",
              description: "Click 'New Artwork' to begin listing process"
            },
            {
              title: "Add artwork details",
              description: "Enter title, description, medium, dimensions, and price"
            },
            {
              title: "Upload images",
              description: "Upload high-quality images from multiple angles"
            },
            {
              title: "Optional: Create NFT",
              description: "Mint an NFT for your physical artwork on blockchain"
            }
          ]
        },
        {
          id: "shipping",
          title: "Shipping & Fulfillment",
          description: "Manage sales and ship artwork to buyers",
          icon: <Truck className="h-5 w-5" />,
          substeps: [
            {
              title: "Receive sale notification",
              description: "Get notified when your artwork sells"
            },
            {
              title: "Package artwork",
              description: "Carefully package artwork for safe shipment"
            },
            {
              title: "Arrange shipping",
              description: "Enter courier information and get shipping label"
            },
            {
              title: "Update tracking",
              description: "Add tracking number to order and mark as shipped"
            }
          ]
        }
      ]
    },
    collector: {
      title: "Collector Journey",
      description: "From browsing to receiving your purchased artwork",
      icon: <ShoppingBag className="h-5 w-5" />,
      steps: [
        {
          id: "browse",
          title: "Browse & Discover",
          description: "Find artwork that speaks to you",
          icon: <Search className="h-5 w-5" />,
          substeps: [
            {
              title: "Browse gallery",
              description: "Explore artwork by category, style, or medium"
            },
            {
              title: "Search functionality",
              description: "Use filters to find specific types of artwork"
            },
            {
              title: "Save favorites",
              description: "Create a collection of artwork you love"
            }
          ]
        },
        {
          id: "preview",
          title: "AR Preview",
          description: "See how artwork looks in your space",
          icon: <Eye className="h-5 w-5" />,
          substeps: [
            {
              title: "Select artwork",
              description: "Choose an artwork you're interested in"
            },
            {
              title: "Launch AR viewer",
              description: "Tap the AR icon to open augmented reality mode"
            },
            {
              title: "Place in your space",
              description: "Use your camera to place artwork on your wall"
            },
            {
              title: "Adjust and visualize",
              description: "Move and scale to see how it fits in your space"
            }
          ]
        },
        {
          id: "purchase",
          title: "Purchase & Delivery",
          description: "Buy artwork and track your order",
          icon: <CreditCard className="h-5 w-5" />,
          substeps: [
            {
              title: "Add to cart",
              description: "Select artwork and add to your shopping cart"
            },
            {
              title: "Checkout process",
              description: "Enter shipping details and select payment method"
            },
            {
              title: "Complete payment",
              description: "Pay via credit card, PayPal, or cryptocurrency"
            },
            {
              title: "Track shipment",
              description: "Follow your artwork's journey to your door"
            }
          ]
        }
      ]
    },
    admin: {
      title: "Admin Journey",
      description: "Platform management and oversight",
      icon: <Shield className="h-5 w-5" />,
      steps: [
        {
          id: "moderation",
          title: "Content Moderation",
          description: "Review and approve platform content",
          icon: <Flag className="h-5 w-5" />,
          substeps: [
            {
              title: "Review new listings",
              description: "Approve or reject artwork listings based on guidelines"
            },
            {
              title: "Verify artist profiles",
              description: "Authenticate artists and review their credentials"
            },
            {
              title: "Handle reported content",
              description: "Address flagged content and user concerns"
            }
          ]
        },
        {
          id: "analytics",
          title: "Analytics & Reporting",
          description: "Monitor platform performance",
          icon: <BarChart2 className="h-5 w-5" />,
          substeps: [
            {
              title: "Sales performance",
              description: "Track total sales, revenue, and growth metrics"
            },
            {
              title: "User engagement",
              description: "Monitor artist and collector activity and retention"
            },
            {
              title: "Financial reporting",
              description: "Generate payment reports and transaction logs"
            }
          ]
        },
        {
          id: "support",
          title: "Dispute Resolution",
          description: "Handle user issues and disputes",
          icon: <MessageCircle className="h-5 w-5" />,
          substeps: [
            {
              title: "Review disputes",
              description: "Investigate issues between artists and collectors"
            },
            {
              title: "Verify transactions",
              description: "Check payment and shipping records for disputes"
            },
            {
              title: "Resolve and communicate",
              description: "Make decisions and communicate with involved parties"
            },
            {
              title: "Process refunds",
              description: "Issue refunds when necessary through relevant channels"
            }
          ]
        }
      ]
    }
  };

  const selectedJourney = journeys[activeJourney];
  const selectedStep = selectedJourney.steps.find(step => step.id === activeStep);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">User Journey Maps</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore how different users interact with the TypeArts platform,
          from creating and selling artwork to browsing and purchasing pieces.
        </p>
      </div>

      <Tabs 
        value={activeJourney} 
        onValueChange={setActiveJourney}
        className="mx-auto max-w-5xl"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="artist" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden xs:inline">Artist Journey</span>
            <span className="xs:hidden">Artist</span>
          </TabsTrigger>
          <TabsTrigger value="collector" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden xs:inline">Collector Journey</span>
            <span className="xs:hidden">Collector</span>
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden xs:inline">Admin Journey</span>
            <span className="xs:hidden">Admin</span>
          </TabsTrigger>
        </TabsList>

        {Object.entries(journeys).map(([key, journey]) => (
          <TabsContent key={key} value={key} className="mt-8">
            <div className="grid grid-cols-1 gap-8">
              <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="px-0">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    {journey.icon}
                    <span>{journey.title}</span>
                  </CardTitle>
                  <CardDescription className="text-lg">{journey.description}</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                  {/* Journey Steps Visualization */}
                  <div className="flex items-center justify-center mb-8 overflow-x-auto py-4">
                    <div className="flex gap-1 md:gap-2">
                      {journey.steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                          <Button
                            variant={activeStep === step.id ? "default" : "outline"}
                            size="sm"
                            className={`rounded-full h-auto py-2 px-3 md:px-4 flex items-center gap-1 md:gap-2 ${
                              activeStep === step.id ? "shadow-md" : ""
                            }`}
                            onClick={() => setActiveStep(step.id)}
                          >
                            {step.icon}
                            <span className="hidden sm:inline">{step.title}</span>
                            {activeStep === step.id && (
                              <Badge variant="secondary" className="ml-1 bg-white/20 hidden sm:flex">
                                <Check className="h-3 w-3" />
                              </Badge>
                            )}
                          </Button>
                          {index < journey.steps.length - 1 && (
                            <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Selected Step Details */}
                  {selectedStep && (
                    <motion.div
                      key={selectedStep.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-primary/5 rounded-xl p-8"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="bg-primary text-primary-foreground p-3 rounded-full">
                          {selectedStep.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold">{selectedStep.title}</h3>
                          <p className="text-muted-foreground">{selectedStep.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        {selectedStep.substeps?.map((substep, index) => (
                          <Card key={index} className="bg-white">
                            <CardContent className="p-4 md:p-6">
                              <div className="flex items-start gap-3 md:gap-4">
                                <div className="bg-primary/10 text-primary rounded-full p-2 mt-1 flex-shrink-0">
                                  <span className="font-bold text-sm">{index + 1}</span>
                                </div>
                                <div>
                                  <h4 className="font-bold mb-1 text-sm md:text-base">{substep.title}</h4>
                                  <p className="text-muted-foreground text-xs md:text-sm">
                                    {substep.description}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}