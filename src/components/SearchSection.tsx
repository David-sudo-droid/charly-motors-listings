import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Car, Home, MapPin, DollarSign, Calendar, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface SearchFilters {
  location: string;
  priceRange: string;
  category: string;
  year: string;
  condition: string;
  propertyType: string;
  bedrooms: string;
}

interface SearchSectionProps {
  onSearch: (type: 'car' | 'property', filters: SearchFilters) => void;
}

const SearchSection = ({ onSearch }: SearchSectionProps) => {
  const [activeTab, setActiveTab] = useState<'cars' | 'properties'>('cars');
  const [stats, setStats] = useState({ cars: 0, properties: 0, total: 0 });
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    priceRange: '',
    category: '',
    year: '',
    condition: '',
    propertyType: '',
    bedrooms: ''
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: carsData } = await supabase
        .from('listings')
        .select('id', { count: 'exact' })
        .eq('type', 'car');
      
      const { data: propertiesData } = await supabase
        .from('listings')
        .select('id', { count: 'exact' })
        .eq('type', 'property');

      const carsCount = carsData?.length || 0;
      const propertiesCount = propertiesData?.length || 0;

      setStats({
        cars: carsCount,
        properties: propertiesCount,
        total: carsCount + propertiesCount
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = () => {
    const searchType = activeTab === 'cars' ? 'car' : 'property';
    onSearch(searchType, filters);
  };

  const resetFilters = () => {
    setFilters({
      location: '',
      priceRange: '',
      category: '',
      year: '',
      condition: '',
      propertyType: '',
      bedrooms: ''
    });
  };

  const carPriceRanges = [
    { value: '', label: 'Any Price' },
    { value: '0-500000', label: 'Under KSH 500K' },
    { value: '500000-1000000', label: 'KSH 500K - 1M' },
    { value: '1000000-2000000', label: 'KSH 1M - 2M' },
    { value: '2000000-5000000', label: 'KSH 2M - 5M' },
    { value: '5000000+', label: 'Over KSH 5M' }
  ];

  const propertyPriceRanges = [
    { value: '', label: 'Any Price' },
    { value: '0-1000000', label: 'Under KSH 1M' },
    { value: '1000000-5000000', label: 'KSH 1M - 5M' },
    { value: '5000000-10000000', label: 'KSH 5M - 10M' },
    { value: '10000000-20000000', label: 'KSH 10M - 20M' },
    { value: '20000000+', label: 'Over KSH 20M' }
  ];

  const locations = [
    'Nairobi', 'Mombasa', 'Nakuru', 'Eldoret', 'Kisumu', 'Thika', 'Machakos', 'Meru', 'Nyeri', 'Kakamega'
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header with Stats */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Find Your Perfect <span className="text-primary">Match</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Search through our extensive collection of premium vehicles and properties
          </p>
          
          {/* Live Stats */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Car className="w-5 h-5 text-primary" />
              <span className="font-semibold">{stats.cars}</span>
              <span className="text-muted-foreground">Cars</span>
            </div>
            <div className="flex items-center gap-2">
              <Home className="w-5 h-5 text-primary" />
              <span className="font-semibold">{stats.properties}</span>
              <span className="text-muted-foreground">Properties</span>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              {stats.total} Total Listings
            </Badge>
          </div>
        </div>

        {/* Search Interface */}
        <Card className="max-w-4xl mx-auto shadow-elegant">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'cars' | 'properties')}>
              {/* Tab Headers */}
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="cars" className="flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  Cars ({stats.cars})
                </TabsTrigger>
                <TabsTrigger value="properties" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Properties ({stats.properties})
                </TabsTrigger>
              </TabsList>

              {/* Cars Search */}
              <TabsContent value="cars" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search Query */}
                  <div className="lg:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by make, model, or keyword..."
                        value={filters.category}
                        onChange={(e) => setFilters({...filters, category: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
                    <SelectTrigger>
                      <MapPin className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Location</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Price Range */}
                  <Select value={filters.priceRange} onValueChange={(value) => setFilters({...filters, priceRange: value})}>
                    <SelectTrigger>
                      <DollarSign className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      {carPriceRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Advanced Filters for Cars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select value={filters.year} onValueChange={(value) => setFilters({...filters, year: value})}>
                    <SelectTrigger>
                      <Calendar className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Year</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2020">2020</SelectItem>
                      <SelectItem value="2019">2019 & Older</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.condition} onValueChange={(value) => setFilters({...filters, condition: value})}>
                    <SelectTrigger>
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Condition</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                      <SelectItem value="certified">Certified Pre-Owned</SelectItem>
                    </SelectContent>
                  </Select>

                  <div></div> {/* Spacer */}
                </div>
              </TabsContent>

              {/* Properties Search */}
              <TabsContent value="properties" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search Query */}
                  <div className="lg:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by area, property type, or keyword..."
                        value={filters.category}
                        onChange={(e) => setFilters({...filters, category: e.target.value})}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
                    <SelectTrigger>
                      <MapPin className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Location</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Price Range */}
                  <Select value={filters.priceRange} onValueChange={(value) => setFilters({...filters, priceRange: value})}>
                    <SelectTrigger>
                      <DollarSign className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Price Range" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyPriceRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Advanced Filters for Properties */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select value={filters.propertyType} onValueChange={(value) => setFilters({...filters, propertyType: value})}>
                    <SelectTrigger>
                      <Home className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Type</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.bedrooms} onValueChange={(value) => setFilters({...filters, bedrooms: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Bedrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Bedrooms</SelectItem>
                      <SelectItem value="1">1 Bedroom</SelectItem>
                      <SelectItem value="2">2 Bedrooms</SelectItem>
                      <SelectItem value="3">3 Bedrooms</SelectItem>
                      <SelectItem value="4">4 Bedrooms</SelectItem>
                      <SelectItem value="5+">5+ Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>

                  <div></div> {/* Spacer */}
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center mt-8">
              <Button
                onClick={handleSearch}
                size="lg"
                className="px-8 py-3 text-lg font-semibold bg-primary hover:bg-primary-hover shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Search className="w-5 h-5 mr-2" />
                Search {activeTab === 'cars' ? 'Cars' : 'Properties'}
              </Button>
              <Button
                variant="outline"
                onClick={resetFilters}
                size="lg"
                className="px-6 py-3 text-lg font-semibold border-2"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SearchSection;