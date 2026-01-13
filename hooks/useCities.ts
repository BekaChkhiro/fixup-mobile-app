import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import type { City, District } from '@/types';

async function fetchCities(): Promise<City[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

async function fetchDistricts(cityId?: number): Promise<District[]> {
  let query = supabase
    .from('districts')
    .select('*')
    .order('name');

  if (cityId) {
    query = query.eq('city_id', cityId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

// Fetch unique cities from mechanic_services table
async function fetchServiceCities(): Promise<string[]> {
  const { data, error } = await supabase
    .from('mechanic_services')
    .select('city')
    .not('city', 'is', null);

  if (error) {
    throw new Error(error.message);
  }

  // Get unique city names
  const uniqueCities = [...new Set(data?.map((d) => d.city).filter(Boolean))];
  return uniqueCities.sort();
}

// Fetch unique districts from mechanic_services for a specific city
async function fetchServiceDistricts(city?: string): Promise<string[]> {
  let query = supabase
    .from('mechanic_services')
    .select('district')
    .not('district', 'is', null);

  if (city) {
    query = query.eq('city', city);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  // Get unique district names
  const uniqueDistricts = [...new Set(data?.map((d) => d.district).filter(Boolean))];
  return uniqueDistricts.sort();
}

export function useCities() {
  return useQuery({
    queryKey: ['cities'],
    queryFn: fetchCities,
  });
}

export function useDistricts(cityId?: number) {
  return useQuery({
    queryKey: ['districts', cityId],
    queryFn: () => fetchDistricts(cityId),
    enabled: cityId !== undefined,
  });
}

// Hook for unique cities from mechanic_services
export function useServiceCities() {
  return useQuery({
    queryKey: ['service-cities'],
    queryFn: fetchServiceCities,
  });
}

// Hook for unique districts from mechanic_services
export function useServiceDistricts(city?: string) {
  return useQuery({
    queryKey: ['service-districts', city],
    queryFn: () => fetchServiceDistricts(city),
    enabled: !!city,
  });
}

// Fetch unique cities from laundries table
async function fetchLaundryCities(): Promise<string[]> {
  const { data, error } = await supabase
    .from('laundries')
    .select('city')
    .not('city', 'is', null);

  if (error) {
    throw new Error(error.message);
  }

  const uniqueCities = [...new Set(data?.map((d) => d.city).filter(Boolean))];
  return uniqueCities.sort();
}

// Fetch unique districts from laundries for a specific city
async function fetchLaundryDistricts(city?: string): Promise<string[]> {
  let query = supabase
    .from('laundries')
    .select('district')
    .not('district', 'is', null);

  if (city) {
    query = query.eq('city', city);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const uniqueDistricts = [...new Set(data?.map((d) => d.district).filter(Boolean))];
  return uniqueDistricts.sort();
}

// Fetch unique cities from drives table
async function fetchDriveCities(): Promise<string[]> {
  const { data, error } = await supabase
    .from('drives')
    .select('city')
    .not('city', 'is', null);

  if (error) {
    throw new Error(error.message);
  }

  const uniqueCities = [...new Set(data?.map((d) => d.city).filter(Boolean))];
  return uniqueCities.sort();
}

// Fetch unique districts from drives for a specific city
async function fetchDriveDistricts(city?: string): Promise<string[]> {
  let query = supabase
    .from('drives')
    .select('district')
    .not('district', 'is', null);

  if (city) {
    query = query.eq('city', city);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const uniqueDistricts = [...new Set(data?.map((d) => d.district).filter(Boolean))];
  return uniqueDistricts.sort();
}

// Hook for unique cities from laundries
export function useLaundryCities() {
  return useQuery({
    queryKey: ['laundry-cities'],
    queryFn: fetchLaundryCities,
  });
}

// Hook for unique districts from laundries
export function useLaundryDistricts(city?: string) {
  return useQuery({
    queryKey: ['laundry-districts', city],
    queryFn: () => fetchLaundryDistricts(city),
    enabled: !!city,
  });
}

// Hook for unique cities from drives
export function useDriveCities() {
  return useQuery({
    queryKey: ['drive-cities'],
    queryFn: fetchDriveCities,
  });
}

// Hook for unique districts from drives
export function useDriveDistricts(city?: string) {
  return useQuery({
    queryKey: ['drive-districts', city],
    queryFn: () => fetchDriveDistricts(city),
    enabled: !!city,
  });
}
