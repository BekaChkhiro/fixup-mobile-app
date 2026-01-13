import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
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
    throw new Error(error.message);
  }

  return data || [];
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
      const { data, error } = await supabase
        .from('laundries')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as Laundry;
    },
    enabled: !!id,
  });
}

// Get laundries for map (with coordinates)
export function useLaundriesForMap(filters: LaundryFilters = {}) {
  return useQuery({
    queryKey: ['laundries', 'map', filters],
    queryFn: async () => {
      let query = supabase
        .from('laundries')
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
