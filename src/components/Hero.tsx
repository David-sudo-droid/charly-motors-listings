import { Button } from "@/components/ui/button";
import { Search, Car, Home, MapPin, Star, Shield, Clock, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
      {/* Stunning gradient background with moving elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/30 to-indigo-800/40"></div>
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/30 rounded-full blur-3xl animate-bounce-subtle"></div>
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-indigo-400/25 to-blue-500/25 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      {/* Glass morphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/10 backdrop-blur-[2px]"></div>
      
      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Modern trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
            <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white/90">
              <Shield className="w-5 h-5 mr-2 text-emerald-400" />
              Verified Dealers
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white/90">
              <Award className="w-5 h-5 mr-2 text-yellow-400" />
              Best Prices
            </div>
            <div className="flex items-center bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-white/90">
              <Clock className="w-5 h-5 mr-2 text-blue-400" />
              24/7 Support
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight animate-fade-in">
            <span className="block text-white mb-2">Find Your Perfect</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-shimmer bg-300% bg-pos-0">
              Dream Ride & Home
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up">
            Discover premium automotive and real estate solutions across Kenya. 
            <span className="text-cyan-300 font-semibold">Quality guaranteed</span>, 
            unbeatable prices, and exceptional service that exceeds expectations.
          </p>

          {/* Modern glass morphism CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Button 
              className="text-xl px-12 py-5 bg-gradient-to-r from-cyan-500/80 to-blue-600/80 backdrop-blur-md border border-white/20 hover:from-cyan-400/90 hover:to-blue-500/90 text-white font-bold shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 rounded-full"
              onClick={() => scrollToSection('cars')}
            >
              <Car className="h-6 w-6 mr-3" />
              🚗 Browse Premium Cars
            </Button>
            <Button 
              className="text-xl px-12 py-5 bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 text-white font-bold shadow-2xl hover:shadow-white/25 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 rounded-full"
              onClick={() => scrollToSection('properties')}
            >
              <Home className="h-6 w-6 mr-3" />
              🏠 Explore Properties
            </Button>
          </div>

          {/* Modern glass morphism stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-2xl hover:shadow-cyan-500/20 rounded-2xl overflow-hidden group">
              <CardContent className="p-8 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="text-5xl font-bold text-white mb-3 flex items-center justify-center">
                    <Car className="w-10 h-10 mr-3 text-cyan-400" />
                    <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">500+</span>
                  </div>
                  <div className="text-white text-xl font-bold mb-1">Premium Vehicles</div>
                  <div className="text-white/70 text-sm">Carefully inspected & verified</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-2xl hover:shadow-purple-500/20 rounded-2xl overflow-hidden group">
              <CardContent className="p-8 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="text-5xl font-bold text-white mb-3 flex items-center justify-center">
                    <Home className="w-10 h-10 mr-3 text-purple-400" />
                    <span className="bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">200+</span>
                  </div>
                  <div className="text-white text-xl font-bold mb-1">Quality Properties</div>
                  <div className="text-white/70 text-sm">Prime locations across Kenya</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-2xl hover:shadow-yellow-500/20 rounded-2xl overflow-hidden group">
              <CardContent className="p-8 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative z-10">
                  <div className="text-5xl font-bold text-white mb-3 flex items-center justify-center">
                    <Star className="w-10 h-10 mr-3 text-yellow-400 fill-current" />
                    <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">1000+</span>
                  </div>
                  <div className="text-white text-xl font-bold mb-1">Happy Clients</div>
                  <div className="text-white/70 text-sm">5-star ratings & reviews</div>
                </div>
              </CardContent>
            </Card>
          </div>
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