import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import type { MechanicService, ServiceFilters } from '@/types';

const PAGE_SIZE = 20;

interface FetchServicesParams extends ServiceFilters {
  page?: number;
}

async function fetchServices({
  categoryId,
  city,
  district,
  search,
  page = 0,
}: FetchServicesParams): Promise<MechanicService[]> {
  let query = supabase
    .from('mechanic_services')
    .select(`
      *,
      profiles!fk_mechanic_services_profiles (
        id,
        full_name,
        phone,
        avatar_url
      ),
      mechanic_profiles (
        id,
        specialization,
        experience_years,
        rating,
        review_count
      ),
      service_categories (*)
    `)
    .order('created_at', { ascending: false })
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  if (city) {
    query = query.eq('city', city);
  }

  if (district) {
    query = query.eq('district', district);
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

interface UseServicesOptions {
  enabled?: boolean;
}

export function useServices(filters: ServiceFilters = {}, options: UseServicesOptions = {}) {
  return useQuery({
    queryKey: ['services', filters],
    queryFn: () => fetchServices(filters),
    enabled: options.enabled ?? true,
  });
}

export function useInfiniteServices(filters: ServiceFilters = {}) {
  return useInfiniteQuery({
    queryKey: ['services', 'infinite', filters],
    queryFn: ({ pageParam = 0 }) => fetchServices({ ...filters, page: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      return allPages.length;
    },
  });
}

export function useService(id: number) {
  return useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mechanic_services')
        .select(`
          *,
          profiles!fk_mechanic_services_profiles (
            id,
            full_name,
            phone,
            avatar_url
          ),
          mechanic_profiles (
            id,
            specialization,
            experience_years,
            rating,
            review_count
          ),
          service_categories (*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as MechanicService;
    },
    enabled: !!id,
  });
}

// Get services for map (with coordinates)
export function useServicesForMap(filters: ServiceFilters = {}) {
  return useQuery({
    queryKey: ['services', 'map', filters],
    queryFn: async () => {
      let query = supabase
        .from('mechanic_services')
        .select(`
          id,
          name,
          latitude,
          longitude,
          address,
          rating,
          photos,
          category_id
        `);

      // Support single or multiple category IDs
      if (filters.categoryIds && filters.categoryIds.length > 0) {
        query = query.in('category_id', filters.categoryIds);
      } else if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }

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
