import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useState, useEffect } from "react";

const Login = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Force reset animation state
    setIsVisible(false);
    
    // Small delay to ensure the reset is applied
    const resetTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(resetTimeout);
  }, []);

  const handleBackToHome = () => {
    // Navigate back to home page
    // In a real app, this would use your router
    // For example with React Router: navigate('/')
    // For now, we'll simulate navigation with window.location
    window.location.href = '/';
  };

  const handleCreateAccount = () => {
    // Navigate to registration page
    // In a real app, this would use your router
    // For example with React Router: navigate('/register')
    window.location.href = '/register';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className={`sm:mx-auto sm:w-full sm:max-w-md transform transition-all duration-700 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'
      }`}>
        <div className="flex justify-center">
          <Home className={`h-12 w-12 text-blue-600 transform transition-all duration-500 delay-200 ${
            isVisible ? 'scale-100 rotate-0' : 'scale-75 -rotate-12'
          }`} />
        </div>
        <h2 className={`mt-6 text-center text-3xl font-extrabold text-gray-900 transform transition-all duration-600 delay-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          Sign in to your account
        </h2>
        <p className={`mt-2 text-center text-sm text-gray-600 transform transition-all duration-500 delay-400 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          Welcome back to Housely
        </p>
      </div>

      <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md transform transition-all duration-700 delay-500 ease-out ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
      }`}>
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </div>
              <div className="mt-1">
                <input
                  type="email"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:shadow-md focus:shadow-lg"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </div>
              <div className="mt-1">
                <input
                  type="password"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 hover:shadow-md focus:shadow-lg"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className={`flex items-center justify-between transform transition-all duration-500 delay-800 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
            }`}>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
                />
                <div className="ml-2 block text-sm text-gray-900">
                  Remember me
                </div>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div className={`transform transition-all duration-500 delay-900 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105 active:scale-95">
                Sign in
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <div className={`relative transform transition-all duration-500 delay-1000 ${
              isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className={`mt-6 transform transition-all duration-500 delay-1100 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <Button 
                variant="outline" 
                onClick={handleCreateAccount} 
                className="w-full transition-all duration-200 hover:scale-105 active:scale-95 hover:bg-gray-50"
              >
                Create new account
              </Button>
            </div>
          </div>

          <div className={`mt-6 transform transition-all duration-500 delay-1200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}>
            <Button 
              variant="ghost" 
              onClick={handleBackToHome} 
              className="w-full transition-all duration-200 hover:scale-105 active:scale-95"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;