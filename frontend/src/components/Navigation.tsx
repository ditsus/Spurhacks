import { Button } from "@/components/ui/button";
import { Home, Heart, User, Menu } from "lucide-react";
import { useState } from "react";

const Navigation = ({ onNavigateToLogin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignInClick = () => {
    // Call the navigation function passed as prop
    if (onNavigateToLogin) {
      onNavigateToLogin();
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Home className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">Housely</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Browse</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">How it Works</a>
            <a href="#" className="text-gray-700 hover:text-blue-600 transition-colors">Help</a>
            <Button variant="ghost" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              Favorites
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignInClick}>
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              List Property
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t">
            <div className="flex flex-col space-y-2 pt-4">
              <a href="#" className="text-gray-700 hover:text-blue-600 py-2">Browse</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 py-2">How it Works</a>
              <a href="#" className="text-gray-700 hover:text-blue-600 py-2">Help</a>
              <Button variant="ghost" size="sm" className="justify-start">
                <Heart className="h-4 w-4 mr-2" />
                Favorites
              </Button>
              <Button variant="outline" size="sm" className="justify-start" onClick={handleSignInClick}>
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                List Property
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Import the Login component
// import Login from './Login';

// Main App component that handles navigation
const App = () => {
  const navigateToLogin = () => {
    // In a real app, this would use your router (React Router, Next.js, etc.)
    // For example with React Router: navigate('/login')
    // For now, we'll simulate navigation with window.location
    window.location.href = '/login';
  };

  return (
    <div>
      <Navigation onNavigateToLogin={navigateToLogin} />
    </div>
  );
};

export default App;