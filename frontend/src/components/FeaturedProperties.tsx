
import { useState } from "react";
import PropertyCard from "@/components/PropertyCard";

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  image: string;
  amenities: string[];
  type: string;
  distanceToUni: string;
  available: string;
  rating: number;
}

interface FeaturedPropertiesProps {
  searchQuery: string;
  filters: {
    priceRange: number[];
    propertyType: string;
    bedrooms: string;
    amenities: string[];
  };
}

const FeaturedProperties = ({ searchQuery, filters }: FeaturedPropertiesProps) => {
  const [properties] = useState<Property[]>([
    {
      id: 1,
      title: "Modern Student Apartment",
      location: "Near UCLA Campus",
      price: 1200,
      bedrooms: 2,
      bathrooms: 1,
      sqft: 850,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop",
      amenities: ["WiFi", "Parking", "Laundry", "Near Campus", "Furnished"],
      type: "apartment",
      distanceToUni: "0.3 miles",
      available: "August 2024",
      rating: 4.8
    },
    {
      id: 2,
      title: "Cozy Studio Downtown",
      location: "Downtown Berkeley",
      price: 950,
      bedrooms: 1,
      bathrooms: 1,
      sqft: 450,
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=500&h=300&fit=crop",
      amenities: ["WiFi", "Gym", "Security", "Pet Friendly"],
      type: "studio",
      distanceToUni: "0.8 miles",
      available: "September 2024",
      rating: 4.6
    },
    {
      id: 3,
      title: "Shared House with Students",
      location: "University District",
      price: 750,
      bedrooms: 1,
      bathrooms: 1,
      sqft: 300,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=500&h=300&fit=crop",
      amenities: ["WiFi", "Laundry", "Study Room", "Near Campus"],
      type: "shared",
      distanceToUni: "0.2 miles",
      available: "Available Now",
      rating: 4.5
    },
    {
      id: 4,
      title: "Luxury Student Housing",
      location: "Campus Village",
      price: 1800,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1200,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&h=300&fit=crop",
      amenities: ["WiFi", "Parking", "Pool", "Gym", "Security", "Furnished"],
      type: "apartment",
      distanceToUni: "0.1 miles",
      available: "January 2025",
      rating: 4.9
    },
    {
      id: 5,
      title: "Budget-Friendly Room",
      location: "Student Quarter",
      price: 600,
      bedrooms: 1,
      bathrooms: 1,
      sqft: 250,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=300&fit=crop",
      amenities: ["WiFi", "Laundry", "Near Campus"],
      type: "shared",
      distanceToUni: "0.4 miles",
      available: "Available Now",
      rating: 4.2
    },
    {
      id: 6,
      title: "Modern Two-Bedroom",
      location: "Campus Heights",
      price: 1600,
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1000,
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=500&h=300&fit=crop",
      amenities: ["WiFi", "Parking", "Laundry", "Gym", "Study Room"],
      type: "apartment",
      distanceToUni: "0.5 miles",
      available: "August 2024",
      rating: 4.7
    }
  ]);

  const filteredProperties = properties.filter(property => {
    // Search query filter
    if (searchQuery && !property.location.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !property.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Price range filter
    if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) {
      return false;
    }

    // Property type filter
    if (filters.propertyType && property.type !== filters.propertyType) {
      return false;
    }

    // Bedrooms filter
    if (filters.bedrooms) {
      const bedroomNum = parseInt(filters.bedrooms);
      if (filters.bedrooms === "4+" && property.bedrooms < 4) {
        return false;
      } else if (filters.bedrooms !== "4+" && property.bedrooms !== bedroomNum) {
        return false;
      }
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every(amenity => 
        property.amenities.includes(amenity)
      );
      if (!hasAllAmenities) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {searchQuery ? `Search Results for "${searchQuery}"` : "Featured Properties"}
        </h2>
        <p className="text-gray-600">
          {filteredProperties.length} properties found
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters</p>
        </div>
      )}
    </div>
  );
};

export default FeaturedProperties;
