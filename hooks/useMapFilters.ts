import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import { DEMO_CATEGORIES, DEMO_CITIES, DEMO_DISTRICTS } from '@/constants/demoData';
import type { MapItemType } from '@/types';

// Hook for cities based on active map tab
export function useCitiesForMap(type: MapItemType) {
  return useQuery({
    queryKey: ['map-cities', type],
    queryFn: async () => {
      try {
        const table = type === 'service' ? 'mechanic_services' : type === 'laundry' ? 'laundries' : 'drives';
        const { data, error } = await supabase
          .from(table)
          .select('city')
          .not('city', 'is', null);

        if (error) {
          console.warn('Failed to fetch cities for map, using demo data:', error.message);
          return DEMO_CITIES;
        }

        const uniqueCities = [...new Set(data?.map((d: { city: string }) => d.city).filter(Boolean))] as string[];

        if (uniqueCities.length === 0) {
          return DEMO_CITIES;
        }

        return uniqueCities.sort();
      } catch (err) {
        console.warn('Network error fetching cities for map, using demo data:', err);
        return DEMO_CITIES;
      }
    },
  });
}

// Hook for districts based on active map tab and selected city
export function useDistrictsForMap(type: MapItemType, city?: string) {
  return useQuery({
    queryKey: ['map-districts', type, city],
    queryFn: async () => {
      try {
        const table = type === 'service' ? 'mechanic_services' : type === 'laundry' ? 'laundries' : 'drives';
        let query = supabase
          .from(table)
          .select('district')
          .not('district', 'is', null);

        if (city) {
          query = query.eq('city', city);
        }

        const { data, error } = await query;

        if (error) {
          console.warn('Failed to fetch districts for map, using demo data:', error.message);
          return city && DEMO_DISTRICTS[city] ? DEMO_DISTRICTS[city] : [];
        }

        const uniqueDistricts = [...new Set(data?.map((d: { district: string }) => d.district).filter(Boolean))] as string[];

        if (uniqueDistricts.length === 0 && city && DEMO_DISTRICTS[city]) {
          return DEMO_DISTRICTS[city];
        }

        return uniqueDistricts.sort();
      } catch (err) {
        console.warn('Network error fetching districts for map, using demo data:', err);
        return city && DEMO_DISTRICTS[city] ? DEMO_DISTRICTS[city] : [];
      }
    },
    enabled: !!city,
  });
}

// Hook for service categories (for filter dropdown)
export function useCategoriesForMap() {
  return useQuery({
    queryKey: ['map-categories'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('service_categories')
          .select('id, name')
          .order('name');

        if (error) {
          console.warn('Failed to fetch categories for map, using demo data:', error.message);
          return DEMO_CATEGORIES.map(c => ({ id: c.id, name: c.name }));
        }

        if (!data || data.length === 0) {
          return DEMO_CATEGORIES.map(c => ({ id: c.id, name: c.name }));
        }

        return data;
      } catch (err) {
        console.warn('Network error fetching categories for map, using demo data:', err);
        return DEMO_CATEGORIES.map(c => ({ id: c.id, name: c.name }));
      }
    },
  });
}
