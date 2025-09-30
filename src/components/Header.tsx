import { Button } from "@/components/ui/button";
import { Car, Home, Menu, X, LogIn, LogOut, User, Settings, Heart, Search, MapPin, Calculator, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Check admin status when user changes
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const { data, error } = await supabase.rpc('get_current_user_admin_status');
        setIsAdmin(!error && data === true);
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
    {/* Top utility bar like Cars.com */}
    <div className="bg-gray-800 text-white text-xs py-1">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            Serving All Kenya
          </span>
          <span>📞 +254 712 345 678</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <Award className="h-3 w-3 mr-1" />
            Trusted Dealer Network
          </span>
        </div>
      </div>
    </div>
    
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-20 items-center justify-between">
        {/* Enhanced Logo like AutoTrader */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
            <Car className="h-7 w-7 text-white" />
            <Home className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CharlyMotors</h1>
            <p className="text-sm text-gray-600 -mt-1 font-medium">Cars & Properties</p>
          </div>
        </Link>

        {/* Professional Navigation like Cars.com */}
        <nav className="hidden lg:flex items-center space-x-8">
          <a href="#cars" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-1">
            <Car className="h-4 w-4" />
            Buy Cars
          </a>
          <a href="#properties" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-1">
            <Home className="h-4 w-4" />
            Real Estate
          </a>
          <a href="#financing" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-1">
            <Calculator className="h-4 w-4" />
            Finance
          </a>
          <a href="#research" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-1">
            <Search className="h-4 w-4" />
            Research
          </a>
          <a href="#about" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
            About Us
          </a>
          {isAdmin && (
            <Link to="/admin" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-1">
              <Settings className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        {/* Professional CTA Section like AutoTrader */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <>
              <Link to="/favorites">
                <Button variant="ghost" size="sm" className="text-gray-700 hover:text-blue-600">
                  <Heart className="h-4 w-4 mr-1" />
                  Saved Cars
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600">
                <User className="h-4 w-4 mr-1" />
                My Account
              </Button>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                List Your Car
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600">
                  <LogIn className="h-4 w-4 mr-1" />
                  Sign In
                </Button>
              </Link>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white font-semibold">
                List Your Car
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t bg-background">
            <a href="#hero" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm font-medium transition-smooth hover:text-primary">Home</a>
            <a href="#cars" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm font-medium transition-smooth hover:text-primary">Cars</a>
            <a href="#properties" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm font-medium transition-smooth hover:text-primary">Properties</a>
            <a href="#about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm font-medium transition-smooth hover:text-primary">About</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm font-medium transition-smooth hover:text-primary">Contact</a>
            {isAdmin && (
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-sm font-medium transition-smooth hover:text-primary flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Admin Panel
              </Link>
            )}
            
            {user ? (
              <div className="space-y-2 pt-2 px-3">
                <div className="text-xs text-muted-foreground mb-2">
                  Welcome, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                  {isAdmin && <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">Admin</span>}
                </div>
                <Link to="/favorites" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Heart className="h-4 w-4 mr-2" />
                    Favorites
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth" className="block px-3 pt-2" onClick={() => setIsMenuOpen(false)}>
                <Button size="sm" className="w-full">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
    </>
  );
};

export default Header;
