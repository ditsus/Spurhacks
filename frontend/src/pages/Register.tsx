import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useState, useEffect } from "react";

const Registration = () => {
  /* ─────────  UI state  ───────── */
  const [isVisible,       setIsVisible]     = useState(false);
  const [name,            setName]          = useState("");
  const [email,           setEmail]         = useState("");
  const [password,        setPassword]      = useState("");
  const [confirmPassword, setConfirmPassword]=useState("");
  const [error,           setError]         = useState<string | null>(null);
  const [loading,         setLoading]       = useState(false);

  /* fade-in animation on mount */
  useEffect(() => {
    setIsVisible(false);
    const t = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  /* ─────────  navigation helpers  ───────── */
  const goHome  = () => (window.location.href = "/");
  const goLogin = () => (window.location.href = "/login");

  /* ─────────  submit handler  ───────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    /* client-side checks */
    if (!name || !email || !password)
      return setError("All fields are required");

    if (password !== confirmPassword)
      return setError("Passwords do not match");

    setLoading(true);
    try {
      const res  = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (res.status === 201) {
        // registration succeeded (would only ever happen if you
        // re-enable it on the backend)
        alert("Registration successful! You can now log in.");
        goLogin();
      } else {
        // 403 or any other error → show message
        setError(data.message || "Registration failed");
      }
    } catch {
      setError("Network error – please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleSurvey = () => {
    // Navigate to login page
    // In a real app, this would use your router
    // For example with React Router: navigate('/login')
    window.location.href = '/housingsurvey';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* ─────────  header  ───────── */}
      <div className={`sm:mx-auto sm:w-full sm:max-w-md transform transition-all duration-700 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
      }`}>
        <div className="flex justify-center">
          <Home className={`h-12 w-12 text-blue-600 transform transition-all duration-500 delay-200 ${
            isVisible ? "scale-100 rotate-0" : "scale-75 rotate-12"
          }`} />
        </div>
        <h2 className={`mt-6 text-center text-3xl font-extrabold text-gray-900 transform transition-all duration-600 delay-300 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}>
          Create your account
        </h2>
        <p className={`mt-2 text-center text-sm text-gray-600 transform transition-all duration-500 delay-400 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}>
          Join Housely today
        </p>
      </div>

      {/* ─────────  form  ───────── */}
      <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md transform transition-all duration-700 delay-500 ease-out ${
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95"
      }`}>
        <form onSubmit={handleSubmit} className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-6">

          {/* Full name */}
          <div className={`transform transition-all duration-500 delay-600 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
          }`}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className={`transform transition-all duration-500 delay-800 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
          }`}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300"
              placeholder="Create a password"
            />
          </div>

          {/* Confirm password */}
          <div className={`transform transition-all duration-500 delay-900 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
          }`}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300"
              placeholder="Confirm your password"
            />
          </div>

            <div className={`flex items-center transform transition-all duration-500 delay-1000 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'
            }`}>
              <input
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
              />
              <div className="ml-2 block text-sm text-gray-900">
                I agree to the{" "}
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Privacy Policy
                </a>
              </div>
            </div>

            <div className={`transform transition-all duration-500 delay-1100 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105 active:scale-95">
                Create account
              </Button>
            </div>
          </div>

          {/* Divider + links */}
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
              <Button variant="outline" onClick={goLogin} className="w-full">
                Sign in to existing account
              </Button>
            </div>
          </div>

          {/* Back home */}
          <div className="mt-6">
            <Button variant="ghost" onClick={goHome} className="w-full">
              ← Back to Home
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
