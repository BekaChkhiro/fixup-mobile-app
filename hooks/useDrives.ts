import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import { DEMO_DRIVES } from '@/constants/demoData';
import type { Drive, DriveFilters } from '@/types';

const PAGE_SIZE = 20;

interface FetchDrivesParams extends DriveFilters {
  page?: number;
}

async function fetchDrives({
  cityId,
  districtId,
  search,
  page = 0,
}: FetchDrivesParams): Promise<Drive[]> {
  try {
    let query = supabase
      .from('drives')
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
      console.warn('Failed to fetch drives from Supabase, using demo data:', error.message);
      return DEMO_DRIVES;
    }

    if (!data || data.length === 0) {
      return DEMO_DRIVES;
    }

    return data;
  } catch (err) {
    console.warn('Network error fetching drives, using demo data:', err);
    return DEMO_DRIVES;
  }
}

export function useDrives(filters: DriveFilters = {}) {
  return useQuery({
    queryKey: ['drives', filters],
    queryFn: () => fetchDrives(filters),
  });
}

export function useInfiniteDrives(filters: DriveFilters = {}) {
  return useInfiniteQuery({
    queryKey: ['drives', 'infinite', filters],
    queryFn: ({ pageParam = 0 }) => fetchDrives({ ...filters, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return allPages.length;
    },
  });
}

export function useDrive(id: number) {
  return useQuery({
    queryKey: ['drive', id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('drives')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.warn('Failed to fetch drive from Supabase, using demo data:', error.message);
          const demoDrive = DEMO_DRIVES.find(d => d.id === id);
          if (demoDrive) return demoDrive;
          throw new Error(error.message);
        }

        return data as Drive;
      } catch (err) {
        console.warn('Network error fetching drive, using demo data:', err);
        const demoDrive = DEMO_DRIVES.find(d => d.id === id);
        if (demoDrive) return demoDrive;
        throw err;
      }
    },
    enabled: !!id,
    retry: false,
  });
}

// Get drives for map (with coordinates)
export function useDrivesForMap(filters: DriveFilters = {}) {
  return useQuery({
    queryKey: ['drives', 'map', filters],
    queryFn: async () => {
      let query = supabase
        .from('drives')
        .select('id, name, latitude, longitude, address, photos');

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
        throw new Error(error.message);
      }

      return data || [];
    },
  });
}
