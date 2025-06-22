
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { useState } from "react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    priceRange: [0, 2000],
    propertyType: "",
    bedrooms: "",
    amenities: []
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Footer />
    </div>
  );
};

export default Index;
