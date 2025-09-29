export interface Listing {
  id: string;
  type: 'car' | 'property';
  title: string;
  price: number;
  currency: string;
  location: string;
  images: string[];
  description: string;
  features: string[];
  specifications?: {
    [key: string]: string;
  };
  whatsappNumber: string;
  featured: boolean;
}

export const sampleListings: Listing[] = [
  // Cars
  {
    id: "car-1",
    type: "car",
    title: "Toyota Camry 2020",
    price: 3200000,
    currency: "KSH",
    location: "Nairobi, Kenya",
    images: ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop"],
    description: "Excellent condition Toyota Camry 2020 with low mileage. Perfect for daily commuting and long trips. Well maintained with full service history.",
    features: ["Leather Seats", "Sunroof", "Navigation System", "Backup Camera", "Bluetooth"],
    specifications: {
      "Year": "2020",
      "Mileage": "45,000 km",
      "Engine": "2.5L 4-Cylinder",
      "Transmission": "Automatic",
      "Fuel Type": "Petrol",
      "Color": "Silver"
    },
    whatsappNumber: "+254712345678",
    featured: true
  },
  {
    id: "car-2",
    type: "car",
    title: "Honda CR-V 2019",
    price: 3800000,
    currency: "KSH",
    location: "Mombasa, Kenya",
    images: ["https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop"],
    description: "Spacious and reliable Honda CR-V perfect for families. AWD system for all weather conditions. Excellent fuel economy.",
    features: ["AWD", "7 Seats", "Cruise Control", "Heated Seats", "Premium Audio"],
    specifications: {
      "Year": "2019",
      "Mileage": "62,000 km",
      "Engine": "1.5L Turbo",
      "Transmission": "CVT",
      "Fuel Type": "Petrol",
      "Color": "White Pearl"
    },
    whatsappNumber: "+254712345678",
    featured: false
  },
  {
    id: "car-3",
    type: "car",
    title: "Nissan X-Trail 2021",
    price: 4200000,
    currency: "KSH",
    location: "Kisumu, Kenya",
    images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop"],
    description: "Modern Nissan X-Trail with advanced safety features and exceptional comfort. Perfect for urban and off-road adventures.",
    features: ["360° Camera", "Lane Assist", "Emergency Braking", "Wireless Charging", "LED Headlights"],
    specifications: {
      "Year": "2021",
      "Mileage": "28,000 km",
      "Engine": "2.0L CVT",
      "Transmission": "CVT",
      "Fuel Type": "Petrol",
      "Color": "Midnight Black"
    },
    whatsappNumber: "+254712345678",
    featured: true
  },

  // Properties
  {
    id: "property-1",
    type: "property",
    title: "3BR Modern Apartment - Kilimani",
    price: 18000000,
    currency: "KSH",
    location: "Kilimani, Nairobi",
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"],
    description: "Luxurious 3-bedroom apartment in the heart of Kilimani. Modern finishes, spacious rooms, and great amenities. Perfect for families or investment.",
    features: ["Swimming Pool", "Gym", "24/7 Security", "Parking", "Balcony", "Modern Kitchen"],
    specifications: {
      "Bedrooms": "3",
      "Bathrooms": "2",
      "Size": "120 sqm",
      "Floor": "8th Floor",
      "Furnished": "Semi-furnished",
      "Year Built": "2019"
    },
    whatsappNumber: "+254712345678",
    featured: true
  },
  {
    id: "property-2",
    type: "property",
    title: "4BR Family House - Karen",
    price: 45000000,
    currency: "KSH",
    location: "Karen, Nairobi",
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"],
    description: "Stunning 4-bedroom family home in prestigious Karen. Large compound, modern amenities, and excellent security. Move-in ready.",
    features: ["Large Garden", "Swimming Pool", "Servant Quarter", "Double Garage", "Solar Power", "Borehole"],
    specifications: {
      "Bedrooms": "4",
      "Bathrooms": "3",
      "Size": "250 sqm",
      "Land Size": "0.5 Acres",
      "Furnished": "Unfurnished",
      "Year Built": "2018"
    },
    whatsappNumber: "+254712345678",
    featured: true
  },
  {
    id: "property-3",
    type: "property",
    title: "Commercial Building - CBD",
    price: 120000000,
    currency: "KSH",
    location: "Nairobi CBD",
    images: ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop"],
    description: "Prime commercial building in Nairobi CBD. Excellent rental income potential. Fully occupied with established tenants.",
    features: ["Prime Location", "Elevator", "Parking", "24/7 Security", "High-Speed Internet", "Generator Backup"],
    specifications: {
      "Floors": "6",
      "Total Size": "800 sqm",
      "Rental Income": "KSH 800,000/month",
      "Occupancy": "100%",
      "Year Built": "2015",
      "Parking Spaces": "20"
    },
    whatsappNumber: "+254712345678",
    featured: false
  }
];