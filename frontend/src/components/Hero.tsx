import React, { useState, useRef, useCallback } from "react";
import { Search, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Hero = ({ searchQuery, setSearchQuery }: HeroProps) => {
  const [budgetRange, setBudgetRange] = useState([500, 1500]);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const minBudget = 200;
  const maxBudget = 3000;

  const getValueFromPosition = useCallback((clientX: number) => {
    if (!sliderRef.current) return minBudget;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const rawValue = minBudget + percentage * (maxBudget - minBudget);
    return Math.round(rawValue / 50) * 50; // Round to nearest 50
  }, [minBudget, maxBudget]);

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
        // Dragging min thumb - ensure it doesn't exceed max
        newRange[0] = Math.min(newValue, prev[1]);
      } else {
        // Dragging max thumb - ensure it doesn't go below min
        newRange[1] = Math.max(newValue, prev[0]);
      }
      
      return newRange;
    });
  }, [isDragging, getValueFromPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  // Add event listeners when dragging starts
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
    
    // Ensure min doesn't exceed max and vice versa
    if (index === 0 && value > budgetRange[1]) {
      newRange[1] = value;
    } else if (index === 1 && value < budgetRange[0]) {
      newRange[0] = value;
    }
    
    setBudgetRange(newRange);
  };

  const getSliderBackground = () => {
    const minPercent = ((budgetRange[0] - minBudget) / (maxBudget - minBudget)) * 100;
    const maxPercent = ((budgetRange[1] - minBudget) / (maxBudget - minBudget)) * 100;
    return `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${minPercent}%, #3b82f6 ${minPercent}%, #3b82f6 ${maxPercent}%, #e5e7eb ${maxPercent}%, #e5e7eb 100%)`;
  };

  const minPercent = ((budgetRange[0] - minBudget) / (maxBudget - minBudget)) * 100;
  const maxPercent = ((budgetRange[1] - minBudget) / (maxBudget - minBudget)) * 100;

  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Find Your Perfect
            <span className="text-yellow-400 block">Student Home</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-blue-100">
            Discover affordable, safe, and convenient rentals near your campus
          </p>
          
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-3xl mx-auto">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Enter city, university, or neighborhood..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-lg border-gray-200 focus:border-blue-500"
                  />
                </div>
                <Button className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-lg font-semibold">
                  <Search className="mr-2 h-5 w-5" />
                  Search
                </Button>
              </div>
              
              {/* Budget Range Slider */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="h-5 w-5 text-gray-600" />
                  <label className="text-gray-700 font-medium">Monthly Budget Range</label>
                </div>
                
                <div className="space-y-4">
                  <div className="relative h-2" ref={sliderRef}>
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
                      className={`absolute w-6 h-6 bg-blue-600 rounded-full shadow-lg border-2 border-white cursor-grab transform -translate-y-2 -translate-x-3 transition-all duration-75 hover:scale-110 ${
                        isDragging === 0 ? 'cursor-grabbing scale-110 shadow-xl' : ''
                      }`}
                      style={{ left: `${minPercent}%` }}
                      onMouseDown={handleMouseDown(0)}
                    ></div>
                    
                    {/* Max thumb */}
                    <div 
                      className={`absolute w-6 h-6 bg-blue-600 rounded-full shadow-lg border-2 border-white cursor-grab transform -translate-y-2 -translate-x-3 transition-all duration-75 hover:scale-110 ${
                        isDragging === 1 ? 'cursor-grabbing scale-110 shadow-xl' : ''
                      }`}
                      style={{ left: `${maxPercent}%` }}
                      onMouseDown={handleMouseDown(1)}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Min:</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        ${budgetRange[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Max:</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        ${budgetRange[1]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Textarea
                  placeholder="Describe what you're looking for... (e.g., quiet study space, close to campus, pet-friendly, shared kitchen, etc.)"
                  className="text-gray-900 border-gray-200 focus:border-blue-500 resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-yellow-400">10,000+</div>
              <div className="text-blue-100">Verified Properties</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">500+</div>
              <div className="text-blue-100">Partner Universities</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">50,000+</div>
              <div className="text-blue-100">Happy Students</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;