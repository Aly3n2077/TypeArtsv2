import { Switch, Route, useParams } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Browse from "@/pages/browse";
import Artwork from "@/pages/artwork";
import Artist from "@/pages/artist";
import Checkout from "@/pages/checkout";
import About from "@/pages/about";
import Dashboard from "@/pages/dashboard";
import Journeys from "@/pages/journeys";
import Mission from "@/pages/mission";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SplashCursor from "@/components/ui/splash-cursor";
import GlassmorphismBackground from "@/components/ui/glassmorphism-background";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/browse" component={Browse} />
      <Route path="/artwork/:id">
        {(params) => <Artwork onAddToCart={() => {}} />}
      </Route>
      <Route path="/artist/:id">
        {(params) => <Artist onAddToCart={() => {}} />}
      </Route>
      <Route path="/checkout">
        {() => <Checkout 
          cart={[]} 
          updateCartItemQuantity={() => {}} 
          removeFromCart={() => {}} 
        />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [user, setUser] = useState<any>(null);
  const [cart, setCart] = useState<any[]>([]);

  // Load user from localStorage on app init
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Login function
  const login = (userData: any) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Add to cart function
  const addToCart = (artwork: any) => {
    // Check if already in cart
    const existingItem = cart.find(item => item.id === artwork.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === artwork.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...artwork, quantity: 1 }]);
    }
  };

  // Remove from cart function
  const removeFromCart = (artworkId: number) => {
    setCart(cart.filter(item => item.id !== artworkId));
  };

  // Update cart item quantity
  const updateCartItemQuantity = (artworkId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(artworkId);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === artworkId 
        ? { ...item, quantity } 
        : item
    ));
  };
  
  // Wrapper components to pass props to routes
  const ArtworkWrapper = () => {
    const { id } = useParams();
    return <Artwork onAddToCart={addToCart} />;
  };

  const ArtistWrapper = () => {
    const { id } = useParams();
    return <Artist onAddToCart={addToCart} />;
  };

  const CheckoutWrapper = () => {
    return <Checkout 
      cart={cart} 
      updateCartItemQuantity={updateCartItemQuantity} 
      removeFromCart={removeFromCart} 
      clearCart={() => setCart([])} 
    />;
  };

  // Router with wrapper components
  const RouterWithProps = () => {
    return (
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/browse" component={Browse} />
        <Route path="/artwork/:id" component={ArtworkWrapper} />
        <Route path="/artist/:id" component={ArtistWrapper} />
        <Route path="/checkout" component={CheckoutWrapper} />
        <Route path="/about" component={About} />
        <Route path="/journeys" component={Journeys} />
        <Route path="/mission" component={Mission} />
        <Route path="/dashboard">
          {() => user ? <Dashboard /> : <NotFound />}
        </Route>
        <Route component={NotFound} />
      </Switch>
    );
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <div className="flex flex-col min-h-screen relative z-10">
            {/* Glassmorphism background effect */}
            <GlassmorphismBackground />
            
            <div className="backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 min-h-screen">
              <Header 
                user={user} 
                onLogin={login} 
                onLogout={logout} 
                cartItemCount={cart.reduce((total, item) => total + item.quantity, 0)} 
              />
              <main className="flex-grow">
                <RouterWithProps />
              </main>
              <Footer />
            </div>
          </div>
          <Toaster />
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
