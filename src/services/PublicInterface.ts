export interface ResponseData<T> {
  code: number;
  message: string;
  data?: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  last: boolean;
  number: number;
  size: number;
  numberOfElements: number;
  first: boolean;
}

export interface PageRequest {
  page: number;
  pageSize: number;
}

export interface MapData {
  city?: string;
  country?: string;
  district?: string;
  neighborhood?: string;
  neighborhoodType?: string;
  province?: string;
  street?: string;
  streetNumber?: string;
  township?: string;
  lng: number;
  lat: number;
  formatAddress?: string;
}
