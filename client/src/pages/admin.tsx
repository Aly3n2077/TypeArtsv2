import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { format } from "date-fns";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

import {
  BarChart3,
  Users,
  ImageIcon,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  CircleUser,
  Search
} from "lucide-react";

// Sample data for demonstration
const salesData = [
  { month: "Jan", sales: 12000 },
  { month: "Feb", sales: 15000 },
  { month: "Mar", sales: 18000 },
  { month: "Apr", sales: 16000 },
  { month: "May", sales: 21000 },
  { month: "Jun", sales: 19000 },
  { month: "Jul", sales: 25000 },
  { month: "Aug", sales: 30000 },
  { month: "Sep", sales: 28000 },
  { month: "Oct", sales: 31000 },
  { month: "Nov", sales: 34000 },
  { month: "Dec", sales: 40000 }
];

const userGrowthData = [
  { month: "Jan", users: 120 },
  { month: "Feb", users: 150 },
  { month: "Mar", users: 200 },
  { month: "Apr", users: 250 },
  { month: "May", users: 300 },
  { month: "Jun", users: 380 },
  { month: "Jul", users: 450 },
  { month: "Aug", users: 550 },
  { month: "Sep", users: 650 },
  { month: "Oct", users: 700 },
  { month: "Nov", users: 750 },
  { month: "Dec", users: 800 }
];

const categoryData = [
  { name: "Paintings", value: 45 },
  { name: "Photography", value: 20 },
  { name: "Digital Art", value: 15 },
  { name: "Sculpture", value: 10 },
  { name: "Other", value: 10 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const paymentMethodData = [
  { name: "Credit Card", value: 65 },
  { name: "PayPal", value: 20 },
  { name: "Crypto", value: 15 }
];

const pendingApprovals = [
  { 
    id: 1, 
    title: "Urban Serenity", 
    artist: "Emily Chen", 
    submitted: "2023-12-05", 
    type: "Artwork", 
    status: "pending" 
  },
  { 
    id: 2, 
    title: "Ocean Whispers", 
    artist: "Miguel Santos", 
    submitted: "2023-12-04", 
    type: "Artwork", 
    status: "pending" 
  },
  { 
    id: 3, 
    title: "John Anderson", 
    artist: "N/A", 
    submitted: "2023-12-03", 
    type: "Artist Profile", 
    status: "pending" 
  },
  { 
    id: 4, 
    title: "Digital Dreams", 
    artist: "Sarah Johnson", 
    submitted: "2023-12-03", 
    type: "Artwork", 
    status: "pending" 
  },
  { 
    id: 5, 
    title: "Lucia Martinez", 
    artist: "N/A", 
    submitted: "2023-12-02", 
    type: "Artist Profile", 
    status: "pending" 
  }
];

const recentOrders = [
  { 
    id: "#ORD-5391",
    customer: "Alex Thompson",
    date: "2023-12-05",
    artwork: "Midnight Forest",
    artist: "Sarah Johnson",
    amount: "$850.00",
    status: "completed"
  },
  { 
    id: "#ORD-5390",
    customer: "Maria Garcia",
    date: "2023-12-05",
    artwork: "Coastal Breeze",
    artist: "David Chen",
    amount: "$1,200.00",
    status: "processing"
  },
  { 
    id: "#ORD-5389",
    customer: "James Wilson",
    date: "2023-12-04",
    artwork: "Abstract Thoughts",
    artist: "Emily Wong",
    amount: "$750.00",
    status: "completed"
  },
  { 
    id: "#ORD-5388",
    customer: "Emma Davis",
    date: "2023-12-04",
    artwork: "Urban Reflections",
    artist: "Miguel Santos",
    amount: "$950.00",
    status: "completed"
  },
  { 
    id: "#ORD-5387",
    customer: "Omar Kwan",
    date: "2023-12-03",
    artwork: "Sunset Boulevard",
    artist: "Lisa Park",
    amount: "$1,150.00",
    status: "shipped"
  }
];

const disputes = [
  {
    id: "#DSP-123",
    customer: "Rachel Green",
    orderId: "#ORD-5350",
    date: "2023-12-01",
    reason: "Artwork damaged during shipping",
    amount: "$950.00",
    status: "under review"
  },
  {
    id: "#DSP-122",
    customer: "Tom Hanks",
    orderId: "#ORD-5325",
    date: "2023-11-28",
    reason: "Wrong dimensions received",
    amount: "$1,200.00",
    status: "pending resolution"
  },
  {
    id: "#DSP-121",
    customer: "Jennifer Lopez",
    orderId: "#ORD-5318",
    date: "2023-11-26",
    reason: "Payment charged but no confirmation",
    amount: "$750.00",
    status: "resolved"
  }
];

const reportedContent = [
  {
    id: "#RPT-45",
    contentType: "Artwork",
    title: "Freedom Fighter",
    creator: "Anonymous Artist",
    reportReason: "Potentially political content",
    reportedBy: "User ID #3921",
    reportDate: "2023-12-02"
  },
  {
    id: "#RPT-44",
    contentType: "Artist Bio",
    title: "Bio for John Smith",
    creator: "John Smith",
    reportReason: "Contains external links",
    reportedBy: "System Flag",
    reportDate: "2023-12-01"
  },
  {
    id: "#RPT-43",
    contentType: "Comment",
    title: "Comment on 'Ocean View'",
    creator: "User ID #2854",
    reportReason: "Inappropriate language",
    reportedBy: "User ID #4102",
    reportDate: "2023-11-30"
  }
];

export default function AdminDashboard() {
  const [timeframe, setTimeframe] = useState("weekly");
  
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | TypeArts</title>
        <meta 
          name="description" 
          content="TypeArts administrative dashboard for platform management, analytics, and content moderation."
        />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Analytics, moderation, and platform management</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              {format(new Date(), "MMMM d, yyyy")}
            </Button>
            
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="analytics" className="space-y-8">
          <TabsList className="bg-transparent border-b rounded-none w-full justify-start">
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="moderation"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Moderation
            </TabsTrigger>
            <TabsTrigger 
              value="orders"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Orders & Disputes
            </TabsTrigger>
            <TabsTrigger 
              value="users"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none"
            >
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
          </TabsList>
          
          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$259,870</div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span className="text-emerald-500 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      12.5%
                    </span>
                    <span>from last {timeframe}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,283</div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span className="text-emerald-500 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      8.2%
                    </span>
                    <span>from last {timeframe}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Artists</CardTitle>
                  <CircleUser className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">432</div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span className="text-emerald-500 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      5.1%
                    </span>
                    <span>from last {timeframe}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">851</div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span className="text-red-500 flex items-center">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      2.3%
                    </span>
                    <span>from last {timeframe}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>Monthly sales data for the current year</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                        <Bar dataKey="sales" fill="#0088FE" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>Monthly new user registrations</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="users" 
                          stroke="#00C49F" 
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Pie Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                  <CardDescription>Distribution of sales across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Payment methods used by collectors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentMethodData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {paymentMethodData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Platform Statistics</CardTitle>
                  <CardDescription>Key performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Conversion Rate</div>
                      <div className="text-sm font-medium">4.2%</div>
                    </div>
                    <Progress value={42} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Avg. Order Value</div>
                      <div className="text-sm font-medium">$950</div>
                    </div>
                    <Progress value={75} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Customer Retention</div>
                      <div className="text-sm font-medium">68%</div>
                    </div>
                    <Progress value={68} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Dispute Rate</div>
                      <div className="text-sm font-medium">1.2%</div>
                    </div>
                    <Progress value={12} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Moderation Tab */}
          <TabsContent value="moderation" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingApprovals.length}</div>
                  <p className="text-xs text-muted-foreground">Items awaiting review</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reported Content</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportedContent.length}</div>
                  <p className="text-xs text-muted-foreground">Items flagged by users</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Content Processed</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">423</div>
                  <p className="text-xs text-muted-foreground">In the last 30 days</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Content Approval</CardTitle>
                  <CardDescription>New artworks and artist profiles awaiting review</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Artist</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingApprovals.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.title}</TableCell>
                          <TableCell>{item.artist}</TableCell>
                          <TableCell>{format(new Date(item.submitted), "MMM d, yyyy")}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <XCircle className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Reported Content</CardTitle>
                  <CardDescription>Content flagged by users for review</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportedContent.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{report.title}</div>
                              <div className="text-xs text-muted-foreground">{report.contentType} by {report.creator}</div>
                            </div>
                          </TableCell>
                          <TableCell>{report.reportReason}</TableCell>
                          <TableCell>{format(new Date(report.reportDate), "MMM d, yyyy")}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="h-8">
                                Review
                              </Button>
                              <Button size="sm" variant="outline" className="h-8">
                                Dismiss
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Orders & Disputes Tab */}
          <TabsContent value="orders" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest transactions on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Artwork</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>
                            <div>
                              <div>{order.artwork}</div>
                              <div className="text-xs text-muted-foreground">by {order.artist}</div>
                            </div>
                          </TableCell>
                          <TableCell>{order.amount}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.status === "completed" ? "default" :
                                order.status === "processing" ? "outline" :
                                "secondary"
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Active Disputes</CardTitle>
                  <CardDescription>Issues requiring admin attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {disputes.map((dispute) => (
                        <TableRow key={dispute.id}>
                          <TableCell className="font-medium">{dispute.id}</TableCell>
                          <TableCell>{dispute.customer}</TableCell>
                          <TableCell>{dispute.reason}</TableCell>
                          <TableCell>{dispute.amount}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                dispute.status === "resolved" ? "default" :
                                dispute.status === "under review" ? "outline" :
                                "secondary"
                              }
                            >
                              {dispute.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
                <CardDescription>Overview of platform financial activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm">Total Processed</p>
                    <div className="text-2xl font-bold">$259,870</div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      12.5% increase this {timeframe}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm">Average Order Value</p>
                    <div className="text-2xl font-bold">$950</div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      3.2% increase this {timeframe}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm">Pending Payouts</p>
                    <div className="text-2xl font-bold">$45,320</div>
                    <p className="text-xs text-muted-foreground">
                      To be processed within 7 days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Users Tab */}
          <TabsContent value="users" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5,274</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    8.2% increase this month
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Artists</CardTitle>
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">432</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    5.1% increase this month
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Collectors</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,987</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    9.3% increase this month
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage users and their roles</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Search users..."
                      className="border rounded-md pl-10 pr-4 py-2 text-sm w-60"
                    />
                  </div>
                  <Button size="sm">Add User</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { 
                        name: "Sarah Johnson", 
                        email: "sarah@example.com", 
                        role: "Artist", 
                        status: "Active", 
                        joined: "2023-05-15",
                        avatar: "https://i.pravatar.cc/150?img=32"
                      },
                      { 
                        name: "Michael Chen", 
                        email: "michael@example.com", 
                        role: "Collector", 
                        status: "Active", 
                        joined: "2023-07-22",
                        avatar: "https://i.pravatar.cc/150?img=60"
                      },
                      { 
                        name: "Emily Wong", 
                        email: "emily@example.com", 
                        role: "Artist", 
                        status: "Active", 
                        joined: "2023-08-30",
                        avatar: "https://i.pravatar.cc/150?img=23"
                      },
                      { 
                        name: "James Wilson", 
                        email: "james@example.com", 
                        role: "Collector", 
                        status: "Inactive", 
                        joined: "2023-04-12",
                        avatar: "https://i.pravatar.cc/150?img=52"
                      },
                      { 
                        name: "Lisa Park", 
                        email: "lisa@example.com", 
                        role: "Artist", 
                        status: "Active", 
                        joined: "2023-10-05",
                        avatar: "https://i.pravatar.cc/150?img=44"
                      }
                    ].map((user, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "Artist" ? "default" : "secondary"}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={user.status === "Active" ? "outline" : "secondary"}
                            className={user.status === "Active" ? "bg-green-50 text-green-700 border-green-200" : ""}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(user.joined), "MMM d, yyyy")}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">View</Button>
                            <Button size="sm" variant="outline">Edit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}