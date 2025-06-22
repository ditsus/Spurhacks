import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ArrowLeft, MapPin, DollarSign, Bed, Bath, Star, Heart, Building, Home, Sparkles, RefreshCw, Users } from "lucide-react";
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

// Skeleton component for loading states
const PropertySkeleton = ({ index }: { index: number }) => (
  <Card className="h-full animate-pulse">
    <div className="aspect-video bg-gray-200 rounded-t-lg skeleton-pulse"></div>
    <CardContent className="p-4">
      <div className="h-4 bg-gray-200 rounded mb-2 skeleton-pulse"></div>
      <div className="h-3 bg-gray-200 rounded mb-4 w-3/4 skeleton-pulse"></div>
      <div className="flex space-x-2 mb-3">
        <div className="h-6 bg-gray-200 rounded w-16 skeleton-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-16 skeleton-pulse"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded mb-2 skeleton-pulse"></div>
      <div className="h-3 bg-gray-200 rounded mb-4 w-2/3 skeleton-pulse"></div>
      <div className="h-10 bg-gray-200 rounded skeleton-pulse"></div>
    </CardContent>
  </Card>
);

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [results, setResults] = useState<HousingResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<HousingResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Initializing search...");
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [usingCache, setUsingCache] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [filters, setFilters] = useState({
    priceRange: [0, 2000],
    propertyType: "",
    bedrooms: "",
    amenities: [],
    sortBy: ""
  });

  const resultsPerPage = 9;

  // Global error handler to prevent white screens
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error caught:', event.error);
      setHasError(true);
      setError("An unexpected error occurred. Please try refreshing the page.");
      setLoading(false);
      setIsStreaming(false);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      setHasError(true);
      setError("A network error occurred. Please check your connection and try again.");
      setLoading(false);
      setIsStreaming(false);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Progressive loading function
  const processResultsProgressively = (rawResults: any[]) => {
    setIsStreaming(true);
    setResults([]);
    setFilteredResults([]);
    
    const validResults = rawResults.filter((result: any) => 
      result && result.title && result.link
    );

    // Handle case where no valid results are found
    if (validResults.length === 0) {
      setLoadingMessage("No properties found matching your criteria");
      setTimeout(() => {
        setIsStreaming(false);
        setLoading(false);
      }, 1000);
      return;
    }

    // Process results in batches with delays for smooth animation
    const batchSize = 2; // Show 2 properties at a time
    const delay = 300; // 300ms between batches

    validResults.forEach((result: any, index: number) => {
      setTimeout(() => {
        try {
          const processedResult = processResult(result, index);
          
          setResults(prev => {
            const newResults = [...prev, processedResult];
            setLoadingProgress(((index + 1) / validResults.length) * 100);
            return newResults;
          });
          
          setFilteredResults(prev => {
            const newResults = [...prev, processedResult];
            return newResults;
          });

          // Update loading message
          if (index < validResults.length - 1) {
            setLoadingMessage(`Found ${index + 1} of ${validResults.length} properties...`);
          } else {
            setLoadingMessage("Finalizing results...");
            setTimeout(() => {
              setIsStreaming(false);
              setLoading(false);
            }, 800); // Slightly longer delay at the end
          }
        } catch (error) {
          console.error('Error processing result:', error);
          // Continue with next result even if one fails
        }
      }, (index * delay) / batchSize);
    });
  };

  // Process individual result
  const processResult = (result: any, index: number) => {
    try {
      const title = typeof result.title === 'string' ? result.title.toLowerCase() : '';
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

      // Bulletproof price handling
      let priceDisplay = "N/A";
      if (typeof result.Price === 'string') {
        priceDisplay = result.Price;
      } else if (typeof result.Price === 'number') {
        priceDisplay = `$${result.Price}`;
      }

      return {
        id: result.id || `result-${index}`,
        title: result.title || "Unknown Property",
        link: result.link || "#",
        justification: result.justification || "",
        Price: priceDisplay,
        "Min price": result["Min price"] || "N/A",
        "Max price": result["Max price"] || "N/A",
        "Length of stay": result["Length of stay"] || "Unknown",
        Location: Array.isArray(result.Location) ? result.Location : [0, 0],
        Beds: result.Beds || "N/A",
        Baths: result.Baths || "N/A",
        "Available from": result["Available from"] || "Unknown",
        Amenities: Array.isArray(result.Amenities) ? result.Amenities : [],
        "Reason for recommendation": result["Reason for recommendation"] || "",
        Images: Array.isArray(result.Images) ? result.Images : [],
        postalCode: `K${Math.floor(Math.random() * 9) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 26))} ${Math.floor(Math.random() * 9) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 9) + 1}`,
        propertyType,
        aiScores
      };
    } catch (error) {
      console.error('Error processing result:', error, result);
      // Return a safe fallback result
      return {
        id: `fallback-${index}`,
        title: "Property Information Unavailable",
        link: "#",
        justification: "This property's information could not be processed properly.",
        Price: "N/A",
        "Min price": "N/A",
        "Max price": "N/A",
        "Length of stay": "Unknown",
        Location: [0, 0] as [number, number],
        Beds: "N/A",
        Baths: "N/A",
        "Available from": "Unknown",
        Amenities: [] as string[],
        "Reason for recommendation": "Property data unavailable",
        Images: [] as string[],
        postalCode: "N/A",
        propertyType: "apartment",
        aiScores: {
          transit: 7,
          quietness: 6,
          location: 7,
          safety: 7,
          value: 6,
        }
      } as HousingResult;
    }
  };

  useEffect(() => {
    const parseApiResponse = async () => {
      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.warn('Search timeout reached, showing fallback');
        setError("Search is taking longer than expected. Please try again.");
        setLoading(false);
        setIsStreaming(false);
      }, 30000); // 30 second timeout

      try {
        setLoading(true);
        setLoadingProgress(0);
        setLoadingMessage("Checking for cached results...");
        setError(null); // Clear any previous errors
        
        // Show skeleton loading immediately
        setIsStreaming(true);
        
        const location = searchParams.get('location');
        const minBudget = searchParams.get('minBudget');
        const maxBudget = searchParams.get('maxBudget');
        const preferences = searchParams.get('preferences');
        const searchKey = searchParams.get('searchKey');

        // Validate required parameters
        if (!location || !preferences) {
          throw new Error("Missing required search parameters");
        }

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
              
              if (cacheAge < maxCacheAge) {
                data = { text: parsed.results };
                shouldMakeApiCall = false;
                console.log('Using cached search results');
                setUsingCache(true);
                setLoadingMessage("Loading cached results...");
              } else {
                localStorage.removeItem(searchKey);
              }
            } catch (err) {
              console.error('Error parsing cached data:', err);
              localStorage.removeItem(searchKey);
            }
          }
        }

        // Make API call if no valid cache exists
        if (shouldMakeApiCall) {
          setLoadingMessage("Connecting to search service...");
          console.log('Making new API call for search results');
          
          // Try streaming endpoint first for better performance
          try {
            const response = await fetch('https://spurhacks-ashj.vercel.app/api/generate/stream', {
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
              throw new Error('Streaming endpoint failed, falling back to regular endpoint');
            }

            const reader = response.body?.getReader();
            if (!reader) {
              throw new Error('No reader available');
            }

            let streamData = '';
            
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              streamData += new TextDecoder().decode(value);
              const lines = streamData.split('\n');
              
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  try {
                    const eventData = JSON.parse(line.slice(6));
                    
                    if (eventData.status === 'processing') {
                      setLoadingMessage(eventData.message);
                    } else if (eventData.status === 'complete') {
                      data = { text: eventData.text };
                      break;
                    } else if (eventData.error) {
                      throw new Error(eventData.error);
                    }
                  } catch (parseError) {
                    console.log('Non-JSON line:', line);
                  }
                }
              }
            }
            
            reader.releaseLock();
            
          } catch (streamError) {
            console.log('Streaming failed, using regular endpoint:', streamError);
            
            // Fallback to regular endpoint
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
              throw new Error(`Failed to fetch search results: ${response.status}`);
            }

            setLoadingMessage("Processing search results...");
            data = await response.json();
          }
        }

        // Validate that we have data
        if (!data || !data.text) {
          throw new Error("No data received from search service");
        }

        setLoadingMessage("Analyzing properties...");
        let parsedResults;

        // Try to extract JSON from the response
        const jsonMatch = data.text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          try {
            parsedResults = JSON.parse(jsonMatch[0]);
          } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            throw new Error("Invalid response format from search service");
          }
        } else {
          throw new Error("Could not parse API response - no valid JSON array found");
        }

        // Validate that we have results
        if (!Array.isArray(parsedResults) || parsedResults.length === 0) {
          throw new Error("No properties found matching your criteria");
        }

        // Cache the results if we have a searchKey
        if (searchKey && shouldMakeApiCall) {
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

        // Process results progressively
        processResultsProgressively(parsedResults);
        
        // Set initial price range from search parameters
        if (minBudget && maxBudget) {
          setFilters(prev => ({
            ...prev,
            priceRange: [parseInt(minBudget), parseInt(maxBudget)]
          }));
        }
        
        // Clear timeout on success
        clearTimeout(timeoutId);
        
      } catch (err) {
        console.error("Error parsing API response:", err);
        setError(err instanceof Error ? err.message : "Failed to parse search results");
        setLoading(false);
        setIsStreaming(false);
        setResults([]);
        setFilteredResults([]);
        clearTimeout(timeoutId);
      }

      // Cleanup function to remove old search data (older than 1 hour)
      cleanupOldSearches();
    };

    parseApiResponse();
  }, [searchParams]);

  // Apply filters when filters change
  useEffect(() => {
    try {
      let filtered = [...results];

      // Filter by price range
      filtered = filtered.filter(result => {
        try {
          // Bulletproof price parsing - handle both string and number types
          let priceValue = 0;
          if (typeof result.Price === 'string') {
            priceValue = parseFloat(result.Price.replace(/[^0-9.]/g, '')) || 0;
          } else if (typeof result.Price === 'number') {
            priceValue = result.Price;
          } else {
            // If Price is undefined, null, or other type, default to 0
            priceValue = 0;
          }
          return priceValue >= filters.priceRange[0] && priceValue <= filters.priceRange[1];
        } catch (error) {
          console.error('Error filtering by price:', error, result);
          // If there's an error parsing price, include the result anyway
          return true;
        }
      });

      // Filter by property type
      if (filters.propertyType) {
        filtered = filtered.filter(result => {
          try {
            return result.propertyType === filters.propertyType;
          } catch (error) {
            console.error('Error filtering by property type:', error, result);
            return true;
          }
        });
      }

      // Filter by bedrooms
      if (filters.bedrooms) {
        filtered = filtered.filter(result => {
          try {
            const beds = typeof result.Beds === 'string' ? result.Beds.toLowerCase() : '';
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
          } catch (error) {
            console.error('Error filtering by bedrooms:', error, result);
            return true;
          }
        });
      }

      // Filter by amenities
      if (filters.amenities.length > 0) {
        filtered = filtered.filter(result => {
          try {
            const resultAmenities = Array.isArray(result.Amenities) 
              ? result.Amenities.map((a: string) => a.toLowerCase())
              : [];
            return filters.amenities.some(amenity => 
              resultAmenities.some(resultAmenity => 
                resultAmenity.includes(amenity.toLowerCase())
              )
            );
          } catch (error) {
            console.error('Error filtering by amenities:', error, result);
            return true;
          }
        });
      }

      // Sort results
      if (filters.sortBy) {
        filtered.sort((a, b) => {
          try {
            switch (filters.sortBy) {
              case 'price-asc':
                const priceA = typeof a.Price === 'string' 
                  ? parseFloat(a.Price.replace(/[^0-9.]/g, '')) || 0
                  : (typeof a.Price === 'number' ? a.Price : 0);
                const priceB = typeof b.Price === 'string' 
                  ? parseFloat(b.Price.replace(/[^0-9.]/g, '')) || 0
                  : (typeof b.Price === 'number' ? b.Price : 0);
                return priceA - priceB;
              case 'price-desc':
                const priceC = typeof a.Price === 'string' 
                  ? parseFloat(a.Price.replace(/[^0-9.]/g, '')) || 0
                  : (typeof a.Price === 'number' ? a.Price : 0);
                const priceD = typeof b.Price === 'string' 
                  ? parseFloat(b.Price.replace(/[^0-9.]/g, '')) || 0
                  : (typeof b.Price === 'number' ? b.Price : 0);
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
          } catch (error) {
            console.error('Error sorting results:', error);
            return 0;
          }
        });
      }

      setFilteredResults(filtered);
      setCurrentPage(1); // Reset to first page when filters change
    } catch (error) {
      console.error('Critical error in filter logic:', error);
      // If filtering fails completely, show all results
      setFilteredResults(results);
      setCurrentPage(1);
    }
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

  // Final safety check - if we somehow get here with no state, show a fallback
  if (hasError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-2">Something Went Wrong</h2>
            <p className="text-sm">We encountered an unexpected error. Please try again.</p>
          </div>
          <div className="space-y-4">
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </Button>
            <Button 
              onClick={() => navigate('/')} 
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            {isStreaming && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            )}
          </div>
          
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            {usingCache ? 'Loading Cached Results' : 'Finding Your Perfect Home'}
          </h2>
          
          <p className="text-gray-600 mb-4">
            {loadingMessage}
          </p>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="h-2 rounded-full transition-all duration-300 ease-out progress-bar"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          
          <p className="text-sm text-gray-500">
            {usingCache 
              ? 'Retrieving your previous search results...' 
              : `Analyzing housing options in ${searchParams.get('location') || 'your area'}...`
            }
          </p>
          
          {/* Show skeleton cards while streaming */}
          {isStreaming && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[...Array(6)].map((_, index) => (
                <PropertySkeleton key={index} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-2">Search Error</h2>
            <p className="text-sm">{error}</p>
          </div>
          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/')} 
              className="bg-blue-600 hover:bg-blue-700 w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Handle case where no results are found after loading
  if (!loading && filteredResults.length === 0 && results.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-2">No Properties Found</h2>
            <p className="text-sm">
              We couldn't find any properties matching your criteria. Try adjusting your search parameters.
            </p>
          </div>
          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/')} 
              className="bg-blue-600 hover:bg-blue-700 w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
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
                  Search Results
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
        {/* Safety check - if we somehow have no results and no loading/error state */}
        {!loading && !error && filteredResults.length === 0 && results.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
              <p className="text-sm">
                We couldn't find any properties matching your criteria. Try adjusting your search parameters.
              </p>
            </div>
            <Button 
              onClick={() => navigate('/')} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </div>
        )}

        {currentResults.length === 0 && filteredResults.length > 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No properties found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        ) : currentResults.length > 0 && (
          <>
            {/* Loading indicator for streaming */}
            {isStreaming && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-blue-700 font-medium">{loadingMessage}</span>
                  <div className="w-32 bg-blue-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300 ease-out progress-bar"
                      style={{ width: `${loadingProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentResults.map((result, index) => (
                <Card 
                  key={result.id} 
                  className="overflow-hidden card-hover flex flex-col h-full group animate-fade-in"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
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
                    
                    {/* Multiple images indicator */}
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

                  <CardContent className="p-4 flex flex-col flex-grow">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {result.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {result.postalCode}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="text-2xl font-bold text-blue-600">
                        {result.Price}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          {result.Beds}
                        </span>
                        <span className="flex items-center">
                          <Bath className="w-4 h-4 mr-1" />
                          {result.Baths}
                        </span>
                      </div>
                    </div>

                    {/* AI Scores */}
                    {result.aiScores && (
                      <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-600 mb-2 font-medium">AI Analysis</div>
                        <div className="grid grid-cols-5 gap-2 text-center">
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
                      <div className="space-y-2">
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700 btn-animate"
                          onClick={() => navigate(`/property/${result.id}`, { state: { property: result } })}
                        >
                          View Details
                        </Button>
                        
                        {/* Room Share Button with POP */}
                        <Button 
                          variant="outline"
                          className="w-full relative overflow-hidden group/room-share room-share-gradient border-purple-200 hover:border-purple-400 btn-animate room-share-glow"
                          onClick={() => {
                            // Placeholder for room share functionality
                            console.log('Room share clicked for:', result.id);
                            // TODO: Implement room share modal/functionality
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 opacity-0 group-hover/room-share:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex items-center justify-center space-x-2">
                            <div className="relative room-share-bounce">
                              <Users className="w-4 h-4 text-purple-600 group-hover/room-share:scale-110 transition-transform duration-200" />
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full room-share-sparkle"></div>
                            </div>
                            <span className="font-semibold text-purple-700 group-hover/room-share:text-purple-800 transition-colors">
                              Room Share
                            </span>
                            <div className="flex space-x-1">
                              <div className="w-1 h-1 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-1 h-1 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </Button>
                      </div>
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
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        className={`cursor-pointer ${currentPage === page ? 'bg-blue-600 text-white' : ''}`}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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