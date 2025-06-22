import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Sparkles, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface FilterProps {
  filters: {
    priceRange: number[];
    propertyType: string;
    bedrooms: string;
    amenities: string[];
    sortBy: string;
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
    <div className="container mx-auto px-4 py-2">
      <Card className="p-3 shadow-md border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
            <h2 className="text-base font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-xs text-blue-600 font-medium">Powered by Housely</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>
          </div>
        </div>

        <div className={`space-y-3 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            {/* Price Range */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Price: ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </label>
              <div className="relative">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => setFilters({ ...filters, priceRange: value })}
                  max={3000}
                  min={200}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <Select
                value={filters.propertyType}
                onValueChange={(value) => setFilters({ ...filters, propertyType: value })}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Any" />
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
              <label className="block text-sm font-medium mb-1">Beds</label>
              <Select
                value={filters.bedrooms}
                onValueChange={(value) => setFilters({ ...filters, bedrooms: value })}
              >
                <SelectTrigger className="h-8">
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

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium mb-1">Sort</label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">
                    <div className="flex items-center">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      Price Low to High
                    </div>
                  </SelectItem>
                  <SelectItem value="price-desc">
                    <div className="flex items-center">
                      <ArrowDown className="w-3 h-3 mr-1" />
                      Price High to Low
                    </div>
                  </SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({
                  priceRange: [0, 2000],
                  propertyType: "",
                  bedrooms: "",
                  amenities: [],
                  sortBy: ""
                })}
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 w-full h-8"
              >
                <X className="w-3 h-3 mr-1" />
                Clear
              </Button>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium mb-1">Amenities</label>
            <div className="flex flex-wrap gap-1">
              {amenityOptions.map((amenity) => (
                <Badge
                  key={amenity}
                  variant={filters.amenities.includes(amenity) ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 text-xs ${
                    filters.amenities.includes(amenity) 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : 'hover:bg-blue-50 hover:border-blue-200'
                  }`}
                  onClick={() => toggleAmenity(amenity)}
                >
                  {amenity}
                  {filters.amenities.includes(amenity) && (
                    <X className="h-3 w-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
            {filters.amenities.length > 0 && (
              <p className="text-xs text-gray-600 mt-1">
                {filters.amenities.length} amenities selected
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SearchFilters;
