import { Button } from "@/components/ui/button";
import { Search, Car, Home, MapPin, Star, Shield, Clock, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="bg-gradient-to-br from-blue-600 to-blue-800 py-16 sm:py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Quality cars and properties in Kenya
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 px-6"
            onClick={() => scrollToSection('listings')}
          >
            <Car className="h-4 w-4 mr-2" />
            Browse Cars
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-white text-white hover:bg-white/10 px-6"
            onClick={() => scrollToSection('properties')}
          >
            <Home className="h-4 w-4 mr-2" />
            Browse Properties
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;