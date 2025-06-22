// src/pages/Listings.tsx

import React from "react";
import { useLocation } from "react-router-dom";

const Listings = () => {
  const location = useLocation();
  const { searchQuery, budgetRange, description, geminiResponse } = location.state || {};

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">Listings for: {searchQuery}</h2>
      <p>Budget: ${budgetRange?.[0]}–${budgetRange?.[1]}</p>
      <p>Preferences: {description}</p>
      <hr className="my-4" />
      <div>
        {geminiResponse ? (
          <pre className="whitespace-pre-wrap">{geminiResponse}</pre>
        ) : (
          <p>No results yet. Submit a search from the home page.</p>
        )}
      </div>
    </div>
  );
};

// 👇 This line is the fix!
export default Listings;
