export interface Product {
  id: number;
  code: string;
  name: string;
  category: string;
  quantity: number;
  status: ProductStatus;
}

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export type FilterFormType = 'active' | 'inactive' | 'archived';

export interface FilterForm {
  search: string;
}

export interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UserProfile {
  name: string;
  age: number;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

export interface CounterStats {
  total: number;
  average: number;
  lastUpdated: Date;
}
