import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import type { FuelImporter } from '@/types';

const FUEL_API_BASE = 'https://fuel-prices-backend.onrender.com';
const SUPPORTED_COMPANIES = ['wissol', 'portal', 'connect', 'socar', 'gulf', 'rompetrol'];

interface ApiFuelPrice {
  fuelType: string;
  price: number;
  currency: string;
  selfServicePrice?: number;
}

interface ApiPriceResponse {
  success: boolean;
  timestamp: string;
  data: {
    company: string;
    fuelPrices: ApiFuelPrice[];
    priceRange: { min: number; max: number };
  };
}

// Map fuel type names to categories
function extractPrice(fuelPrices: ApiFuelPrice[], keywords: string[]): number | null {
  for (const keyword of keywords) {
    const found = fuelPrices.find(fp =>
      fp.fuelType.toLowerCase().includes(keyword.toLowerCase())
    );
    if (found) return found.price;
  }
  return null;
}

// Transform API response to FuelImporter format
function transformApiResponse(apiData: ApiPriceResponse[]): FuelImporter[] {
  return apiData
    .filter(item => item.success && item.data)
    .map((item, index) => {
      const { company, fuelPrices } = item.data;

      return {
        id: index + 1,
        name: company,
        logo: null, // API doesn't provide logos
        regular_ron_93_price: extractPrice(fuelPrices, ['რეგულარი', 'regular']),
        premium_ron_96_price: extractPrice(fuelPrices, ['პრემიუმი', 'premium']),
        super_ron_98_price: extractPrice(fuelPrices, ['სუპერი', 'super']),
        diesel_price: extractPrice(fuelPrices, ['დიზელი', 'diesel']),
        created_at: new Date().toISOString(),
        updated_at: item.timestamp,
      };
    });
}

// Fetch from external API
async function fetchFromApi(): Promise<FuelImporter[]> {
  const results: ApiPriceResponse[] = [];

  // Fetch each company individually, don't fail if one fails
  for (const company of SUPPORTED_COMPANIES) {
    try {
      const response = await fetch(`${FUEL_API_BASE}/api/fuel-prices/${company}`);
      if (response.ok) {
        const data = await response.json();
        results.push(data);
      }
    } catch (error) {
      // Silently ignore individual company failures
    }
  }

  if (results.length === 0) {
    throw new Error('No data from API');
  }

  return transformApiResponse(results);
}

// Fallback to Supabase
async function fetchFromSupabase(): Promise<FuelImporter[]> {
  const { data, error } = await supabase
    .from('fuel_importers')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

// Main fetch function with fallback
async function fetchFuelImporters(): Promise<FuelImporter[]> {
  try {
    // Try external API first
    const apiData = await fetchFromApi();
    if (apiData.length > 0) {
      return apiData;
    }
  } catch (error) {
    // API failed, fall back to Supabase
  }

  // Fallback to Supabase
  return fetchFromSupabase();
}

export function useFuelImporters() {
  return useQuery({
    queryKey: ['fuel-importers'],
    queryFn: fetchFuelImporters,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get cheapest prices across all importers
export function useCheapestFuelPrices() {
  return useQuery({
    queryKey: ['fuel-importers', 'cheapest'],
    queryFn: async () => {
      const data = await fetchFuelImporters();

      if (!data || data.length === 0) {
        return null;
      }

      const getPrices = (arr: (number | null)[]) => arr.filter((p): p is number => p !== null && p > 0);

      const regularPrices = getPrices(data.map(d => d.regular_ron_93_price));
      const premiumPrices = getPrices(data.map(d => d.premium_ron_96_price));
      const superPrices = getPrices(data.map(d => d.super_ron_98_price));
      const dieselPrices = getPrices(data.map(d => d.diesel_price));

      return {
        regular: regularPrices.length > 0 ? Math.min(...regularPrices) : 0,
        premium: premiumPrices.length > 0 ? Math.min(...premiumPrices) : 0,
        super: superPrices.length > 0 ? Math.min(...superPrices) : 0,
        diesel: dieselPrices.length > 0 ? Math.min(...dieselPrices) : 0,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
