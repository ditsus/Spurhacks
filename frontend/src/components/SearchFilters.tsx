
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";

interface FilterProps {
  filters: {
    priceRange: number[];
    propertyType: string;
    bedrooms: string;
    amenities: string[];
  };
  setFilters: (filters: any) => void;
}

const SearchFilters = ({ filters, setFilters }: FilterProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const amenityOptions = [
    "WiFi", "Parking", "Laundry", "Gym", "Pool", "Study Room", 
    "Furnished", "Pet Friendly", "Security", "Near Campus"
  ];

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    
    setFilters({ ...filters, amenities: newAmenities });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Filter Properties</h2>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className={`space-y-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
                max={3000}
                min={200}
                step={50}
                className="w-full"
              />
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Property Type</label>
              <Select
                value={filters.propertyType}
                onValueChange={(value) => setFilters({ ...filters, propertyType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="shared">Shared Room</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium mb-2">Bedrooms</label>
              <Select
                value={filters.bedrooms}
                onValueChange={(value) => setFilters({ ...filters, bedrooms: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Bedroom</SelectItem>
                  <SelectItem value="2">2 Bedrooms</SelectItem>
                  <SelectItem value="3">3 Bedrooms</SelectItem>
                  <SelectItem value="4+">4+ Bedrooms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => setFilters({
                  priceRange: [0, 2000],
                  propertyType: "",
                  bedrooms: "",
                  amenities: []
                })}
                className="w-full"
              >
                Clear All
              </Button>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium mb-3">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {amenityOptions.map((amenity) => (
                <Badge
                  key={amenity}
                  variant={filters.amenities.includes(amenity) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => toggleAmenity(amenity)}
                >
                  {amenity}
                  {filters.amenities.includes(amenity) && (
                    <X className="h-3 w-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SearchFilters;
