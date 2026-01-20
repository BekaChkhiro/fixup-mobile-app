import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import { DEMO_LAUNDRIES, getDemoLaundriesForMap } from '@/constants/demoData';
import type { Laundry, LaundryFilters } from '@/types';

const PAGE_SIZE = 20;

interface FetchLaundriesParams extends LaundryFilters {
  page?: number;
}

async function fetchLaundries({
  cityId,
  districtId,
  search,
  page = 0,
}: FetchLaundriesParams): Promise<Laundry[]> {
  try {
    let query = supabase
      .from('laundries')
      .select('*')
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (cityId) {
      query = query.eq('city', cityId);
    }

    if (districtId) {
      query = query.eq('district', districtId);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Failed to fetch laundries from Supabase, using demo data:', error.message);
      return DEMO_LAUNDRIES;
    }

    if (!data || data.length === 0) {
      return DEMO_LAUNDRIES;
    }

    return data;
  } catch (err) {
    console.warn('Network error fetching laundries, using demo data:', err);
    return DEMO_LAUNDRIES;
  }
}

export function useLaundries(filters: LaundryFilters = {}) {
  return useQuery({
    queryKey: ['laundries', filters],
    queryFn: () => fetchLaundries(filters),
  });
}

export function useInfiniteLaundries(filters: LaundryFilters = {}) {
  return useInfiniteQuery({
    queryKey: ['laundries', 'infinite', filters],
    queryFn: ({ pageParam = 0 }) => fetchLaundries({ ...filters, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return allPages.length;
    },
  });
}

export function useLaundry(id: number) {
  return useQuery({
    queryKey: ['laundry', id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('laundries')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.warn('Failed to fetch laundry from Supabase, using demo data:', error.message);
          const demoLaundry = DEMO_LAUNDRIES.find(l => l.id === id);
          if (demoLaundry) return demoLaundry;
          throw new Error(error.message);
        }

        return data as Laundry;
      } catch (err) {
        console.warn('Network error fetching laundry, using demo data:', err);
        const demoLaundry = DEMO_LAUNDRIES.find(l => l.id === id);
        if (demoLaundry) return demoLaundry;
        throw err;
      }
    },
    enabled: !!id,
    retry: false,
  });
}

// Get laundries for map (with coordinates)
export function useLaundriesForMap(filters: LaundryFilters = {}) {
  return useQuery({
    queryKey: ['laundries', 'map', filters],
    queryFn: async () => {
      try {
        let query = supabase
          .from('laundries')
          .select('id, name, latitude, longitude, address, rating, photos');

        // Support single or multiple cities
        if (filters.cities && filters.cities.length > 0) {
          query = query.in('city', filters.cities);
        } else if (filters.city) {
          query = query.eq('city', filters.city);
        }

        if (filters.district) {
          query = query.eq('district', filters.district);
        }

        const { data, error } = await query;

        if (error) {
          console.warn('Failed to fetch laundries for map, using demo data:', error.message);
          return getDemoLaundriesForMap();
        }

        if (!data || data.length === 0) {
          return getDemoLaundriesForMap();
        }

        return data;
      } catch (err) {
        console.warn('Network error fetching laundries for map, using demo data:', err);
        return getDemoLaundriesForMap();
      }
    },
  });
}
