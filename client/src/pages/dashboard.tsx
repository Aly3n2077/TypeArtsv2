import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useLocation, Link } from "wouter";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  PlusCircle, 
  Package, 
  Heart, 
  DollarSign,
  BarChart4, 
  Clock, 
  Users, 
  Image as ImageIcon,
  Settings,
  Edit,
  Upload,
  Trash2
} from "lucide-react";
import ArtworkGrid from "@/components/artwork/ArtworkGrid";

export default function Dashboard() {
  const [location, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch current user data - will need to be updated when authentication is implemented
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/users/1"], // This should be the logged-in user's ID
    retry: false,
  });
  
  // Fetch user's artworks if they're an artist
  const { data: artworks, isLoading: artworksLoading } = useQuery({
    queryKey: ["/api/artworks/artist/1"], // This should be the logged-in user's ID
    retry: false,
    enabled: user?.isArtist,
  });
  
  // Fetch user's orders if they're a collector
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/orders/user/1"], // This should be the logged-in user's ID
    retry: false,
    enabled: user?.isCollector,
  });
  
  // Fetch user's favorites
  const { data: favorites, isLoading: favoritesLoading } = useQuery({
    queryKey: ["/api/favorites/user/1"], // This should be the logged-in user's ID
    retry: false,
  });
  
  // Sample stats data - would be fetched from API in a real implementation
  const artistStats = {
    totalSales: 12300,
    artworksCount: artworks?.length || 0,
    viewsThisMonth: 1432,
    followersCount: 87,
    recentSales: [
      { id: 1, title: "Urban Jungle", price: "$950", date: "2023-05-01", buyer: "Alex T." },
      { id: 2, title: "Ocean Whispers", price: "$1,200", date: "2023-04-28", buyer: "Maria L." },
      { id: 3, title: "Neon Dreams", price: "$850", date: "2023-04-22", buyer: "James K." },
    ]
  };
  
  const collectorStats = {
    totalSpent: 4750,
    purchasesCount: orders?.length || 0,
    favoritesCount: favorites?.length || 0,
    recentOrders: [
      { id: 101, title: "Sunset Boulevard", price: "$1,150", date: "2023-05-03", status: "Shipped" },
      { id: 102, title: "Abstract Thoughts", price: "$750", date: "2023-04-20", status: "Delivered" },
      { id: 103, title: "City Lights", price: "$875", date: "2023-04-15", status: "Delivered" },
    ]
  };
  
  if (userLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // For demo purposes, assume user is both artist and collector
  const isArtist = true;
  const isCollector = true;
  
  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Dashboard | TypeArts</title>
        <meta name="description" content="Manage your TypeArts account, view your artworks, sales, purchases and favorites." />
      </Helmet>
      
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="md:w-1/3">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  <AvatarImage src={user?.profileImageUrl || "https://i.pravatar.cc/150?img=32"} alt={user?.username} />
                  <AvatarFallback>{user?.firstName?.charAt(0) || user?.username?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{user?.firstName} {user?.lastName || user?.username}</CardTitle>
                  <CardDescription>
                    {isArtist && isCollector 
                      ? "Artist & Collector" 
                      : isArtist 
                        ? "Artist" 
                        : "Collector"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                <p>{user?.bio || "No bio available"}</p>
                <p className="mt-2"><strong>Location:</strong> {user?.location || "Not specified"}</p>
                <p><strong>Member since:</strong> {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" /> Settings
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" /> Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-2/3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              {isArtist && <TabsTrigger value="artist">Artist Dashboard</TabsTrigger>}
              {isCollector && <TabsTrigger value="collector">Collector Dashboard</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="overview" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <ImageIcon className="h-4 w-4 mr-1 text-primary" /> {isArtist ? "Your Artworks" : "Collection"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{isArtist ? artistStats.artworksCount : collectorStats.purchasesCount}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Heart className="h-4 w-4 mr-1 text-primary" /> Favorites
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{collectorStats.favoritesCount}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-primary" /> 
                      {isArtist ? "Total Sales" : "Total Spent"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      ${isArtist ? artistStats.totalSales.toLocaleString() : collectorStats.totalSpent.toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {isArtist && artistStats.recentSales.slice(0, 3).map(sale => (
                        <div key={sale.id} className="flex justify-between items-center pb-2 border-b">
                          <div>
                            <p className="font-medium">{sale.title} sold for {sale.price}</p>
                            <p className="text-sm text-muted-foreground">To {sale.buyer} on {new Date(sale.date).toLocaleDateString()}</p>
                          </div>
                          <Button variant="ghost" size="sm">View</Button>
                        </div>
                      ))}
                      
                      {isCollector && collectorStats.recentOrders.slice(0, 3).map(order => (
                        <div key={order.id} className="flex justify-between items-center pb-2 border-b">
                          <div>
                            <p className="font-medium">{order.title} - {order.price}</p>
                            <p className="text-sm text-muted-foreground">
                              Ordered on {new Date(order.date).toLocaleDateString()} • {order.status}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">Track</Button>
                        </div>
                      ))}
                      
                      {!isArtist && !isCollector && (
                        <p className="text-center py-4 text-muted-foreground">No recent activity to show.</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View All Activity</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            {isArtist && (
              <TabsContent value="artist" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-primary" /> Total Sales
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">${artistStats.totalSales.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <BarChart4 className="h-4 w-4 mr-1 text-primary" /> Views
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{artistStats.viewsThisMonth.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Users className="h-4 w-4 mr-1 text-primary" /> Followers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{artistStats.followersCount}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-primary" /> Completion Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">98%</p>
                      <Progress value={98} className="h-2 mt-1" />
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Your Artworks</CardTitle>
                        <CardDescription>Manage your portfolio</CardDescription>
                      </div>
                      <Button size="sm">
                        <PlusCircle className="h-4 w-4 mr-1" /> Add New
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {artworksLoading ? (
                        <div className="py-8 flex justify-center">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : artworks && artworks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {artworks.map((artwork: any) => (
                            <Card key={artwork.id}>
                              <div className="aspect-square relative overflow-hidden rounded-t-lg">
                                <img 
                                  src={artwork.imageUrl} 
                                  alt={artwork.title} 
                                  className="w-full h-full object-cover" 
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <Button size="sm" variant="secondary">
                                    <Edit className="h-4 w-4 mr-1" /> Edit
                                  </Button>
                                  <Button size="sm" variant="destructive">
                                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                                  </Button>
                                </div>
                              </div>
                              <CardContent className="p-3">
                                <p className="font-medium truncate">{artwork.title}</p>
                                <p className="text-sm text-muted-foreground">{artwork.price}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 border rounded-lg">
                          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/60 mb-4" />
                          <h3 className="text-lg font-medium mb-2">No artworks yet</h3>
                          <p className="text-muted-foreground mb-4">Start uploading your creations to your portfolio</p>
                          <Button>
                            <Upload className="h-4 w-4 mr-2" /> Upload First Artwork
                          </Button>
                        </div>
                      )}
                    </CardContent>
                    {artworks && artworks.length > 0 && (
                      <CardFooter>
                        <Button variant="outline" className="w-full">View All Artworks</Button>
                      </CardFooter>
                    )}
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {artistStats.recentSales.map(sale => (
                          <div key={sale.id} className="flex justify-between items-center pb-2 border-b">
                            <div>
                              <p className="font-medium">{sale.title} sold for {sale.price}</p>
                              <p className="text-sm text-muted-foreground">To {sale.buyer} on {new Date(sale.date).toLocaleDateString()}</p>
                            </div>
                            <Button variant="ghost" size="sm">View Details</Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">View All Sales</Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            )}
            
            {isCollector && (
              <TabsContent value="collector" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-primary" /> Total Spent
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">${collectorStats.totalSpent.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Package className="h-4 w-4 mr-1 text-primary" /> Purchases
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{collectorStats.purchasesCount}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Heart className="h-4 w-4 mr-1 text-primary" /> Favorites
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{collectorStats.favoritesCount}</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Purchases</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {ordersLoading ? (
                        <div className="py-8 flex justify-center">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : orders && orders.length > 0 ? (
                        <div className="space-y-4">
                          {collectorStats.recentOrders.map(order => (
                            <div key={order.id} className="flex justify-between items-center pb-2 border-b">
                              <div>
                                <p className="font-medium">{order.title} - {order.price}</p>
                                <p className="text-sm text-muted-foreground">
                                  Ordered on {new Date(order.date).toLocaleDateString()} • {order.status}
                                </p>
                              </div>
                              <Button variant="ghost" size="sm">Track Order</Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 border rounded-lg">
                          <Package className="h-12 w-12 mx-auto text-muted-foreground/60 mb-4" />
                          <h3 className="text-lg font-medium mb-2">No purchases yet</h3>
                          <p className="text-muted-foreground mb-4">Browse our collection and start your art journey</p>
                          <Button onClick={() => navigate("/browse")}>
                            Browse Artworks
                          </Button>
                        </div>
                      )}
                    </CardContent>
                    {orders && orders.length > 0 && (
                      <CardFooter>
                        <Button variant="outline" className="w-full">View Order History</Button>
                      </CardFooter>
                    )}
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Your Favorites</CardTitle>
                        <CardDescription>Artworks you've saved</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {favoritesLoading ? (
                        <div className="py-8 flex justify-center">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : favorites && favorites.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {/* This would map over actual favorite artworks */}
                          {[1, 2, 3].map(id => (
                            <Card key={id}>
                              <div className="aspect-square relative overflow-hidden rounded-t-lg">
                                <img 
                                  src={`https://picsum.photos/id/${id + 30}/400`} 
                                  alt="Artwork" 
                                  className="w-full h-full object-cover" 
                                />
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white"
                                >
                                  <Heart className="h-4 w-4 fill-current" />
                                </Button>
                              </div>
                              <CardContent className="p-3">
                                <p className="font-medium truncate">Sample Artwork {id}</p>
                                <p className="text-sm text-muted-foreground">${(id * 100 + 500).toLocaleString()}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 border rounded-lg">
                          <Heart className="h-12 w-12 mx-auto text-muted-foreground/60 mb-4" />
                          <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                          <p className="text-muted-foreground mb-4">Save artworks you love for later</p>
                          <Button onClick={() => navigate("/browse")}>
                            Discover Art
                          </Button>
                        </div>
                      )}
                    </CardContent>
                    {favorites && favorites.length > 0 && (
                      <CardFooter>
                        <Button variant="outline" className="w-full">View All Favorites</Button>
                      </CardFooter>
                    )}
                  </Card>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}