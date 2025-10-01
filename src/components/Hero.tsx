import { Button } from "@/components/ui/button";
import { Search, Car, Home, MapPin, Star, Shield, Clock, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
      {/* Stunning gradient background with moving elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/30 to-indigo-800/40"></div>
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/30 rounded-full blur-3xl animate-bounce-subtle"></div>
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-indigo-400/25 to-blue-500/25 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/10 backdrop-blur-[2px]"></div>
      
      {/* Hero Content - Simplified */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight animate-fade-in px-4 sm:px-0">
            <span className="block text-white mb-1 md:mb-2">Find Your Perfect</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-shimmer bg-300% bg-pos-0">
              <span className="sm:hidden">Dream Car</span>
              <span className="hidden sm:inline">Dream Car & Property</span>
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Quality cars and properties in Kenya with competitive prices
          </p>
        </div>
      </div>
      
      {/* Call-to-action buttons */}
      <div className="relative z-20 container mx-auto px-4 text-center mt-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 text-lg py-3"
            onClick={() => scrollToSection('listings')}
          >
            <Car className="h-5 w-5 mr-2" />
            Browse Cars
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white/30 text-white hover:bg-white/10 px-8 text-lg py-3"
            onClick={() => scrollToSection('properties')}
          >
            <Home className="h-5 w-5 mr-2" />
            Properties
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;