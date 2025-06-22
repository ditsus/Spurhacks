import React, { useState, useRef, useCallback, useEffect } from "react";
import { Search, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Hero = ({ searchQuery, setSearchQuery }: HeroProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [budgetRange, setBudgetRange] = useState([500, 1500]);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const [inputValues, setInputValues] = useState({ min: '500', max: '1500' });
  const sliderRef = useRef<HTMLDivElement>(null);
  const minBudget = 200;
  const maxBudget = 3000;

  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Force reset animation state
    setIsVisible(false);
    
    // Small delay to ensure the reset is applied
    const resetTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(resetTimeout);
  }, []);

  // Gemini call
  const handleSearch = async () => {
    // Validate location input
    if (!searchQuery.trim()) {
      setError("Please enter a location to search for student housing.");
      setGeminiResponse("");
      return;
    }

    // Validate description input
    if (!description.trim()) {
      setError("Please describe what you're looking for to get personalized suggestions.");
      setGeminiResponse("");
      return;
    }

    setLoading(true);
    setError("");
    setGeminiResponse("");

    // Send the raw values, not a prompt
    const payload = {
      location: searchQuery,
      budget: { min: budgetRange[0], max: budgetRange[1] },
      preferences: description,
    };
//
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Backend error");
      const data = await res.json();
      setGeminiResponse(data.text || JSON.stringify(data));
    } catch (err) {
      setError("Could not connect to backend or Gemini.");
    } finally {
      setLoading(false);
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
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white min-h-screen flex items-center">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 transform transition-all duration-700 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
          }`}>
            Find Your Perfect
            <span className={`text-yellow-400 block transform transition-all duration-600 delay-300 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>Student Home</span>
          </h1>
          <p className={`text-lg md:text-xl mb-8 text-blue-100 transform transition-all duration-500 delay-400 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            Discover affordable, safe, and convenient rentals near your campus
          </p>
          
          <div className={`bg-white rounded-xl p-5 shadow-2xl max-w-3xl mx-auto transform transition-all duration-700 delay-500 ease-out ${
            isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
          }`}>
            <div className="flex flex-col gap-4">
              <div className={`flex flex-col md:flex-row gap-3 transform transition-all duration-500 delay-800 ${
                isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
              }`}>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Enter city, university, or neighborhood..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 text-base border-gray-200 focus:border-blue-500 text-gray-900 transition-all duration-200 hover:shadow-md focus:shadow-lg"
                  />
                </div>
                <Button
                  className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-base font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  <Search className="mr-2 h-4 w-4" />
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
              
              {/* Budget Range Slider */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
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
                      className="absolute h-2 bg-blue-600 rounded-full transition-all duration-75"
                      style={{
                        left: `${minPercent}%`,
                        width: `${maxPercent - minPercent}%`
                      }}
                    ></div>
                    {/* Clickable overlay */}
                    <div
                      className="absolute inset-0 h-2 cursor-pointer"
                      onClick={(e) => {
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
                      className={`absolute w-5 h-5 bg-blue-600 rounded-full shadow-lg border-2 border-white cursor-grab transform -translate-y-1.5 -translate-x-2.5 transition-all duration-75 hover:scale-110 ${
                        isDragging === 0 ? 'cursor-grabbing scale-110 shadow-xl z-30' : budgetRange[0] === budgetRange[1] ? 'z-20' : 'z-10'
                      }`}
                      style={{
                        left: `${minPercent}%`,
                        transform: `translateY(-6px) translateX(${budgetRange[0] === budgetRange[1] ? '-15px' : '-10px'})`
                      }}
                      onMouseDown={handleMouseDown(0)}
                    ></div>
                    {/* Max thumb */}
                    <div
                      className={`absolute w-5 h-5 bg-blue-600 rounded-full shadow-lg border-2 border-white cursor-grab transform -translate-y-1.5 -translate-x-2.5 transition-all duration-75 hover:scale-110 ${
                        isDragging === 1 ? 'cursor-grabbing scale-110 shadow-xl z-30' : budgetRange[0] === budgetRange[1] ? 'z-20' : 'z-10'
                      }`}
                      style={{
                        left: `${maxPercent}%`,
                        transform: `translateY(-6px) translateX(${budgetRange[0] === budgetRange[1] ? '-5px' : '-10px'})`
                      }}
                      onMouseDown={handleMouseDown(1)}
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
                          className="bg-blue-100 text-blue-800 pl-5 pr-2 py-1 rounded-full text-xs font-semibold w-16 h-7 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border-0 transition-all duration-200 hover:shadow-md focus:shadow-lg"
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
                          className="bg-blue-100 text-blue-800 pl-5 pr-2 py-1 rounded-full text-xs font-semibold w-16 h-7 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border-0 transition-all duration-200 hover:shadow-md focus:shadow-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Textarea
                  placeholder="Describe what you're looking for... (e.g., quiet study space, close to campus, pet-friendly)"
                  className="text-gray-900 border-gray-200 focus:border-blue-500 resize-none text-sm transition-all duration-200 hover:shadow-md focus:shadow-lg"
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Gemini Response */}
          {geminiResponse && (
            <div className={`mt-6 max-w-3xl mx-auto bg-white/90 rounded-xl p-4 shadow-xl text-gray-800 transform transition-all duration-500 ${
              geminiResponse ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
            }`}>
              <h2 className="font-bold text-base mb-2 text-blue-700">Gemini Suggestions</h2>
              <pre className="whitespace-pre-wrap text-sm">{geminiResponse}</pre>
            </div>
          )}
          {error && (
            <div className={`mt-3 max-w-3xl mx-auto bg-red-100 rounded-xl p-3 shadow text-red-700 text-sm transform transition-all duration-300 ${
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