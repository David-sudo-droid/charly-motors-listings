import { Button } from "@/components/ui/button";
import { Car, Home, Menu, X, LogIn, LogOut, User, Settings, Search, MapPin, Award, MessageCircle } from "lucide-react";
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

  const handleSellThroughUs = () => {
    const phoneNumber = "254712345678"; // Replace with founder's actual WhatsApp number
    const message = "Hi! I'm interested in selling my car/property through Charly Motors. Can you help me with the process?";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
    {/* Mobile-optimized utility bar */}
    <div className="bg-gray-800 text-white text-xs py-2 md:py-1">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
          <div className="flex items-center space-x-3 text-center sm:text-left">
            <span className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="hidden xs:inline">Serving All Kenya</span>
              <span className="xs:hidden">All Kenya</span>
            </span>
            <span className="hidden sm:inline">📞 +254 712 345 678</span>
            <span className="sm:hidden">📞 +254 712 345 678</span>
          </div>
          <div className="hidden md:flex items-center">
            <span className="flex items-center text-xs">
              <Award className="h-3 w-3 mr-1" />
              Trusted Dealer Network
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 md:h-20 items-center justify-between px-4">
        {/* Mobile-optimized Logo */}
        <Link to="/" className="flex items-center space-x-2 md:space-x-3">
          <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 md:p-2 rounded-lg">
            <Car className="h-5 w-5 md:h-7 md:w-7 text-white" />
            <Home className="h-4 w-4 md:h-6 md:w-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CharlyMotors</h1>
            <p className="text-xs md:text-sm text-gray-600 -mt-1 font-medium">Cars & Properties</p>
          </div>
          <div className="sm:hidden">
            <h1 className="text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Charly Motors</h1>
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
            Properties
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

        {/* Desktop CTA Section */}
        <div className="hidden lg:flex items-center space-x-3">
          {user ? (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-gray-300 text-gray-700 hover:border-red-600 hover:text-red-600"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-1" />
                <span className="hidden xl:inline">Sign Out</span>
              </Button>
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleSellThroughUs}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                <span className="hidden xl:inline">Sell Through Us</span>
                <span className="xl:hidden">Sell</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600">
                  <LogIn className="h-4 w-4 mr-1" />
                  <span className="hidden xl:inline">Sign In</span>
                </Button>
              </Link>
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                onClick={handleSellThroughUs}
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                <span className="hidden xl:inline">Sell Through Us</span>
                <span className="xl:hidden">Sell</span>
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Enhanced Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <div className="px-4 py-3 space-y-1">
            {/* Navigation Links */}
            <a href="#cars" onClick={() => setIsMenuOpen(false)} className="flex items-center px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
              <Car className="h-5 w-5 mr-3" />
              Buy Cars
            </a>
            <a href="#properties" onClick={() => setIsMenuOpen(false)} className="flex items-center px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
              <Home className="h-5 w-5 mr-3" />
              Properties
            </a>

            <a href="#about" onClick={() => setIsMenuOpen(false)} className="flex items-center px-3 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
              About Us
            </a>
            
            {/* User Section */}
            <div className="border-t pt-3 mt-3">
              {user ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 text-sm text-gray-600">
                    Welcome, {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                    {isAdmin && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Admin</span>}
                  </div>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start text-base py-3">
                        <Settings className="h-5 w-5 mr-3" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Button variant="outline" className="w-full text-base py-3" onClick={() => { handleSignOut(); setIsMenuOpen(false); }}>
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                  </Button>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-base py-3" 
                    onClick={() => { handleSellThroughUs(); setIsMenuOpen(false); }}
                  >
                    <MessageCircle className="h-5 w-5 mr-3" />
                    Sell Through Us
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full text-base py-3">
                      <LogIn className="h-5 w-5 mr-3" />
                      Sign In
                    </Button>
                  </Link>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-base py-3"
                    onClick={() => { handleSellThroughUs(); setIsMenuOpen(false); }}
                  >
                    <MessageCircle className="h-5 w-5 mr-3" />
                    Sell Through Us
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
    </>
  );
};

export default Header;
