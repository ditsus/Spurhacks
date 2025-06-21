import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Hero = ({ searchQuery, setSearchQuery }: HeroProps) => {
  const [description, setDescription] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: description }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setResult(data.text);
    } catch (err) {
      console.error("Generation error:", err);
      setResult("Sorry, something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Find Your Perfect
            <span className="text-yellow-400 block">Student Home</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-blue-100 animate-fade-in">
            Discover affordable, safe, and convenient rentals near your campus
          </p>

          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-3xl mx-auto animate-scale-in">
            <div className="flex flex-col gap-4">
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
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-lg font-semibold"
                >
                  <Search className="mr-2 h-5 w-5" />
                  {loading ? "Searching…" : "Search"}
                </Button>
              </div>

              <div>
                <Textarea
                  placeholder="Describe what you're looking for… (e.g., quiet study space, close to campus, pet-friendly, shared kitchen, etc.)"
                  className="text-gray-900 border-gray-200 focus:border-blue-500 resize-none"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          {result && (
            <div className="mt-6 max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow text-black">
              <h3 className="font-semibold mb-2">Gemini says:</h3>
              <p className="whitespace-pre-wrap">{result}</p>
            </div>
          )}

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-yellow-400">10,000+</div>
              <div className="text-blue-100">Verified Properties</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-yellow-400">500+</div>
              <div className="text-blue-100">Partner Universities</div>
            </div>
            <div className="animate-fade-in">
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
