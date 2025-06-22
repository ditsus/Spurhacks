import { Button } from "@/components/ui/button";
import { Home, Settings, Users, TrendingUp, Clock, Star, MapPin, DollarSign, User, Heart, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const resetTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(resetTimeout);
  }, []);

  const handleSurveyClick = () => {
    // Navigate to housing preferences survey
    window.location.href = '/housingsurvey';
  };

  const handleHomeClick = () => {
    window.location.href = '/';
  };

  // Mock data for recently visited housing
  const recentlyVisited = [
    {
      id: 1,
      name: "Maple Heights Apartments",
      location: "2.1 miles from campus",
      price: "$850/month",
      rating: 4.5,
      image: "🏢",
      visitedDate: "2 days ago"
    },
    {
      id: 2,
      name: "University Commons",
      location: "0.8 miles from campus",
      price: "$720/month",
      rating: 4.2,
      image: "🏠",
      visitedDate: "1 week ago"
    },
    {
      id: 3,
      name: "Campus View Towers",
      location: "1.5 miles from campus",
      price: "$950/month",
      rating: 4.7,
      image: "🏗️",
      visitedDate: "2 weeks ago"
    }
  ];

  // Mock data for what other students are looking at
  const studentActivity = [
    {
      id: 1,
      name: "Oak Street Residences",
      location: "1.2 miles from campus",
      price: "$780/month",
      rating: 4.3,
      image: "🏘️",
      viewCount: 42
    },
    {
      id: 2,
      name: "Sunset Plaza",
      location: "2.5 miles from campus",
      price: "$890/month",
      rating: 4.6,
      image: "🌅",
      viewCount: 38
    },
    {
      id: 3,
      name: "Pine Grove Apartments",
      location: "1.8 miles from campus",
      price: "$650/month",
      rating: 4.1,
      image: "🌲",
      viewCount: 35
    }
  ];

  // Mock data for trending housing
  const trendingHousing = [
    {
      id: 1,
      name: "The Quad",
      location: "On campus",
      price: "$1200/month",
      rating: 4.8,
      image: "🎓",
      trendScore: 95
    },
    {
      id: 2,
      name: "Green Valley Suites",
      location: "1.0 miles from campus",
      price: "$825/month",
      rating: 4.4,
      image: "🌿",
      trendScore: 89
    },
    {
      id: 3,
      name: "Metro Student Living",
      location: "0.5 miles from campus",
      price: "$1050/month",
      rating: 4.6,
      image: "🚇",
      trendScore: 87
    }
  ];

  // Mock data for potential roommates
  const potentialRoommates = [
    {
      id: 1,
      name: "Sarah Chen",
      major: "Computer Science",
      year: "Junior",
      compatibility: 92,
      interests: ["Study groups", "Quiet environment", "Clean"],
      image: "👩‍💻"
    },
    {
      id: 2,
      name: "Mike Rodriguez",
      major: "Business",
      year: "Sophomore",
      compatibility: 87,
      interests: ["Social activities", "Cooking", "Gym"],
      image: "👨‍💼"
    },
    {
      id: 3,
      name: "Emma Johnson",
      major: "Biology",
      year: "Senior",
      compatibility: 84,
      interests: ["Quiet study", "Plants", "Early riser"],
      image: "👩‍🔬"
    }
  ];

  const HousingCard = ({ housing, showDate = false, showViews = false, showTrend = false }) => (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
      <div className="flex items-center justify-between mb-3">
        <div className="text-3xl">{housing.image}</div>
        <div className="flex items-center text-yellow-500">
          <Star className="h-4 w-4 fill-current" />
          <span className="ml-1 text-sm font-medium text-gray-700">{housing.rating}</span>
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{housing.name}</h3>
      <div className="space-y-1 text-sm text-gray-600">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {housing.location}
        </div>
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 mr-1" />
          {housing.price}
        </div>
        {showDate && (
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {housing.visitedDate}
          </div>
        )}
        {showViews && (
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {housing.viewCount} students viewing
          </div>
        )}
        {showTrend && (
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            Trending: {housing.trendScore}%
          </div>
        )}
      </div>
    </div>
  );

  const RoommateCard = ({ roommate }) => (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="text-3xl mr-3">{roommate.image}</div>
          <div>
            <h3 className="font-semibold text-gray-900">{roommate.name}</h3>
            <p className="text-sm text-gray-600">{roommate.major} • {roommate.year}</p>
          </div>
        </div>
        <div className="flex items-center text-green-500">
          <Heart className="h-4 w-4 fill-current" />
          <span className="ml-1 text-sm font-medium">{roommate.compatibility}%</span>
        </div>
      </div>
      <div className="mb-3">
        <div className="flex flex-wrap gap-1">
          {roommate.interests.map((interest, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {interest}
            </span>
          ))}
        </div>
      </div>
      <div className="flex space-x-2">
        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 transition-colors">
          <MessageCircle className="h-4 w-4 mr-1" />
          Message
        </Button>
        <Button size="sm" variant="outline" className="flex-1 hover:bg-gray-50 transition-colors">
          View Profile
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-white shadow-sm border-b transform transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Housely Dashboard</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={handleSurveyClick}
                className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105"
              >
                <Settings className="h-4 w-4 mr-2" />
                Housing Preferences Survey
              </Button>
              <Button 
                variant="outline" 
                onClick={handleHomeClick}
                className="hover:bg-gray-50 transition-colors"
              >
                Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Recently Visited */}
        <div className={`mb-8 transform transition-all duration-700 delay-200 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="flex items-center mb-4">
            <Clock className="h-6 w-6 text-gray-700 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Recently Visited</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyVisited.map((housing) => (
              <HousingCard key={housing.id} housing={housing} showDate={true} />
            ))}
          </div>
        </div>

        {/* What Other Students Are Looking At */}
        <div className={`mb-8 transform transition-all duration-700 delay-400 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-gray-700 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">What Other Students Are Looking At</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentActivity.map((housing) => (
              <HousingCard key={housing.id} housing={housing} showViews={true} />
            ))}
          </div>
        </div>

        {/* Trending Housing Options */}
        <div className={`mb-8 transform transition-all duration-700 delay-600 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-gray-700 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Trending Housing Options</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingHousing.map((housing) => (
              <HousingCard key={housing.id} housing={housing} showTrend={true} />
            ))}
          </div>
        </div>

        {/* Potential Roommate Matches */}
        <div className={`transform transition-all duration-700 delay-800 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <div className="flex items-center mb-4">
            <User className="h-6 w-6 text-gray-700 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Potential Roommate Matches</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {potentialRoommates.map((roommate) => (
              <RoommateCard key={roommate.id} roommate={roommate} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;