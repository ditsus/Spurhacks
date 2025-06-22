import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, DollarSign, Bed, Bath, Users, Star, Heart } from "lucide-react";

interface HousingResult {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  maxOccupants: number;
  rating: number;
  description: string;
  amenities: string[];
  imageUrl?: string;
  distanceFromCampus: string;
  availableFrom: string;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [results, setResults] = useState<HousingResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const resultsPerPage = 9;

  useEffect(() => {
    const location = searchParams.get('location');
    const minBudget = searchParams.get('minBudget');
    const maxBudget = searchParams.get('maxBudget');
    const preferences = searchParams.get('preferences');

    if (!location) {
      setError("No search location provided");
      setLoading(false);
      return;
    }

    // Simulate API call with the search parameters
    const fetchResults = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Generate mock results based on search parameters
        const mockResults: HousingResult[] = generateMockResults(location, minBudget, maxBudget, preferences);
        setResults(mockResults);
      } catch (err) {
        setError("Failed to fetch search results");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchParams]);

  const generateMockResults = (location: string, minBudget: string | null, maxBudget: string | null, preferences: string | null): HousingResult[] => {
    const mockData: HousingResult[] = [
      {
        id: "1",
        title: "Modern Student Apartment",
        location: `${location} - Downtown`,
        price: 1200,
        bedrooms: 2,
        bathrooms: 1,
        maxOccupants: 3,
        rating: 4.5,
        description: "Spacious 2-bedroom apartment with modern amenities, perfect for students. Close to campus and public transportation.",
        amenities: ["WiFi", "Furnished", "Gym", "Laundry"],
        distanceFromCampus: "0.5 miles",
        availableFrom: "August 2024"
      },
      {
        id: "2",
        title: "Cozy Studio Near Campus",
        location: `${location} - University District`,
        price: 850,
        bedrooms: 1,
        bathrooms: 1,
        maxOccupants: 1,
        rating: 4.2,
        description: "Perfect studio apartment for single students. Quiet neighborhood with easy access to campus.",
        amenities: ["WiFi", "Furnished", "Kitchen", "Parking"],
        distanceFromCampus: "0.3 miles",
        availableFrom: "September 2024"
      },
      {
        id: "3",
        title: "Shared House - Student Friendly",
        location: `${location} - Residential Area`,
        price: 650,
        bedrooms: 1,
        bathrooms: 1,
        maxOccupants: 2,
        rating: 4.0,
        description: "Shared house with other students. Great community atmosphere and affordable rent.",
        amenities: ["WiFi", "Kitchen", "Backyard", "Utilities Included"],
        distanceFromCampus: "1.2 miles",
        availableFrom: "August 2024"
      },
      {
        id: "4",
        title: "Luxury Student Housing",
        location: `${location} - Premium District`,
        price: 1800,
        bedrooms: 2,
        bathrooms: 2,
        maxOccupants: 4,
        rating: 4.8,
        description: "Premium student housing with luxury amenities. Perfect for those who want the best living experience.",
        amenities: ["WiFi", "Furnished", "Gym", "Pool", "Study Rooms", "Rooftop"],
        distanceFromCampus: "0.8 miles",
        availableFrom: "August 2024"
      },
      {
        id: "5",
        title: "Budget-Friendly Room",
        location: `${location} - Affordable Area`,
        price: 500,
        bedrooms: 1,
        bathrooms: 1,
        maxOccupants: 1,
        rating: 3.8,
        description: "Affordable room in a shared apartment. Basic amenities but great value for money.",
        amenities: ["WiFi", "Kitchen", "Laundry"],
        distanceFromCampus: "1.5 miles",
        availableFrom: "September 2024"
      },
      {
        id: "6",
        title: "Family-Style Student Home",
        location: `${location} - Quiet Neighborhood`,
        price: 950,
        bedrooms: 3,
        bathrooms: 2,
        maxOccupants: 5,
        rating: 4.3,
        description: "Large family-style home perfect for groups of students. Spacious and comfortable.",
        amenities: ["WiFi", "Furnished", "Kitchen", "Garden", "Parking"],
        distanceFromCampus: "1.0 miles",
        availableFrom: "August 2024"
      },
      {
        id: "7",
        title: "Downtown Loft",
        location: `${location} - City Center`,
        price: 1400,
        bedrooms: 1,
        bathrooms: 1,
        maxOccupants: 2,
        rating: 4.6,
        description: "Modern loft in the heart of the city. Perfect for students who love urban living.",
        amenities: ["WiFi", "Furnished", "Gym", "Rooftop", "Security"],
        distanceFromCampus: "1.8 miles",
        availableFrom: "October 2024"
      },
      {
        id: "8",
        title: "Campus Adjacent Studio",
        location: `${location} - Right by Campus`,
        price: 1100,
        bedrooms: 1,
        bathrooms: 1,
        maxOccupants: 1,
        rating: 4.4,
        description: "Studio apartment literally steps from campus. Perfect for students who want to minimize commute time.",
        amenities: ["WiFi", "Furnished", "Kitchen", "Study Desk"],
        distanceFromCampus: "0.1 miles",
        availableFrom: "August 2024"
      },
      {
        id: "9",
        title: "Eco-Friendly Student Housing",
        location: `${location} - Green District`,
        price: 1300,
        bedrooms: 2,
        bathrooms: 1,
        maxOccupants: 3,
        rating: 4.7,
        description: "Environmentally conscious housing with sustainable features. Perfect for eco-minded students.",
        amenities: ["WiFi", "Furnished", "Solar Panels", "Garden", "Bike Storage"],
        distanceFromCampus: "0.9 miles",
        availableFrom: "September 2024"
      },
      {
        id: "10",
        title: "Historic Student Apartment",
        location: `${location} - Historic District`,
        price: 900,
        bedrooms: 1,
        bathrooms: 1,
        maxOccupants: 2,
        rating: 4.1,
        description: "Charming apartment in a historic building. Full of character and close to campus.",
        amenities: ["WiFi", "Furnished", "High Ceilings", "Original Features"],
        distanceFromCampus: "0.7 miles",
        availableFrom: "August 2024"
      },
      {
        id: "11",
        title: "Modern High-Rise Student Living",
        location: `${location} - Business District`,
        price: 1600,
        bedrooms: 2,
        bathrooms: 2,
        maxOccupants: 4,
        rating: 4.9,
        description: "Luxury high-rise apartment with stunning city views. Premium amenities and services.",
        amenities: ["WiFi", "Furnished", "Gym", "Pool", "Concierge", "Security"],
        distanceFromCampus: "1.3 miles",
        availableFrom: "August 2024"
      },
      {
        id: "12",
        title: "Quiet Suburban Student Home",
        location: `${location} - Suburban Area`,
        price: 750,
        bedrooms: 2,
        bathrooms: 1,
        maxOccupants: 3,
        rating: 4.0,
        description: "Peaceful suburban home perfect for students who prefer a quiet environment.",
        amenities: ["WiFi", "Furnished", "Garden", "Parking", "Quiet Area"],
        distanceFromCampus: "2.1 miles",
        availableFrom: "September 2024"
      }
    ];

    // Filter by budget if provided
    let filteredResults = mockData;
    if (minBudget && maxBudget) {
      const min = parseInt(minBudget);
      const max = parseInt(maxBudget);
      filteredResults = mockData.filter(result => result.price >= min && result.price <= max);
    }

    return filteredResults;
  };

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const totalPages = Math.ceil(results.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentResults = results.slice(startIndex, endIndex);

  const location = searchParams.get('location') || 'Unknown Location';
  const minBudget = searchParams.get('minBudget');
  const maxBudget = searchParams.get('maxBudget');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Finding Your Perfect Home</h2>
          <p className="text-gray-500">Searching for housing options in {location}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Search Error</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Search</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
                <p className="text-gray-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {location}
                  {minBudget && maxBudget && (
                    <span className="ml-4 flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      ${minBudget} - ${maxBudget}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                {results.length} properties found
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="container mx-auto px-4 py-8">
        {currentResults.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Results Found</h2>
            <p className="text-gray-500 mb-4">Try adjusting your search criteria</p>
            <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
              Modify Search
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentResults.map((result) => (
                <Card key={result.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                          {result.title}
                        </CardTitle>
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          {result.location}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Bed className="w-4 h-4 mr-1" />
                            {result.bedrooms} bed
                          </div>
                          <div className="flex items-center">
                            <Bath className="w-4 h-4 mr-1" />
                            {result.bathrooms} bath
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            Up to {result.maxOccupants}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(result.id)}
                        className={`p-2 h-auto ${
                          favorites.has(result.id) ? 'text-red-500' : 'text-gray-400'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${favorites.has(result.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl font-bold text-blue-600">
                        ${result.price}
                        <span className="text-sm font-normal text-gray-500">/month</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm font-medium">{result.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {result.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {result.amenities.slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {result.amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{result.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>📍 {result.distanceFromCampus} from campus</span>
                      <span>📅 Available {result.availableFrom}</span>
                    </div>
                    
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className="w-10 h-10 p-0"
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults; 