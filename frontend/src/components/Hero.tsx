import React, { useState, useRef, useCallback, useEffect } from "react";
import { Search, MapPin, DollarSign, Loader2, Home, Building, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { createSearchUrl } from "@/lib/utils";

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Hero = ({ searchQuery, setSearchQuery }: HeroProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [budgetRange, setBudgetRange] = useState([500, 1500]);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const [inputValues, setInputValues] = useState({ min: '500', max: '1500' });
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Initializing search...");
  const [error, setError] = useState("");
  const [searchStage, setSearchStage] = useState<'idle' | 'connecting' | 'processing' | 'analyzing' | 'complete'>('idle');
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const minBudget = 200;
  const maxBudget = 3000;

  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Force reset animation state
    setIsVisible(false);
    
    // Small delay to ensure the reset is applied
    const resetTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(resetTimeout);
  }, []);

  // Enhanced search handler with progressive stages
  const handleSearch = async () => {
    // Validate location input
    if (!searchQuery.trim()) {
      setError("Please enter a location to search for student housing.");
      return;
    }

    // Validate description input
    if (!description.trim()) {
      setError("Please describe what you're looking for to get personalized suggestions.");
      return;
    }

    setLoading(true);
    setError("");
    setSearchStage('connecting');
    setLoadingProgress(10);
    setLoadingMessage("Connecting to search service...");

    try {
      // Simulate progressive loading stages
      setTimeout(() => {
        setSearchStage('processing');
        setLoadingProgress(30);
        setLoadingMessage("Processing your search criteria...");
      }, 800);

      setTimeout(() => {
        setSearchStage('analyzing');
        setLoadingProgress(60);
        setLoadingMessage("Analyzing housing options in your area...");
      }, 1600);

      // Call the actual API
      const payload = {
        location: searchQuery,
        budget: { min: budgetRange[0], max: budgetRange[1] },
        preferences: description,
      };

      const response = await fetch("https://spurhacks-ashj.vercel.app/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      setSearchStage('complete');
      setLoadingProgress(100);
      setLoadingMessage("Search complete! Redirecting to results...");
      
      // Store the API response in localStorage with a unique key
      const searchKey = `search_${Date.now()}`;
      localStorage.setItem(searchKey, JSON.stringify({
        results: data.text,
        timestamp: Date.now(),
        searchParams: {
          location: searchQuery,
          minBudget: budgetRange[0],
          maxBudget: budgetRange[1],
          preferences: description
        }
      }));
      
      // Create clean search URL using utility function
      const searchUrl = createSearchUrl({
        location: searchQuery,
        minBudget: budgetRange[0],
        maxBudget: budgetRange[1],
        preferences: description,
        searchKey: searchKey
      });

      // Small delay for smooth transition
      setTimeout(() => {
        navigate(searchUrl);
      }, 500);

    } catch (err) {
      console.error("Search error:", err);
      setError("An error occurred while processing your search. Please try again.");
      setLoading(false);
      setSearchStage('idle');
    }
  };

  const getValueFromPosition = useCallback((clientX: number) => {
    if (!sliderRef.current) return minBudget;
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = minBudget + percentage * (maxBudget - minBudget);
    return Math.round(rawValue / 50) * 50; // Round to nearest 50
  }, [minBudget, maxBudget]);

  const updateBudgetRange = useCallback((newRange: number[]) => {
    setBudgetRange(newRange);
    setInputValues({ min: newRange[0].toString(), max: newRange[1].toString() });
  }, []);

  const handleMouseDown = (thumbIndex: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(thumbIndex);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging === null || !sliderRef.current) return;
    const newValue = getValueFromPosition(e.clientX);
    setBudgetRange(prev => {
      const newRange = [...prev];
      if (isDragging === 0) {
        newRange[0] = Math.min(newValue, prev[1]);
      } else {
        newRange[1] = Math.max(newValue, prev[0]);
      }
      setInputValues({ min: newRange[0].toString(), max: newRange[1].toString() });
      return newRange;
    });
  }, [isDragging, getValueFromPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  React.useEffect(() => {
    if (isDragging !== null) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleBudgetChange = (index: number, value: number) => {
    const newRange = [...budgetRange];
    newRange[index] = value;
    if (index === 0 && value > budgetRange[1]) {
      newRange[1] = value;
    } else if (index === 1 && value < budgetRange[0]) {
      newRange[0] = value;
    }
    updateBudgetRange(newRange);
  };

  const handleInputChange = (type: 'min' | 'max', value: string) => {
    if (value === '' || /^\d+$/.test(value)) {
      setInputValues(prev => ({ ...prev, [type]: value }));
    }
  };

  const handleInputBlur = (type: 'min' | 'max') => {
    const value = inputValues[type];
    let numValue = parseInt(value) || (type === 'min' ? minBudget : maxBudget);
    numValue = Math.max(minBudget, Math.min(maxBudget, numValue));
    const newRange = [...budgetRange];
    const index = type === 'min' ? 0 : 1;
    newRange[index] = numValue;
    if (type === 'min' && numValue > budgetRange[1]) {
      newRange[1] = numValue;
    } else if (type === 'max' && numValue < budgetRange[0]) {
      newRange[0] = numValue;
    }
    updateBudgetRange(newRange);
  };

  const minPercent = ((budgetRange[0] - minBudget) / (maxBudget - minBudget)) * 100;
  const maxPercent = ((budgetRange[1] - minBudget) / (maxBudget - minBudget)) * 100;

  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white min-h-screen flex items-center overflow-hidden hero-background">
      {/* Interactive Background Animations */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Floating House Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="house-icon house-1">
          <Home className="text-white/10 animate-float-slow" />
        </div>
        <div className="house-icon house-2">
          <Building className="text-white/10 animate-float-medium" />
        </div>
        <div className="house-icon house-3">
          <Home className="text-white/10 animate-float-fast" />
        </div>
        <div className="house-icon house-4">
          <Building className="text-white/10 animate-float-slow" />
        </div>
        <div className="house-icon house-5">
          <Home className="text-white/10 animate-float-medium" />
        </div>
        <div className="house-icon house-6">
          <Building className="text-white/10 animate-float-fast" />
        </div>
      </div>

      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        <div className="particles-container">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="relative container mx-auto px-4 py-8 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 transform transition-all duration-1000 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
          }`}>
            Find Your Perfect
            <span className={`text-yellow-400 block transform transition-all duration-800 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>Student Home</span>
          </h1>
          <p className={`text-lg md:text-xl mb-8 text-blue-100 transform transition-all duration-700 delay-500 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            Discover affordable, safe, and convenient rentals near your campus
          </p>
          
          <div className={`bg-white rounded-xl p-5 shadow-2xl max-w-3xl mx-auto transform transition-all duration-1000 delay-700 ease-out ${
            isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
          }`}>
            <div className="flex flex-col gap-4">
              <div className={`flex flex-col md:flex-row gap-3 transform transition-all duration-700 delay-1000 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              }`}>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Enter city, university, or neighborhood..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 text-base border-gray-200 focus:border-blue-500 text-gray-900 transition-all duration-300 hover:shadow-md focus:shadow-lg form-input-focus"
                    disabled={loading}
                  />
                </div>
                <Button
                  className={`h-12 px-6 text-base font-semibold transition-all duration-500 transform relative overflow-hidden ${
                    loading 
                      ? 'bg-blue-700 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'
                  }`}
                  onClick={handleSearch}
                  disabled={loading}
                >
                  <div className={`flex items-center transition-all duration-500 ${
                    loading ? 'opacity-0 translate-x-2' : 'opacity-100 translate-x-0'
                  }`}>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </div>
                  
                  {/* Enhanced Loading animation overlay */}
                  <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                    loading ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Finding homes...</span>
                    </div>
                  </div>
                  
                  {/* Enhanced Pulse animation background */}
                  {loading && (
                    <div className="absolute inset-0 bg-blue-500 rounded-md animate-pulse-glow opacity-30"></div>
                  )}
                </Button>
              </div>
              
              {/* Budget Range Slider */}
              <div className={`bg-gray-50 rounded-lg p-3 border border-gray-200 transition-all duration-500 ${
                loading ? 'opacity-50 pointer-events-none' : 'opacity-100'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-gray-600" />
                  <label className="text-gray-700 font-medium text-sm">Monthly Budget Range</label>
                </div>
                <div className="space-y-3">
                  <div className="relative h-2 mx-4" ref={sliderRef}>
                    {/* Background track */}
                    <div className="absolute inset-0 h-2 rounded-full bg-gray-300"></div>
                    {/* Active range bar */}
                    <div
                      className="absolute h-2 bg-blue-600 rounded-full transition-all duration-150"
                      style={{
                        left: `${minPercent}%`,
                        width: `${maxPercent - minPercent}%`
                      }}
                    ></div>
                    {/* Clickable overlay */}
                    <div
                      className="absolute inset-0 h-2 cursor-pointer"
                      onClick={(e) => {
                        if (loading) return;
                        const newValue = getValueFromPosition(e.clientX);
                        const distanceToMin = Math.abs(newValue - budgetRange[0]);
                        const distanceToMax = Math.abs(newValue - budgetRange[1]);
                        if (distanceToMin < distanceToMax) {
                          handleBudgetChange(0, newValue);
                        } else {
                          handleBudgetChange(1, newValue);
                        }
                      }}
                    ></div>
                    {/* Min thumb */}
                    <div
                      className={`absolute w-5 h-5 bg-blue-600 rounded-full shadow-lg border-2 border-white cursor-grab transform -translate-y-1.5 -translate-x-2.5 transition-all duration-150 hover:scale-110 ${
                        isDragging === 0 ? 'cursor-grabbing scale-110 shadow-xl z-30' : budgetRange[0] === budgetRange[1] ? 'z-20' : 'z-10'
                      } ${loading ? 'pointer-events-none' : ''}`}
                      style={{
                        left: `${minPercent}%`,
                        transform: `translateY(-6px) translateX(${budgetRange[0] === budgetRange[1] ? '-15px' : '-10px'})`
                      }}
                      onMouseDown={loading ? undefined : handleMouseDown(0)}
                    ></div>
                    {/* Max thumb */}
                    <div
                      className={`absolute w-5 h-5 bg-blue-600 rounded-full shadow-lg border-2 border-white cursor-grab transform -translate-y-1.5 -translate-x-2.5 transition-all duration-150 hover:scale-110 ${
                        isDragging === 1 ? 'cursor-grabbing scale-110 shadow-xl z-30' : budgetRange[0] === budgetRange[1] ? 'z-20' : 'z-10'
                      } ${loading ? 'pointer-events-none' : ''}`}
                      style={{
                        left: `${maxPercent}%`,
                        transform: `translateY(-6px) translateX(${budgetRange[0] === budgetRange[1] ? '-5px' : '-10px'})`
                      }}
                      onMouseDown={loading ? undefined : handleMouseDown(1)}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">Min:</span>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-800 text-xs font-medium z-10">$</span>
                        <Input
                          type="text"
                          value={inputValues.min}
                          onChange={(e) => handleInputChange('min', e.target.value)}
                          onBlur={() => handleInputBlur('min')}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleInputBlur('min');
                            }
                          }}
                          className="bg-blue-100 text-blue-800 pl-5 pr-2 py-1 rounded-full text-xs font-semibold w-16 h-7 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border-0 transition-all duration-300 hover:shadow-md focus:shadow-lg form-input-focus"
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">Max:</span>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-800 text-xs font-medium z-10">$</span>
                        <Input
                          type="text"
                          value={inputValues.max}
                          onChange={(e) => handleInputChange('max', e.target.value)}
                          onBlur={() => handleInputBlur('max')}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleInputBlur('max');
                            }
                          }}
                          className="bg-blue-100 text-blue-800 pl-5 pr-2 py-1 rounded-full text-xs font-semibold w-16 h-7 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border-0 transition-all duration-300 hover:shadow-md focus:shadow-lg form-input-focus"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`transition-all duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                <Textarea
                  placeholder="Describe what you're looking for... (e.g., quiet study space, close to campus, pet-friendly)"
                  className="text-gray-900 border-gray-200 focus:border-blue-500 resize-none text-sm transition-all duration-300 hover:shadow-md focus:shadow-lg form-input-focus"
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Enhanced Loading indicator */}
          {loading && (
            <div className="mt-6 max-w-3xl mx-auto bg-white/95 rounded-xl p-6 shadow-xl text-gray-800 transform transition-all duration-700 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-4">
                <div className="relative">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 animate-pulse" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-blue-700 mb-2">{loadingMessage}</h3>
                  <p className="text-sm text-gray-600">
                    {searchStage === 'connecting' && "Establishing connection..."}
                    {searchStage === 'processing' && "Processing your preferences..."}
                    {searchStage === 'analyzing' && "Analyzing housing options..."}
                    {searchStage === 'complete' && "Preparing your results..."}
                  </p>
                </div>
              </div>
              
              {/* Enhanced Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-3 rounded-full transition-all duration-500 ease-out progress-bar"
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>{loadingProgress}%</span>
                  <span>100%</span>
                </div>
              </div>
              
              {/* Animated Dots */}
              <div className="mt-4 flex justify-center">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className={`mt-3 max-w-3xl mx-auto bg-red-100 rounded-xl p-3 shadow text-red-700 text-sm transform transition-all duration-500 ${
              error ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              {error}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Hero;