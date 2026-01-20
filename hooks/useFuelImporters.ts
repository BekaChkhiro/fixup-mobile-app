import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import { DEMO_FUEL_IMPORTERS } from '@/constants/demoData';
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

// Fetch from external API - parallel requests for speed
async function fetchFromApi(): Promise<FuelImporter[]> {
  // Fetch all companies in parallel
  const promises = SUPPORTED_COMPANIES.map(async (company) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout per request

      const response = await fetch(`${FUEL_API_BASE}/api/fuel-prices/${company}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        return await response.json() as ApiPriceResponse;
      }
      return null;
    } catch (error) {
      // Silently ignore individual company failures
      return null;
    }
  });

  const results = await Promise.all(promises);
  const validResults = results.filter((r): r is ApiPriceResponse => r !== null);

  if (validResults.length === 0) {
    throw new Error('No data from API');
  }

  return transformApiResponse(validResults);
}

// Fallback to Supabase
async function fetchFromSupabase(): Promise<FuelImporter[]> {
  try {
    const { data, error } = await supabase
      .from('fuel_importers')
      .select('*')
      .order('name');

    if (error) {
      console.warn('Failed to fetch fuel importers from Supabase, using demo data:', error.message);
      return DEMO_FUEL_IMPORTERS;
    }

    if (!data || data.length === 0) {
      return DEMO_FUEL_IMPORTERS;
    }

    return data;
  } catch (err) {
    console.warn('Network error fetching fuel importers, using demo data:', err);
    return DEMO_FUEL_IMPORTERS;
  }
}

// Race with timeout helper
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms)
    ),
  ]);
}

// Main fetch function with fallback
async function fetchFuelImporters(): Promise<FuelImporter[]> {
  try {
    // Try external API first with 8 second total timeout
    const apiData = await withTimeout(fetchFromApi(), 8000);
    if (apiData.length > 0) {
      return apiData;
    }
  } catch (error) {
    // API failed or timed out, fall back to Supabase
  }

  // Fallback to Supabase (which has its own fallback to demo data)
  return fetchFromSupabase();
}

export function useFuelImporters() {
  return useQuery({
    queryKey: ['fuel-importers'],
    queryFn: fetchFuelImporters,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
    placeholderData: DEMO_FUEL_IMPORTERS, // Show demo data instantly while loading
    refetchOnWindowFocus: false, // Don't refetch when app comes to foreground
  });
}

// Helper to calculate cheapest prices from importers data
function calculateCheapestPrices(data: FuelImporter[] | undefined) {
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
}

// Get cheapest prices - derives from useFuelImporters data (no duplicate fetch)
export function useCheapestFuelPrices() {
  const { data } = useFuelImporters();
  return {
    data: calculateCheapestPrices(data),
  };
}
