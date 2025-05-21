import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ShoppingCart, Menu, X } from "lucide-react";

interface HeaderProps {
  user: any;
  onLogin: (userData: any) => void;
  onLogout: () => void;
  cartItemCount: number;
}

const Header = ({ user, onLogin, onLogout, cartItemCount }: HeaderProps) => {
  const [location] = useLocation();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isArtist, setIsArtist] = useState(false);
  
  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleLogin = async () => {
    try {
      const response = await apiRequest("POST", "/api/users/login", { email, password });
      const userData = await response.json();
      
      onLogin(userData);
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.firstName || userData.username}!`,
      });
      
      // Reset form
      setEmail("");
      setPassword("");
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleRegister = async () => {
    try {
      const response = await apiRequest("POST", "/api/users/register", {
        email,
        password,
        username,
        firstName,
        lastName,
        isArtist,
        isCollector: true,
      });
      
      if (response.ok) {
        toast({
          title: "Registration successful",
          description: "Your account has been created. Please log in.",
        });
        
        // Switch to login mode
        setIsLoginMode(true);
        
        // Reset form
        setEmail("");
        setPassword("");
        setUsername("");
        setFirstName("");
        setLastName("");
        setIsArtist(false);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4 relative">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="text-primary text-2xl font-heading font-bold">TypeArts</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/browse">
              <div className={`text-dark hover:text-accent font-accent font-medium cursor-pointer ${location === '/browse' ? 'text-accent' : ''}`}>
                Discover
              </div>
            </Link>
            <Link href="/browse?type=artist">
              <div className={`text-dark hover:text-accent font-accent font-medium cursor-pointer ${location.includes('type=artist') ? 'text-accent' : ''}`}>
                Artists
              </div>
            </Link>
            <Link href="/browse?type=collection">
              <div className={`text-dark hover:text-accent font-accent font-medium cursor-pointer ${location.includes('type=collection') ? 'text-accent' : ''}`}>
                Collections
              </div>
            </Link>
            <Link href="/journeys">
              <div className={`text-dark hover:text-accent font-accent font-medium cursor-pointer ${location === '/journeys' ? 'text-accent' : ''}`}>
                How It Works
              </div>
            </Link>
            <Link href="/mission">
              <div className={`text-dark hover:text-accent font-accent font-medium cursor-pointer ${location === '/mission' ? 'text-accent' : ''}`}>
                Our Mission
              </div>
            </Link>
            <Link href="/about">
              <div className={`text-dark hover:text-accent font-accent font-medium cursor-pointer ${location === '/about' ? 'text-accent' : ''}`}>
                About
              </div>
            </Link>
            {user && (
              <Link href="/dashboard">
                <div className={`text-dark hover:text-accent font-accent font-medium cursor-pointer ${location === '/dashboard' ? 'text-accent' : ''}`}>
                  Dashboard
                </div>
              </Link>
            )}
          </nav>
          
          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/cart">
                  <div className="relative cursor-pointer">
                    <ShoppingCart className="text-primary hover:text-accent transition-colors" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </div>
                </Link>
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-medium">
                    {user.firstName || user.username}
                  </div>
                  <button
                    onClick={onLogout}
                    className="bg-white text-primary hover:text-accent border border-primary rounded-full px-6 py-2 font-accent font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="bg-white text-primary hover:text-accent border border-primary rounded-full px-6 py-2 font-accent font-medium transition-colors">
                      Sign In
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="font-heading text-2xl">
                        {isLoginMode ? "Sign In" : "Create Account"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      {isLoginMode ? (
                        // Login Form
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="your@email.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                              id="password"
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <Button
                            className="w-full bg-primary hover:bg-accent rounded-full"
                            onClick={handleLogin}
                          >
                            Sign In
                          </Button>
                          <div className="text-center text-sm">
                            Don't have an account?{" "}
                            <button
                              className="text-primary hover:text-accent font-medium"
                              onClick={() => setIsLoginMode(false)}
                            >
                              Create one
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Register Form
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="register-email">Email</Label>
                            <Input
                              id="register-email"
                              type="email"
                              placeholder="your@email.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                              id="username"
                              type="text"
                              placeholder="username"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">First Name</Label>
                              <Input
                                id="firstName"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input
                                id="lastName"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="register-password">Password</Label>
                            <Input
                              id="register-password"
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="is-artist"
                              checked={isArtist}
                              onChange={(e) => setIsArtist(e.target.checked)}
                              className="rounded border-gray-300"
                            />
                            <Label htmlFor="is-artist">Register as an artist</Label>
                          </div>
                          <Button
                            className="w-full bg-primary hover:bg-accent rounded-full"
                            onClick={handleRegister}
                          >
                            Create Account
                          </Button>
                          <div className="text-center text-sm">
                            Already have an account?{" "}
                            <button
                              className="text-primary hover:text-accent font-medium"
                              onClick={() => setIsLoginMode(true)}
                            >
                              Sign in
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-primary text-white hover:bg-accent rounded-full px-6 py-2 font-accent font-medium transition-colors">
                      Sign Up
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="font-heading text-2xl">Create Account</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="register-email-2">Email</Label>
                          <Input
                            id="register-email-2"
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username-2">Username</Label>
                          <Input
                            id="username-2"
                            type="text"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName-2">First Name</Label>
                            <Input
                              id="firstName-2"
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName-2">Last Name</Label>
                            <Input
                              id="lastName-2"
                              type="text"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-password-2">Password</Label>
                          <Input
                            id="register-password-2"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="is-artist-2"
                            checked={isArtist}
                            onChange={(e) => setIsArtist(e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="is-artist-2">Register as an artist</Label>
                        </div>
                        <Button
                          className="w-full bg-primary hover:bg-accent rounded-full"
                          onClick={handleRegister}
                        >
                          Create Account
                        </Button>
                        <div className="text-center text-sm">
                          Already have an account?{" "}
                          <DialogClose asChild>
                            <button
                              className="text-primary hover:text-accent font-medium"
                              onClick={() => setIsLoginMode(true)}
                            >
                              Sign in
                            </button>
                          </DialogClose>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button className="md:hidden text-dark" onClick={toggleMenu}>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
        
        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="py-4 space-y-3 border-t border-gray-100">
            <Link href="/browse">
              <div className="block py-2 text-dark hover:text-accent font-accent font-medium cursor-pointer">
                Discover
              </div>
            </Link>
            <Link href="/browse?type=artist">
              <div className="block py-2 text-dark hover:text-accent font-accent font-medium cursor-pointer">
                Artists
              </div>
            </Link>
            <Link href="/browse?type=collection">
              <div className="block py-2 text-dark hover:text-accent font-accent font-medium cursor-pointer">
                Collections
              </div>
            </Link>
            <Link href="/mission">
              <div className="block py-2 text-dark hover:text-accent font-accent font-medium cursor-pointer">
                Our Mission
              </div>
            </Link>
            <Link href="/about">
              <div className="block py-2 text-dark hover:text-accent font-accent font-medium cursor-pointer">
                About
              </div>
            </Link>
            <Link href="/journeys">
              <div className="block py-2 text-dark hover:text-accent font-accent font-medium cursor-pointer">
                How It Works
              </div>
            </Link>
            
            {user ? (
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{user.firstName || user.username}</div>
                  <Link href="/cart">
                    <div className="relative cursor-pointer">
                      <ShoppingCart className="text-primary hover:text-accent transition-colors" />
                      {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cartItemCount}
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full mt-3 bg-white text-primary hover:text-accent border border-primary rounded-full py-2 font-accent font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex space-x-3 pt-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1 bg-white text-primary hover:text-accent border border-primary rounded-full py-2 font-accent font-medium transition-colors">
                      Sign In
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="font-heading text-2xl">
                        {isLoginMode ? "Sign In" : "Create Account"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      {isLoginMode ? (
                        // Login Form
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="email-mobile">Email</Label>
                            <Input
                              id="email-mobile"
                              type="email"
                              placeholder="your@email.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="password-mobile">Password</Label>
                            <Input
                              id="password-mobile"
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <Button
                            className="w-full bg-primary hover:bg-accent rounded-full"
                            onClick={handleLogin}
                          >
                            Sign In
                          </Button>
                          <div className="text-center text-sm">
                            Don't have an account?{" "}
                            <button
                              className="text-primary hover:text-accent font-medium"
                              onClick={() => setIsLoginMode(false)}
                            >
                              Create one
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Register Form
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="register-email-mobile">Email</Label>
                            <Input
                              id="register-email-mobile"
                              type="email"
                              placeholder="your@email.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="username-mobile">Username</Label>
                            <Input
                              id="username-mobile"
                              type="text"
                              placeholder="username"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName-mobile">First Name</Label>
                              <Input
                                id="firstName-mobile"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName-mobile">Last Name</Label>
                              <Input
                                id="lastName-mobile"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="register-password-mobile">Password</Label>
                            <Input
                              id="register-password-mobile"
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="is-artist-mobile"
                              checked={isArtist}
                              onChange={(e) => setIsArtist(e.target.checked)}
                              className="rounded border-gray-300"
                            />
                            <Label htmlFor="is-artist-mobile">Register as an artist</Label>
                          </div>
                          <Button
                            className="w-full bg-primary hover:bg-accent rounded-full"
                            onClick={handleRegister}
                          >
                            Create Account
                          </Button>
                          <div className="text-center text-sm">
                            Already have an account?{" "}
                            <button
                              className="text-primary hover:text-accent font-medium"
                              onClick={() => setIsLoginMode(true)}
                            >
                              Sign in
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex-1 bg-primary text-white hover:bg-accent rounded-full py-2 font-accent font-medium transition-colors">
                      Sign Up
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="font-heading text-2xl">Create Account</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="register-email-mobile-2">Email</Label>
                          <Input
                            id="register-email-mobile-2"
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="username-mobile-2">Username</Label>
                          <Input
                            id="username-mobile-2"
                            type="text"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName-mobile-2">First Name</Label>
                            <Input
                              id="firstName-mobile-2"
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName-mobile-2">Last Name</Label>
                            <Input
                              id="lastName-mobile-2"
                              type="text"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-password-mobile-2">Password</Label>
                          <Input
                            id="register-password-mobile-2"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="is-artist-mobile-2"
                            checked={isArtist}
                            onChange={(e) => setIsArtist(e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="is-artist-mobile-2">Register as an artist</Label>
                        </div>
                        <Button
                          className="w-full bg-primary hover:bg-accent rounded-full"
                          onClick={handleRegister}
                        >
                          Create Account
                        </Button>
                        <div className="text-center text-sm">
                          Already have an account?{" "}
                          <DialogClose asChild>
                            <button
                              className="text-primary hover:text-accent font-medium"
                              onClick={() => setIsLoginMode(true)}
                            >
                              Sign in
                            </button>
                          </DialogClose>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
