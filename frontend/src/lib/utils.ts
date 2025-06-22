import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for URL parameter handling
export function encodeSearchParams(params: Record<string, string | number>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  
  return searchParams.toString();
}

export function decodeSearchParams(searchString: string): Record<string, string> {
  const searchParams = new URLSearchParams(searchString);
  const params: Record<string, string> = {};
  
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}

// Function to create a clean search URL
export function createSearchUrl(params: {
  location: string;
  minBudget: number;
  maxBudget: number;
  preferences: string;
  searchKey: string;
}): string {
  return `/search-results?${encodeSearchParams(params)}`;
}

// Function to clean up old search data from localStorage
export function cleanupOldSearches(): void {
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('search_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        if (data.timestamp && data.timestamp < oneHourAgo) {
          localStorage.removeItem(key);
        }
      } catch (err) {
        // Remove invalid entries
        localStorage.removeItem(key);
      }
    }
  });
}
