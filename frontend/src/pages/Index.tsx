
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeaturedProperties from "@/components/FeaturedProperties";
import SearchFilters from "@/components/SearchFilters";
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
      <SearchFilters filters={filters} setFilters={setFilters} />
      <FeaturedProperties searchQuery={searchQuery} filters={filters} />
    </div>
  );
};

export default Index;
