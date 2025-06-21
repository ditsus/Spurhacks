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
  const [inputValues, setInputValues] = useState({ min: '500', max: '1500' });
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
        // Dragging min thumb - ensure it doesn't exceed max
        newRange[0] = Math.min(newValue, prev[1]);
      } else {
        // Dragging max thumb - ensure it doesn't go below min
        newRange[1] = Math.max(newValue, prev[0]);
      }
      
      // Update input values to match slider
      setInputValues({ min: newRange[0].toString(), max: newRange[1].toString() });
      
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
    
    updateBudgetRange(newRange);
  };

  const handleInputChange = (type: 'min' | 'max', value: string) => {
    // Allow empty string and numbers only
    if (value === '' || /^\d+$/.test(value)) {
      setInputValues(prev => ({ ...prev, [type]: value }));
    }
  };

  const handleInputBlur = (type: 'min' | 'max') => {
    const value = inputValues[type];
    let numValue = parseInt(value) || (type === 'min' ? minBudget : maxBudget);
    
    // Clamp to valid range
    numValue = Math.max(minBudget, Math.min(maxBudget, numValue));
    
    const newRange = [...budgetRange];
    const index = type === 'min' ? 0 : 1;
    newRange[index] = numValue;
    
    // Ensure min doesn't exceed max and vice versa
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
                    className="pl-12 h-14 text-lg border-gray-200 focus:border-blue-500 text-gray-900"
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
                  <div className="relative h-2 mx-6" ref={sliderRef}>
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
                        isDragging === 0 ? 'cursor-grabbing scale-110 shadow-xl z-30' : budgetRange[0] === budgetRange[1] ? 'z-20' : 'z-10'
                      }`}
                      style={{ 
                        left: `${minPercent}%`,
                        transform: `translateY(-8px) translateX(${budgetRange[0] === budgetRange[1] ? '-18px' : '-12px'})`
                      }}
                      onMouseDown={handleMouseDown(0)}
                    ></div>
                    
                    {/* Max thumb */}
                    <div 
                      className={`absolute w-6 h-6 bg-blue-600 rounded-full shadow-lg border-2 border-white cursor-grab transform -translate-y-2 -translate-x-3 transition-all duration-75 hover:scale-110 ${
                        isDragging === 1 ? 'cursor-grabbing scale-110 shadow-xl z-30' : budgetRange[0] === budgetRange[1] ? 'z-20' : 'z-10'
                      }`}
                      style={{ 
                        left: `${maxPercent}%`,
                        transform: `translateY(-8px) translateX(${budgetRange[0] === budgetRange[1] ? '-6px' : '-12px'})`
                      }}
                      onMouseDown={handleMouseDown(1)}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Min:</span>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-800 text-sm font-medium z-10">$</span>
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
                          className="bg-blue-100 text-blue-800 pl-6 pr-3 py-1 rounded-full text-sm font-semibold w-20 h-8 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border-0"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Max:</span>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-800 text-sm font-medium z-10">$</span>
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
                          className="bg-blue-100 text-blue-800 pl-6 pr-3 py-1 rounded-full text-sm font-semibold w-20 h-8 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border-0"
                        />
                      </div>
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

          
        </div>
      </div>
    </div>
  );
};

export default Hero;