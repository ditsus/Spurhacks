import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Bed, 
  Bath, 
  Star, 
  Heart,
  Bus,
  GraduationCap,
  VolumeX,
  Shield,
  ShoppingBag,
  DollarSign,
  Check,
  X,
  Lightbulb
} from 'lucide-react';

interface PropertyAnalysis {
  overallScore: number;
  ratings: {
    transit: { score: number; description: string };
    schools: { score: number; description: string };
    quietness: { score: number; description: string };
    safety: { score: number; description: string };
    amenities: { score: number; description: string };
    value: { score: number; description: string };
  };
  aiDescription: string;
  pros: string[];
  cons: string[];
  recommendations: string[];
}

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const property = location.state?.property;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [analysis, setAnalysis] = useState<PropertyAnalysis | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!property) {
      navigate('/');
      return;
    }

    // Load property analysis
    const loadAnalysis = async () => {
      try {
        const response = await fetch('https://spurhacks-ashj.vercel.app/api/property-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            propertyData: property,
            userPreferences: {} // Could be enhanced with user preferences
          }),
        });

        if (response.ok) {
          const analysisData = await response.json();
          setAnalysis(analysisData);
        } else {
          console.error('Failed to load property analysis');
        }
      } catch (error) {
        console.error('Error loading property analysis:', error);
      } finally {
        setLoadingAnalysis(false);
      }
    };

    loadAnalysis();
  }, [property, navigate]);

  const nextImage = () => {
    if (property.Images && property.Images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === property.Images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property.Images && property.Images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.Images.length - 1 : prev - 1
      );
    }
  };

  const toggleFavorite = () => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(property.id)) {
      newFavorites.delete(property.id);
    } else {
      newFavorites.add(property.id);
    }
    setFavorites(newFavorites);
  };

  const getRatingIcon = (category: string) => {
    switch (category) {
      case 'transit': return <Bus className="w-5 h-5" />;
      case 'schools': return <GraduationCap className="w-5 h-5" />;
      case 'quietness': return <VolumeX className="w-5 h-5" />;
      case 'safety': return <Shield className="w-5 h-5" />;
      case 'amenities': return <ShoppingBag className="w-5 h-5" />;
      case 'value': return <DollarSign className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getRatingColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!property) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Results</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
                <p className="text-gray-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {property.Location ? `${property.Location[0]}, ${property.Location[1]}` : 'Location unavailable'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={toggleFavorite}
              className={`p-2 ${favorites.has(property.id) ? 'text-red-500' : 'text-gray-400'}`}
            >
              <Heart className={`w-6 h-6 ${favorites.has(property.id) ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Carousel */}
            <Card className="overflow-hidden">
              <div className="relative h-96 bg-gray-200">
                {property.Images && property.Images.length > 0 ? (
                  <>
                    <img
                      src={property.Images[currentImageIndex]}
                      alt={`${property.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    {/* Navigation Arrows */}
                    {property.Images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </Button>
                      </>
                    )}
                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {property.Images.length}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="text-gray-400 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p>No images available</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Thumbnail Navigation */}
              {property.Images && property.Images.length > 1 && (
                <div className="p-4 bg-white">
                  <div className="flex space-x-2 overflow-x-auto">
                    {property.Images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                          index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Property Details</span>
                  <div className="text-2xl font-bold text-blue-600">
                    {property.Price}
                    <span className="text-sm font-normal text-gray-500">/month</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Bed className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-600">Bedrooms</p>
                    <p className="font-semibold">{property.Beds}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Bath className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-600">Bathrooms</p>
                    <p className="font-semibold">{property.Baths}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <MapPin className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-600">Available</p>
                    <p className="font-semibold">{property["Available from"]}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="font-semibold">4.5/5</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.Amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Original Description</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {property.justification || property["Reason for recommendation"] || "No description available."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis */}
            {analysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-blue-600" />
                    AI Property Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {analysis.overallScore}/100
                    </div>
                    <p className="text-gray-600">Overall Score</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(analysis.ratings).map(([category, rating]) => (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getRatingIcon(category)}
                            <span className="font-medium capitalize">{category}</span>
                          </div>
                          <span className={`font-semibold ${getRatingColor(rating.score)}`}>
                            {rating.score}/100
                          </span>
                        </div>
                        <Progress value={rating.score} className="h-2" />
                        <p className="text-sm text-gray-600">{rating.description}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">AI Recommendation</h3>
                    <p className="text-gray-700 leading-relaxed">{analysis.aiDescription}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center">
                        <Check className="w-4 h-4 mr-2 text-green-600" />
                        Pros
                      </h3>
                      <ul className="space-y-1">
                        {analysis.pros.map((pro, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <Check className="w-4 h-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center">
                        <X className="w-4 h-4 mr-2 text-red-600" />
                        Cons
                      </h3>
                      <ul className="space-y-1">
                        {analysis.cons.map((con, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <X className="w-4 h-4 mr-2 text-red-600 mt-0.5 flex-shrink-0" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {analysis.recommendations.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Recommendations</h3>
                      <ul className="space-y-1">
                        {analysis.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <Lightbulb className="w-4 h-4 mr-2 text-blue-600 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact & Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.open(property.link, '_blank')}
                  >
                    Contact Property Manager
                  </Button>
                  <Button variant="outline" className="w-full">
                    Schedule Viewing
                  </Button>
                  <Button variant="outline" className="w-full">
                    Save to Favorites
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                {property.Location ? (
                  <div className="h-64 rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAgL_9nwW6Xz4D1zyVi9XgZa0hrWkSG46M&q=${property.Location[0]},${property.Location[1]}`}
                    />
                  </div>
                ) : (
                  <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Location unavailable</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Loading Analysis */}
            {loadingAnalysis && (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-sm text-gray-600">Analyzing property...</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails; 