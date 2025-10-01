import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ListingsGrid from "@/components/ListingsGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      {/* Cars Section - Direct integration */}
      <ListingsGrid />
      


      {/* Properties Section */}
      <section id="properties" className="py-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">Premium Properties</h2>
          <p className="text-center text-muted-foreground mb-6">
            Real estate opportunities in prime locations across Kenya
          </p>
        </div>
      </section>

      
      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-lg font-bold mb-3">Charly Motors</h3>
              <p className="text-sm opacity-90">
                Quality vehicles and properties in Kenya with over 10 years of experience.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-1 text-sm opacity-90">
                <li><a href="#listings" className="hover:text-accent transition-smooth">Cars</a></li>
                <li><a href="#properties" className="hover:text-accent transition-smooth">Properties</a></li>

              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <ul className="space-y-1 text-sm opacity-90">
                <li>📱 +254 712 345 678</li>
                <li>📧 info@charlymotors.co.ke</li>
                <li>📍 Nairobi, Kenya</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Stats</h4>
              <ul className="space-y-1 text-sm opacity-90">
                <li>500+ Cars Sold</li>
                <li>200+ Properties</li>
                <li>1000+ Happy Clients</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-6 pt-6 text-center text-sm opacity-75">
            <p>&copy; 2024 Charly Motors & Properties. All rights reserved.</p>
          </div>
        </div>
      </footer>


    </div>
  );
};

export default Index;
