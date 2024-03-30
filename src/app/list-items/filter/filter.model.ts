export interface FilterModel {
  ageGroup?: string,
  priceFrom?: any;
  priceTo?: any;
  sizes?: string[];
  sortBy?: string;
  types?: string[]
  colors?: string[];
  brands?: string[];
  material?: string[];
  rate?: string[];
  subcategory?: string;
  season?: string;
  materials?: string[];
  rating?: string;
}

export interface FilterReady {
  sort?: string;
  priceRange?: string;
  sizes?: string[];
  colors?: string[];
  brands?: string[];
  season?: string;
  materials?: string[];
  rating?: string;
}
