import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, DollarSign, Bed, Bath, Users, Star, Heart } from "lucide-react";
import SearchFilters from "@/components/SearchFilters";

interface HousingResult {
  id: string;
  title: string;
  link: string;
  justification: string;
  Price: string;
  "Min price": string;
  "Max price": string;
  "Length of stay": string;
  Location: [number, number];
  Beds: string;
  Baths: string;
  "Available from": string;
  Amenities: string[];
  "Reason for recommendation": string;
  Images?: string[];
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [results, setResults] = useState<HousingResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<HousingResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const [filters, setFilters] = useState({
    priceRange: [0, 3000],
    propertyType: "",
    bedrooms: "",
    amenities: [] as string[]
  });

  const resultsPerPage = 9;

  useEffect(() => {
    const location = searchParams.get('location');
    const minBudget = searchParams.get('minBudget');
    const maxBudget = searchParams.get('maxBudget');
    const preferences = searchParams.get('preferences');
    const apiResponse = searchParams.get('apiResponse');

    if (!location) {
      setError("No search location provided");
      setLoading(false);
      return;
    }

    if (!apiResponse) {
      setError("No search results available");
      setLoading(false);
      return;
    }

    // Parse the API response
    const parseApiResponse = () => {
      try {
        setLoading(true);
        
        // Try to parse the JSON response from the API
        let parsedResults: HousingResult[] = [];
        
        try {
          // The API returns a JSON string, so we need to parse it
          parsedResults = JSON.parse(apiResponse);
        } catch (parseError) {
          // If parsing fails, try to extract JSON from the response text
          const jsonMatch = apiResponse.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            parsedResults = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error("Could not parse API response");
          }
        }

        // Validate and clean the results
        const validResults = parsedResults.filter((result: any) => 
          result && result.title && result.link
        ).map((result: any, index: number) => ({
          id: result.id || `result-${index}`,
          title: result.title || "Unknown Property",
          link: result.link || "#",
          justification: result.justification || "",
          Price: result.Price || "N/A",
          "Min price": result["Min price"] || "N/A",
          "Max price": result["Max price"] || "N/A",
          "Length of stay": result["Length of stay"] || "Unknown",
          Location: result.Location || [0, 0],
          Beds: result.Beds || "N/A",
          Baths: result.Baths || "N/A",
          "Available from": result["Available from"] || "Unknown",
          Amenities: Array.isArray(result.Amenities) ? result.Amenities : [],
          "Reason for recommendation": result["Reason for recommendation"] || "",
          Images: result.Images || []
        }));

        setResults(validResults);
        setFilteredResults(validResults);
        
        // Set initial price range from search parameters
        if (minBudget && maxBudget) {
          setFilters(prev => ({
            ...prev,
            priceRange: [parseInt(minBudget), parseInt(maxBudget)]
          }));
        }
        
      } catch (err) {
        console.error("Error parsing API response:", err);
        setError("Failed to parse search results");
      } finally {
        setLoading(false);
      }
    };

    parseApiResponse();
  }, [searchParams]);

  // Apply filters when filters change
  useEffect(() => {
    let filtered = [...results];

    // Filter by price range
    filtered = filtered.filter(result => {
      const price = parseFloat(result.Price.replace(/[^0-9.]/g, '')) || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Filter by property type (if we can determine it from the title)
    if (filters.propertyType) {
      filtered = filtered.filter(result => {
        const title = result.title.toLowerCase();
        switch (filters.propertyType) {
          case 'apartment':
            return title.includes('apartment') || title.includes('apt');
          case 'house':
            return title.includes('house') || title.includes('home');
          case 'studio':
            return title.includes('studio');
          case 'shared':
            return title.includes('shared') || title.includes('room');
          default:
            return true;
        }
      });
    }

    // Filter by bedrooms
    if (filters.bedrooms) {
      filtered = filtered.filter(result => {
        const beds = result.Beds.toLowerCase();
        switch (filters.bedrooms) {
          case '1':
            return beds.includes('1') && !beds.includes('2') && !beds.includes('3') && !beds.includes('4');
          case '2':
            return beds.includes('2') && !beds.includes('3') && !beds.includes('4');
          case '3':
            return beds.includes('3') && !beds.includes('4');
          case '4+':
            return beds.includes('4') || beds.includes('5') || beds.includes('6');
          default:
            return true;
        }
      });
    }

    // Filter by amenities
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(result => {
        const resultAmenities = result.Amenities.map((a: string) => a.toLowerCase());
        return filters.amenities.some(amenity => 
          resultAmenities.some(resultAmenity => 
            resultAmenity.includes(amenity.toLowerCase())
          )
        );
      });
    }

    setFilteredResults(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [results, filters]);

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentResults = filteredResults.slice(startIndex, endIndex);

  const location = searchParams.get('location') || 'Unknown Location';
  const minBudget = searchParams.get('minBudget');
  const maxBudget = searchParams.get('maxBudget');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Processing Search Results</h2>
          <p className="text-gray-500">Analyzing housing options in {location}...</p>
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
                {filteredResults.length} properties found
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Filters */}
      <SearchFilters filters={filters} setFilters={setFilters} />

      {/* Results Grid */}
      <div className="container mx-auto px-4 py-8">
        {currentResults.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Results Found</h2>
            <p className="text-gray-500 mb-4">
              {filteredResults.length === 0 && results.length > 0 
                ? "Try adjusting your filters" 
                : "No properties match your search criteria"}
            </p>
            {filteredResults.length === 0 && results.length > 0 && (
              <Button 
                onClick={() => setFilters({
                  priceRange: [0, 3000],
                  propertyType: "",
                  bedrooms: "",
                  amenities: []
                })} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentResults.map((result) => (
                <Card key={result.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                  {/* Image Section */}
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {result.Images && result.Images.length > 0 ? (
                      <img
                        src={result.Images[0]}
                        alt={result.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <div className="text-gray-400 text-center">
                          <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <p className="text-xs">No image available</p>
                        </div>
                      </div>
                    )}
                    {/* Image count badge */}
                    {result.Images && result.Images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                        +{result.Images.length - 1} more
                      </div>
                    )}
                    {/* Favorite button overlay */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(result.id)}
                      className={`absolute top-2 left-2 p-2 h-auto bg-white/90 hover:bg-white ${
                        favorites.has(result.id) ? 'text-red-500' : 'text-gray-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${favorites.has(result.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                          {result.title}
                        </CardTitle>
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          {location}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Bed className="w-4 h-4 mr-1" />
                            {result.Beds}
                          </div>
                          <div className="flex items-center">
                            <Bath className="w-4 h-4 mr-1" />
                            {result.Baths}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl font-bold text-blue-600">
                        {result.Price}
                        <span className="text-sm font-normal text-gray-500">/month</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm font-medium">4.5</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-shrink-0">
                      {result.justification || result["Reason for recommendation"]}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3 flex-shrink-0">
                      {result.Amenities.slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {result.Amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{result.Amenities.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3 flex-shrink-0">
                      <span>📅 Available {result["Available from"]}</span>
                      <span>⏱️ {result["Length of stay"]}</span>
                    </div>
                    
                    <div className="mt-auto pt-3">
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => navigate(`/property/${result.id}`, { state: { property: result } })}
                      >
                        View Details
                      </Button>
                    </div>
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