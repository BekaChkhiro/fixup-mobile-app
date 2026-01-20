import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import { DEMO_SERVICES, getDemoServicesForMap } from '@/constants/demoData';
import type { MechanicService, ServiceFilters } from '@/types';

const PAGE_SIZE = 20;

interface FetchServicesParams extends ServiceFilters {
  page?: number;
}

// Filter demo services based on filters
function filterDemoServices(filters: FetchServicesParams): MechanicService[] {
  let filtered = [...DEMO_SERVICES];

  if (filters.categoryId) {
    filtered = filtered.filter(s => s.category_id === filters.categoryId);
  }
  if (filters.city) {
    filtered = filtered.filter(s => s.city === filters.city);
  }
  if (filters.district) {
    filtered = filtered.filter(s => s.district === filters.district);
  }
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(s => s.name.toLowerCase().includes(searchLower));
  }

  return filtered;
}

async function fetchServices({
  categoryId,
  city,
  district,
  search,
  page = 0,
}: FetchServicesParams): Promise<MechanicService[]> {
  try {
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
      console.warn('Failed to fetch services from Supabase, using demo data:', error.message);
      return filterDemoServices({ categoryId, city, district, search, page });
    }

    if (!data || data.length === 0) {
      return filterDemoServices({ categoryId, city, district, search, page });
    }

    return data;
  } catch (err) {
    console.warn('Network error fetching services, using demo data:', err);
    return filterDemoServices({ categoryId, city, district, search, page });
  }
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
      try {
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
          console.warn('Failed to fetch service from Supabase, using demo data:', error.message);
          const demoService = DEMO_SERVICES.find(s => s.id === id);
          if (demoService) return demoService;
          throw new Error(error.message);
        }

        return data as MechanicService;
      } catch (err) {
        console.warn('Network error fetching service, using demo data:', err);
        const demoService = DEMO_SERVICES.find(s => s.id === id);
        if (demoService) return demoService;
        throw err;
      }
    },
    enabled: !!id,
    retry: false,
  });
}

// Get services for map (with coordinates)
export function useServicesForMap(filters: ServiceFilters = {}) {
  return useQuery({
    queryKey: ['services', 'map', filters],
    queryFn: async () => {
      try {
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
          console.warn('Failed to fetch services for map, using demo data:', error.message);
          return getDemoServicesForMap();
        }

        if (!data || data.length === 0) {
          return getDemoServicesForMap();
        }

        return data;
      } catch (err) {
        console.warn('Network error fetching services for map, using demo data:', err);
        return getDemoServicesForMap();
      }
    },
  });
}
