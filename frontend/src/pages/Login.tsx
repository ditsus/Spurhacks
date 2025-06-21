import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const Login = () => {
  const handleBackToHome = () => {
    // Navigate back to home page
    // In a real app, this would use your router
    // For example with React Router: navigate('/')
    // For now, we'll simulate navigation with window.location
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Home className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Welcome back to Housely
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </div>
              <div className="mt-1">
                <input
                  type="email"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="ml-2 block text-sm text-gray-900">
                  Remember me
                </div>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Sign in
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="outline" className="w-full">
                Create new account
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <Button variant="ghost" onClick={handleBackToHome} className="w-full">
              ← Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;