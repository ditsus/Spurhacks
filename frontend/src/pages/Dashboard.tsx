// src/components/Dashboard.tsx

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Home,
  Settings,
  Users,
  TrendingUp,
  Clock,
  Star,
  MapPin,
  DollarSign,
  User as UserIcon,
  Heart,
  MessageCircle,
} from "lucide-react";

interface Housing {
  id: number;
  name: string;
  location: string;
  price: string;
  rating: number;
  image: string;
  visitedDate?: string;
  viewCount?: number;
  trendScore?: number;
}

interface Roommate {
  _id: string;
  name: string;
  major: string;
  year: string;
  avatarUrl?: string;
  compatibility: number;
  interests?: string[];
}

const HousingCard: React.FC<{
  housing: Housing;
  showDate?: boolean;
  showViews?: boolean;
  showTrend?: boolean;
}> = ({ housing, showDate = false, showViews = false, showTrend = false }) => (
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
      {showDate && housing.visitedDate && (
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {housing.visitedDate}
        </div>
      )}
      {showViews && housing.viewCount !== undefined && (
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1" />
          {housing.viewCount} students viewing
        </div>
      )}
      {showTrend && housing.trendScore !== undefined && (
        <div className="flex items-center">
          <TrendingUp className="h-4 w-4 mr-1" />
          Trending: {housing.trendScore}%
        </div>
      )}
    </div>
  </div>
);

const RoommateCard: React.FC<{ roommate: Roommate }> = ({ roommate }) => (
  <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-all duration-300 hover:scale-105">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center">
        <div className="text-3xl mr-3">
          {roommate.avatarUrl ? (
            <img
              src={roommate.avatarUrl}
              alt={roommate.name}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <UserIcon className="h-8 w-8 text-gray-400" />
          )}
        </div>
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
        {(roommate.interests ?? []).map((interest, idx) => (
          <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {interest}
          </span>
        ))}
      </div>
    </div>
    <div className="flex space-x-2">
      <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
        <MessageCircle className="h-4 w-4 mr-1" /> Message
      </Button>
      <Button size="sm" variant="outline" className="flex-1">View Profile</Button>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Mock housing data...
  const recentlyVisited: Housing[] = [ /* ... */ ];
  const studentActivity: Housing[] = [ /* ... */ ];
  const trendingHousing: Housing[] = [ /* ... */ ];

  // Fetch potential roommates
  const {
    data: roommates = [],
    isLoading: isLoadingRoommates,
    isError: isErrorRoommates,
  } = useQuery<Roommate[]>({
    queryKey: ["roommates"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3000/api/roommates");
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
  });

  useEffect(() => {
    setIsVisible(false);
    const timeout = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  const handleSurveyClick = () => window.location.href = "/housingsurvey";
  const handleHomeClick   = () => window.location.href = "/";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-white shadow-sm border-b transform transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Home className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Housely Dashboard</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={handleSurveyClick} className="bg-blue-600 hover:bg-blue-700">
              <Settings className="h-4 w-4 mr-2" /> Housing Preferences Survey
            </Button>
            <Button variant="outline" onClick={handleHomeClick}>Home</Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Recently Visited */}
        <section className={`mb-8 transform transition-all duration-700 delay-200 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}>
          <div className="flex items-center mb-4">
            <Clock className="h-6 w-6 text-gray-700 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Recently Visited</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyVisited.map(h => <HousingCard key={h.id} housing={h} showDate />)}
          </div>
        </section>

        {/* What Other Students Are Looking At */}
        <section className={`mb-8 transform transition-all duration-700 delay-400 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}>
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-gray-700 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">What Other Students Are Looking At</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentActivity.map(h => <HousingCard key={h.id} housing={h} showViews />)}
          </div>
        </section>

        {/* Trending Housing Options */}
        <section className={`mb-8 transform transition-all duration-700 delay-600 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}>
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-gray-700 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Trending Housing Options</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingHousing.map(h => <HousingCard key={h.id} housing={h} showTrend />)}
          </div>
        </section>

        {/* Potential Roommate Matches */}
        <section className={`transform transition-all duration-700 delay-800 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}>
          <div className="flex items-center mb-4">
            <UserIcon className="h-6 w-6 text-gray-700 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Potential Roommate Matches</h2>
          </div>

          {isLoadingRoommates && <p className="text-gray-600">Loading matches…</p>}
          {isErrorRoommates && <p className="text-red-600">Failed to load roommate matches.</p>}
          {!isLoadingRoommates && roommates.length === 0 && <p className="text-gray-600">No roommate matches found.</p>}
          {!isLoadingRoommates && roommates.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roommates.map(r => (
                <RoommateCard key={r._id} roommate={r} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
