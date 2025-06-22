import { Button } from "@/components/ui/button";
import { Home, ArrowRight, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

const HousingSurvey = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({
    // Section 1 - Personal Info
    name: '',
    age: '',
    location: '',
    gender: '',
    major: '',
    school: '',
    // Section 2 - Preferences
    roommates: '',
    noiseLevel: '',
    guests: '',
    cleanliness: ''
  });

  useEffect(() => {
    setIsVisible(false);
    const resetTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(resetTimeout);
  }, [currentSection]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextSection = () => {
    setCurrentSection(2);
  };

  const handlePreviousSection = () => {
    setCurrentSection(1);
  };

  const handleSubmit = () => {
    console.log('Survey submitted:', formData);
    // In a real app, this would submit to your backend
    handleBackToHome();
  };

  const handleBackToHome = () => {
    window.location.href = '/dashboard';
  };

  const renderSection1 = () => (
    <div className="space-y-6">
      <div className={`transform transition-all duration-500 delay-600 ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
      }`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md focus:shadow-lg transform hover:scale-105 focus:scale-105"
          placeholder="Enter your full name"
        />
      </div>

      <div className={`transform transition-all duration-500 delay-700 ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
      }`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Age
        </label>
        <input
          type="number"
          value={formData.age}
          onChange={(e) => handleInputChange('age', e.target.value)}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md focus:shadow-lg transform hover:scale-105 focus:scale-105"
          placeholder="Enter your age"
          min="18"
          max="100"
        />
      </div>

      <div className={`transform transition-all duration-500 delay-800 ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
      }`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md focus:shadow-lg transform hover:scale-105 focus:scale-105"
          placeholder="City, State"
        />
      </div>

      <div className={`transform transition-all duration-500 delay-900 ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
      }`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gender
        </label>
        <select
          value={formData.gender}
          onChange={(e) => handleInputChange('gender', e.target.value)}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md focus:shadow-lg transform hover:scale-105 focus:scale-105"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="non-binary">Non-binary</option>
          <option value="prefer-not-to-say">Prefer not to say</option>
        </select>
      </div>

      <div className={`transform transition-all duration-500 delay-1000 ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
      }`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Major
        </label>
        <input
          type="text"
          value={formData.major}
          onChange={(e) => handleInputChange('major', e.target.value)}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md focus:shadow-lg transform hover:scale-105 focus:scale-105"
          placeholder="Your field of study"
        />
      </div>

      <div className={`transform transition-all duration-500 delay-1100 ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
      }`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          School
        </label>
        <input
          type="text"
          value={formData.school}
          onChange={(e) => handleInputChange('school', e.target.value)}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md focus:shadow-lg transform hover:scale-105 focus:scale-105"
          placeholder="University or college name"
        />
      </div>

      <div className={`transform transition-all duration-500 delay-1200 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <Button 
          onClick={handleNextSection}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          Next: Housing Preferences
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderSection2 = () => (
    <div className="space-y-6">
      <div className={`transform transition-all duration-500 delay-600 ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
      }`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number of Roommates
        </label>
        <select
          value={formData.roommates}
          onChange={(e) => handleInputChange('roommates', e.target.value)}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md focus:shadow-lg transform hover:scale-105 focus:scale-105"
        >
          <option value="">Select preference</option>
          <option value="0">Live alone</option>
          <option value="1">1 roommate</option>
          <option value="2">2 roommates</option>
          <option value="3">3 roommates</option>
          <option value="4+">4+ roommates</option>
        </select>
      </div>

      <div className={`transform transition-all duration-500 delay-700 ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
      }`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Noise Level Preference
        </label>
        <select
          value={formData.noiseLevel}
          onChange={(e) => handleInputChange('noiseLevel', e.target.value)}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md focus:shadow-lg transform hover:scale-105 focus:scale-105"
        >
          <option value="">Select noise level</option>
          <option value="very-quiet">Very quiet (library-like)</option>
          <option value="quiet">Quiet (minimal noise)</option>
          <option value="moderate">Moderate (some conversation/music)</option>
          <option value="lively">Lively (social environment)</option>
          <option value="no-preference">No preference</option>
        </select>
      </div>

      <div className={`transform transition-all duration-500 delay-800 ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
      }`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Guest Policy
        </label>
        <select
          value={formData.guests}
          onChange={(e) => handleInputChange('guests', e.target.value)}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md focus:shadow-lg transform hover:scale-105 focus:scale-105"
        >
          <option value="">Select guest preference</option>
          <option value="no-guests">No guests allowed</option>
          <option value="occasional">Occasional guests (with notice)</option>
          <option value="frequent">Frequent guests welcome</option>
          <option value="overnight-ok">Overnight guests OK</option>
          <option value="no-preference">No preference</option>
        </select>
      </div>

      <div className={`transform transition-all duration-500 delay-900 ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
      }`}>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cleanliness Level
        </label>
        <select
          value={formData.cleanliness}
          onChange={(e) => handleInputChange('cleanliness', e.target.value)}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 hover:shadow-md focus:shadow-lg transform hover:scale-105 focus:scale-105"
        >
          <option value="">Select cleanliness standard</option>
          <option value="very-clean">Very clean (spotless at all times)</option>
          <option value="clean">Clean (tidy and organized)</option>
          <option value="moderate">Moderate (lived-in but clean)</option>
          <option value="relaxed">Relaxed (some mess is OK)</option>
          <option value="no-preference">No preference</option>
        </select>
      </div>

      <div className={`space-y-3 transform transition-all duration-500 delay-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <Button 
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Complete Survey
        </Button>
        
        <Button 
          onClick={handlePreviousSection}
          variant="outline"
          className="w-full transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Personal Info
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className={`sm:mx-auto sm:w-full sm:max-w-md transform transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
      }`}>
        <div className="flex justify-center">
          <Home className={`h-12 w-12 text-blue-600 transform transition-all duration-500 delay-200 ${
            isVisible ? 'scale-100 rotate-0' : 'scale-75 rotate-12'
          }`} />
        </div>
        <h2 className={`mt-6 text-center text-3xl font-extrabold text-gray-900 transform transition-all duration-600 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          Housing Preferences Survey
        </h2>
        <p className={`mt-2 text-center text-sm text-gray-600 transform transition-all duration-500 delay-400 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          {currentSection === 1 
            ? "Tell us about yourself - Step 1 of 2" 
            : "Your housing preferences - Step 2 of 2"
          }
        </p>
        
        {/* Progress Indicator */}
        <div className={`mt-4 flex justify-center transform transition-all duration-500 delay-500 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}>
          <div className="flex space-x-2">
            <div className={`h-2 w-8 rounded-full transition-all duration-300 ${
              currentSection === 1 ? 'bg-blue-600' : 'bg-blue-600'
            }`} />
            <div className={`h-2 w-8 rounded-full transition-all duration-300 ${
              currentSection === 2 ? 'bg-blue-600' : 'bg-gray-300'
            }`} />
          </div>
        </div>
      </div>

      <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md transform transition-all duration-700 delay-500 ease-out ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
      }`}>
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {currentSection === 1 ? renderSection1() : renderSection2()}

          <div className={`mt-6 transform transition-all duration-500 delay-1300 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HousingSurvey;