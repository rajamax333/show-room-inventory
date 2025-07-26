export interface CarFilters {
  brand?: string[];
  vehicleType?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface Car {
  id?: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  vehicleType: string;
  rating: number;
  stock: number;
  color: string;
  imageUrl: string;
  description: string;
  features: string[];
  mileage: string;
  transmission: string;
  fuelCapacity?: string;
  batteryCapacity?: string;
  seatingCapacity: number;
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const carApi = {
  // Get cars with filters and pagination
  getCars: async (filters?: CarFilters, pagination?: PaginationParams) => {
    const params = new URLSearchParams();
    
    if (pagination?.page) params.append('page', pagination.page.toString());
    if (pagination?.limit) params.append('limit', pagination.limit.toString());
    
    if (filters?.brand?.length) params.append('brand', filters.brand.join(','));
    if (filters?.vehicleType?.length) params.append('vehicleType', filters.vehicleType.join(','));
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.minRating) params.append('minRating', filters.minRating.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await fetch(`/api/cars?${params}`);
    return response.json();
  },

  // Get single car
  getCar: async (id: string) => {
    const response = await fetch(`/api/cars/${id}`);
    if (!response.ok) throw new Error('Car not found');
    return response.json();
  },

  // Create car
  createCar: async (car: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch('/api/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(car)
    });
    if (!response.ok) throw new Error('Failed to create car');
    return response.json();
  },

  // Update car
  updateCar: async (id: string, updates: Partial<Car>) => {
    const response = await fetch(`/api/cars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update car');
    return response.json();
  },

  // Delete car
  deleteCar: async (id: string) => {
    const response = await fetch(`/api/cars/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete car');
    return response.json();
  },

  // Bulk delete
  bulkDeleteCars: async (ids: string[]) => {
    const response = await fetch('/api/cars/bulk-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    });
    if (!response.ok) throw new Error('Failed to delete cars');
    return response.json();
  }
};