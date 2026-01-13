// Service Categories
export interface ServiceCategory {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  slug: string;
  created_at: string;
}

// Profile (user data with phone and name)
export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  city: string | null;
  district: string | null;
}

// Mechanic Profile (mechanic-specific data)
export interface MechanicProfile {
  id: string;
  description: string | null;
  specialization: string | null;
  experience_years: number | null;
  hourly_rate: number | null;
  is_mobile: boolean | null;
  rating: number | null;
  review_count: number | null;
  working_hours: string | null;
  accepts_card_payment: boolean | null;
}

// Mechanic Service
export interface MechanicService {
  id: number;
  mechanic_id: string;
  category_id: number;
  name: string;
  description: string | null;
  price_from: number | null;
  price_to: number | null;
  estimated_hours: number | null;
  city: string | null;
  district: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  car_brands: string[] | null;
  on_site_service: boolean | null;
  accepts_card_payment: boolean | null;
  accepts_cash_payment: boolean | null;
  photos: string[] | null;
  videos: string[] | null;
  rating: number | null;
  review_count: number | null;
  is_active: boolean | null;
  created_at: string;
  // Relations
  profiles?: Profile;
  mechanic_profiles?: MechanicProfile;
  service_categories?: ServiceCategory;
}

// Laundry
export interface Laundry {
  id: number;
  name: string;
  description: string | null;
  city: string | null;
  district: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  working_hours: string | null;
  photos: string[] | null;
  rating: number | null;
  review_count: number | null;
  created_at: string;
}

// Drive
export interface Drive {
  id: number;
  name: string;
  description: string | null;
  city: string | null;
  district: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  photos: string[] | null;
  created_at: string;
}

// Fuel Importer
export interface FuelImporter {
  id: number;
  name: string;
  logo: string | null;
  regular_ron_93_price: number | null;
  premium_ron_96_price: number | null;
  super_ron_98_price: number | null;
  diesel_price: number | null;
  created_at: string;
  updated_at: string;
}

// City
export interface City {
  id: number;
  name: string;
  created_at: string;
}

// District
export interface District {
  id: number;
  name: string;
  city_id: number;
  created_at: string;
}

// Filter Types
export interface ServiceFilters {
  categoryId?: number;
  categoryIds?: number[];
  city?: string;
  cities?: string[];
  district?: string;
  search?: string;
}

export interface LaundryFilters {
  cityId?: number;
  districtId?: number;
  city?: string;
  cities?: string[];
  district?: string;
  search?: string;
}

export interface DriveFilters {
  cityId?: number;
  districtId?: number;
  city?: string;
  cities?: string[];
  district?: string;
  search?: string;
}

// Map Types
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface MapRegion extends Coordinates {
  latitudeDelta: number;
  longitudeDelta: number;
}

export type MapItemType = 'service' | 'laundry' | 'drive';

export interface MapItem {
  id: number;
  type: MapItemType;
  name: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  rating?: number | null;
  photo?: string | null;
}
