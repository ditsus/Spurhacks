
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Square, Star, Clock, Heart } from "lucide-react";
import { useState } from "react";

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

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover-scale group">
      <div className="relative">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-green-600 hover:bg-green-700">
            {property.available}
          </Badge>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className={`absolute top-3 right-3 h-8 w-8 p-0 hover:bg-white/90 ${
            isFavorited ? 'text-red-500' : 'text-gray-600'
          }`}
          onClick={() => setIsFavorited(!isFavorited)}
        >
          <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
        </Button>
        <div className="absolute bottom-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-900">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
            {property.rating}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {property.title}
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              ${property.price}
            </div>
            <div className="text-sm text-gray-500">per month</div>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.location}</span>
          <span className="mx-2">•</span>
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.distanceToUni}</span>
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            {property.bedrooms} bed
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            {property.bathrooms} bath
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            {property.sqft} sqft
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {property.amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity} variant="outline" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {property.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{property.amenities.length - 3} more
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
            View Details
          </Button>
          <Button variant="outline" className="flex-1">
            Schedule Tour
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
