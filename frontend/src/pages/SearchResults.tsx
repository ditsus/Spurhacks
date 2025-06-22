import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ArrowLeft, MapPin, DollarSign, Bed, Bath, Star, Heart, Building, Home, Sparkles, RefreshCw } from "lucide-react";
import SearchFilters from "@/components/SearchFilters";
import { cleanupOldSearches } from "@/lib/utils";

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
  postalCode?: string;
  propertyType?: string;
  aiScores?: {
    transit: number;
    quietness: number;
    location: number;
    safety: number;
    value: number;
  };
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
  const [usingCache, setUsingCache] = useState(false);

  const [filters, setFilters] = useState({
    priceRange: [0, 2000],
    propertyType: "",
    bedrooms: "",
    amenities: [],
    sortBy: ""
  });

  const resultsPerPage = 9;

  useEffect(() => {
    const parseApiResponse = async () => {
      try {
        setLoading(true);
        const location = searchParams.get('location');
        const minBudget = searchParams.get('minBudget');
        const maxBudget = searchParams.get('maxBudget');
        const preferences = searchParams.get('preferences');
        const searchKey = searchParams.get('searchKey');

        let data;
        let shouldMakeApiCall = true;

        // Check if we have cached results in localStorage
        if (searchKey) {
          const cachedData = localStorage.getItem(searchKey);
          if (cachedData) {
            try {
              const parsed = JSON.parse(cachedData);
              const cacheAge = Date.now() - parsed.timestamp;
              const maxCacheAge = 30 * 60 * 1000; // 30 minutes
              
              // Use cached data if it's less than 30 minutes old
              if (cacheAge < maxCacheAge) {
                data = { text: parsed.results };
                shouldMakeApiCall = false;
                console.log('Using cached search results');
                setUsingCache(true);
              } else {
                // Remove expired cache
                localStorage.removeItem(searchKey);
              }
            } catch (err) {
              console.error('Error parsing cached data:', err);
              localStorage.removeItem(searchKey);
            }
          } else {
            // No searchKey provided (e.g., bookmarked URL), will make new API call
            console.log('No searchKey found, will make new API call');
          }
        }

        // Make API call if no valid cache exists
        if (shouldMakeApiCall) {
          console.log('Making new API call for search results');
          const response = await fetch('https://spurhacks-ashj.vercel.app/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              location,
              budget: {
                min: minBudget ? parseInt(minBudget) : undefined,
                max: maxBudget ? parseInt(maxBudget) : undefined,
              },
              preferences,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch search results');
          }

          data = await response.json();
        }

        let parsedResults;

        // Try to extract JSON from the response
        const jsonMatch = data.text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsedResults = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Could not parse API response");
        }

        // Validate and clean the results
        const validResults = parsedResults.filter((result: any) => 
          result && result.title && result.link
        ).map((result: any, index: number) => {
          // Determine property type from title
          const title = result.title.toLowerCase();
          let propertyType = 'apartment';
          if (title.includes('house') || title.includes('home')) {
            propertyType = 'house';
          } else if (title.includes('studio')) {
            propertyType = 'studio';
          } else if (title.includes('shared') || title.includes('room')) {
            propertyType = 'shared';
          }

          // Generate AI scores (simulated for now)
          const aiScores = {
            transit: Math.floor(Math.random() * 4) + 7, // 7-10
            quietness: Math.floor(Math.random() * 4) + 6, // 6-10
            location: Math.floor(Math.random() * 4) + 7, // 7-10
            safety: Math.floor(Math.random() * 3) + 7, // 7-10
            value: Math.floor(Math.random() * 4) + 6, // 6-10
          };

          return {
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
            Images: result.Images || [],
            postalCode: `K${Math.floor(Math.random() * 9) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 26))} ${Math.floor(Math.random() * 9) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 9) + 1}`,
            propertyType,
            aiScores
          };
        });

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

    // Cleanup function to remove old search data (older than 1 hour)
    cleanupOldSearches();
  }, [searchParams]);

  // Apply filters when filters change
  useEffect(() => {
    let filtered = [...results];

    // Filter by price range
    filtered = filtered.filter(result => {
      const price = parseFloat(result.Price.replace(/[^0-9.]/g, '')) || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Filter by property type
    if (filters.propertyType) {
      filtered = filtered.filter(result => {
        return result.propertyType === filters.propertyType;
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

    // Sort results
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-asc':
            const priceA = parseFloat(a.Price.replace(/[^0-9.]/g, '')) || 0;
            const priceB = parseFloat(b.Price.replace(/[^0-9.]/g, '')) || 0;
            return priceA - priceB;
          case 'price-desc':
            const priceC = parseFloat(a.Price.replace(/[^0-9.]/g, '')) || 0;
            const priceD = parseFloat(b.Price.replace(/[^0-9.]/g, '')) || 0;
            return priceD - priceC;
          case 'rating':
            // For now, use a default rating of 4.5 for all properties
            return 0; // Could be enhanced with actual rating data
          case 'newest':
            // For now, maintain original order
            return 0; // Could be enhanced with actual date data
          default:
            return 0;
        }
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

  const refreshResults = async () => {
    const location = searchParams.get('location');
    const minBudget = searchParams.get('minBudget');
    const maxBudget = searchParams.get('maxBudget');
    const preferences = searchParams.get('preferences');
    const searchKey = searchParams.get('searchKey');

    if (!location || !preferences) {
      setError("Missing search parameters for refresh");
      return;
    }

    setLoading(true);
    setUsingCache(false);
    setError(null);

    try {
      const response = await fetch('https://spurhacks-ashj.vercel.app/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location,
          budget: {
            min: minBudget ? parseInt(minBudget) : undefined,
            max: maxBudget ? parseInt(maxBudget) : undefined,
          },
          preferences,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch fresh search results');
      }

      const data = await response.json();
      
      // Update the cache with fresh data
      if (searchKey) {
        localStorage.setItem(searchKey, JSON.stringify({
          results: data.text,
          timestamp: Date.now(),
          searchParams: {
            location,
            minBudget: minBudget ? parseInt(minBudget) : undefined,
            maxBudget: maxBudget ? parseInt(maxBudget) : undefined,
            preferences
          }
        }));
      }

      // Parse and set the new results
      const jsonMatch = data.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsedResults = JSON.parse(jsonMatch[0]);
        const validResults = parsedResults.filter((result: any) => 
          result && result.title && result.link
        ).map((result: any, index: number) => {
          const title = result.title.toLowerCase();
          let propertyType = 'apartment';
          if (title.includes('house') || title.includes('home')) {
            propertyType = 'house';
          } else if (title.includes('studio')) {
            propertyType = 'studio';
          } else if (title.includes('shared') || title.includes('room')) {
            propertyType = 'shared';
          }

          const aiScores = {
            transit: Math.floor(Math.random() * 4) + 7,
            quietness: Math.floor(Math.random() * 4) + 6,
            location: Math.floor(Math.random() * 4) + 7,
            safety: Math.floor(Math.random() * 3) + 7,
            value: Math.floor(Math.random() * 4) + 6,
          };

          return {
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
            Images: result.Images || [],
            postalCode: `K${Math.floor(Math.random() * 9) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 26))} ${Math.floor(Math.random() * 9) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 9) + 1}`,
            propertyType,
            aiScores
          };
        });

        setResults(validResults);
        setFilteredResults(validResults);
      } else {
        throw new Error("Could not parse fresh API response");
      }
    } catch (err) {
      console.error("Error refreshing results:", err);
      setError("Failed to refresh search results");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const currentResults = filteredResults.slice(startIndex, endIndex);

  const location = searchParams.get('location') || 'Unknown Location';
  const minBudget = searchParams.get('minBudget');
  const maxBudget = searchParams.get('maxBudget');

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'house': return <Home className="w-4 h-4" />;
      case 'apartment': return <Building className="w-4 h-4" />;
      default: return <Building className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 7) return 'text-blue-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            {usingCache ? 'Loading Cached Results' : 'Processing Search Results'}
          </h2>
          <p className="text-gray-500">
            {usingCache 
              ? 'Retrieving your previous search results...' 
              : `Analyzing housing options in ${location}...`
            }
          </p>
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
    <div className="min-h-screen bg-gray-50 page-transition">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 btn-animate"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Search</span>
              </Button>
              {usingCache && (
                <Button
                  variant="outline"
                  onClick={refreshResults}
                  disabled={loading}
                  className="flex items-center space-x-2 btn-animate"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh Results</span>
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Sparkles className="w-6 h-6 mr-2 text-blue-600" />
                  AI Powered Search Results
                </h1>
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
              <p className="text-xs text-blue-600 font-medium">
                Powered by Housely
                {usingCache && (
                  <span className="ml-2 text-green-600">• Cached</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Filters */}
      <SearchFilters filters={filters} setFilters={setFilters} />

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        {currentResults.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No properties found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentResults.map((result) => (
                <Card key={result.id} className="overflow-hidden card-hover flex flex-col h-full group">
                  {/* Image Section */}
                  <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {result.Images && result.Images.length > 0 ? (
                      <img
                        src={result.Images[0]}
                        alt={result.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
                      className={`absolute top-2 left-2 p-2 h-auto bg-white/90 hover:bg-white btn-animate ${
                        favorites.has(result.id) ? 'text-red-500' : 'text-gray-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${favorites.has(result.id) ? 'fill-current' : ''}`} />
                    </Button>
                    {/* Property type badge */}
                    <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      {getPropertyTypeIcon(result.propertyType || 'apartment')}
                      <span className="ml-1 capitalize">{result.propertyType || 'apartment'}</span>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                          {result.title}
                        </CardTitle>
                        <div className="flex items-center text-gray-600 text-sm mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          {result.postalCode || 'Postal code unavailable'}
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
                    
                    {/* AI Scores */}
                    {result.aiScores && (
                      <div className="mb-3 flex-shrink-0">
                        <div className="grid grid-cols-5 gap-1 text-xs">
                          <div className="text-center score-badge">
                            <div className={`font-semibold ${getScoreColor(result.aiScores.transit)}`}>
                              {result.aiScores.transit}/10
                            </div>
                            <div className="text-gray-500">Transit</div>
                          </div>
                          <div className="text-center score-badge">
                            <div className={`font-semibold ${getScoreColor(result.aiScores.quietness)}`}>
                              {result.aiScores.quietness}/10
                            </div>
                            <div className="text-gray-500">Quiet</div>
                          </div>
                          <div className="text-center score-badge">
                            <div className={`font-semibold ${getScoreColor(result.aiScores.location)}`}>
                              {result.aiScores.location}/10
                            </div>
                            <div className="text-gray-500">Location</div>
                          </div>
                          <div className="text-center score-badge">
                            <div className={`font-semibold ${getScoreColor(result.aiScores.safety)}`}>
                              {result.aiScores.safety}/10
                            </div>
                            <div className="text-gray-500">Safety</div>
                          </div>
                          <div className="text-center score-badge">
                            <div className={`font-semibold ${getScoreColor(result.aiScores.value)}`}>
                              {result.aiScores.value}/10
                            </div>
                            <div className="text-gray-500">Value</div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mb-3 flex-shrink-0">
                      {result.Amenities.slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs filter-badge">
                          {amenity}
                        </Badge>
                      ))}
                      {result.Amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs filter-badge">
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
                        className="w-full bg-blue-600 hover:bg-blue-700 btn-animate"
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
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer btn-animate'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        className={`${currentPage === page ? 'bg-blue-600 text-white' : 'cursor-pointer'} btn-animate`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer btn-animate'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;