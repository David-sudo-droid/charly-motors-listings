import { Button } from "@/components/ui/button";
import { Car, Home } from "lucide-react";

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="bg-gradient-to-br from-blue-600 to-blue-800 py-20 sm:py-24">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
          Quality cars and properties in Kenya
        </h1>
        <p className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Discover premium vehicles and properties with over 10 years of trusted service
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Button 
            size="lg" 
            className="bg-white text-blue-600 hover:bg-blue-50 hover:scale-105 px-8 py-4 text-lg font-bold shadow-xl border-2 border-white transition-all duration-300 h-14"
            onClick={() => scrollToSection('listings')}
          >
            <Car className="h-6 w-6 mr-2" />
            Browse Cars
          </Button>
          <Button 
            size="lg" 
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 hover:scale-105 px-8 py-4 text-lg font-bold shadow-xl transition-all duration-300 h-14"
            onClick={() => scrollToSection('properties')}
          >
            <Home className="h-6 w-6 mr-2" />
            Properties
          </Button>
        </div>
        
        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-blue-100 text-sm">
          <div className="flex items-center gap-1">
            <span className="font-semibold">500+</span> Cars Sold
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">200+</span> Properties
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">1000+</span> Happy Clients
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;