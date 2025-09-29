import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SearchSection from "@/components/SearchSection";
import ListingsGrid from "@/components/ListingsGrid";
import ComparisonBar from "@/components/ComparisonBar";
import ComparisonModal from "@/components/ComparisonModal";
import { useComparison } from "@/hooks/useComparison";

const Index = () => {
  const { 
    comparisonItems, 
    removeFromComparison, 
    clearComparison, 
    isOpen, 
    closeComparison 
  } = useComparison();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      {/* Cars Section */}
      <section id="cars" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Vehicle Collection</h2>
          <ListingsGrid />
        </div>
      </section>

      {/* Properties Section */}
      <section id="properties" className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Premium Properties</h2>
          <p className="text-center text-muted-foreground mb-8">
            Discover exclusive real estate opportunities in prime locations across Kenya
          </p>
          {/* Properties will be filtered from ListingsGrid */}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">About Charly Motors & Properties</h2>
            <p className="text-lg text-muted-foreground mb-6">
              With over a decade of experience in the automotive and real estate industry, 
              Charly Motors & Properties has established itself as Kenya's premier destination 
              for quality vehicles and exceptional properties.
            </p>
            <p className="text-muted-foreground mb-8">
              We pride ourselves on transparency, reliability, and providing our clients 
              with the best deals in the market. Whether you're looking for your dream car 
              or the perfect property, we're here to make it happen.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <p className="text-muted-foreground">Vehicles Sold</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">200+</div>
                <p className="text-muted-foreground">Properties Managed</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">1000+</div>
                <p className="text-muted-foreground">Happy Clients</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Charly Motors & Properties</h3>
              <p className="text-sm opacity-90">
                Your trusted partner for quality vehicles and properties in Kenya.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li><a href="#cars" className="hover:text-accent transition-smooth">Cars</a></li>
                <li><a href="#properties" className="hover:text-accent transition-smooth">Properties</a></li>
                <li><a href="#about" className="hover:text-accent transition-smooth">About Us</a></li>
                <li><a href="#contact" className="hover:text-accent transition-smooth">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact Info</h4>
              <ul className="space-y-2 text-sm opacity-90">
                <li>📱 +254 712 345 678</li>
                <li>📧 info@charlymotors.co.ke</li>
                <li>📍 Nairobi, Kenya</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-75">
            <p>&copy; 2024 Charly Motors & Properties. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Comparison Components */}
      <ComparisonBar />
      <ComparisonModal
        isOpen={isOpen}
        onClose={closeComparison}
        items={comparisonItems}
        onRemove={removeFromComparison}
        onClear={clearComparison}
      />
    </div>
  );
};

export default Index;
