import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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
  createdAt: string;
  updatedAt: string;
}

interface CarState {
  cars: Car[];
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

const initialState: CarState = {
  cars: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
};

// Async thunks for CRUD operations using MSW API
export const fetchCars = createAsyncThunk(
  'cars/fetchCars',
  async (params?: {
    pagination?: { page: number; limit: number };
    filters?: {
      brand?: string;
      vehicleType?: string;
      minPrice?: string;
      maxPrice?: string;
      minRating?: string;
      search?: string;
      sortBy?: string;
      sortOrder?: string;
    };
    append?: boolean;
  }) => {
    const searchParams = new URLSearchParams();
    
    if (params?.pagination) {
      searchParams.append('page', params.pagination.page.toString());
      searchParams.append('limit', params.pagination.limit.toString());
    }
    
    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
    }
    
    const response = await fetch(`/api/cars?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch cars');
    const data = await response.json();
    return { ...data, append: params?.append || false };
  }
);

export const addCar = createAsyncThunk(
  'cars/addCar', 
  async (carData: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch('/api/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carData)
    });
    if (!response.ok) throw new Error('Failed to create car');
    return response.json();
  }
);

export const updateCar = createAsyncThunk(
  'cars/updateCar', 
  async ({ id, updates }: { id: string; updates: Partial<Car> }) => {
    const response = await fetch(`/api/cars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update car');
    return response.json();
  }
);

export const deleteCar = createAsyncThunk(
  'cars/deleteCar', 
  async (id: string) => {
    const response = await fetch(`/api/cars/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete car');
    const result = await response.json();
    return { id, ...result };
  }
);

export const bulkDeleteCars = createAsyncThunk(
  'cars/bulkDeleteCars',
  async (ids: string[]) => {
    const response = await fetch('/api/cars/bulk-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    });
    if (!response.ok) throw new Error('Failed to bulk delete cars');
    const result = await response.json();
    return { ids, ...result };
  }
);

const carSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch cars
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = action.payload.cars;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cars';
      })
      // Add car
      .addCase(addCar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCar.fulfilled, (state, action) => {
        state.loading = false;
        state.cars.push(action.payload);
        state.pagination.total += 1;
      })
      .addCase(addCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add car';
      })
      // Update car
      .addCase(updateCar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCar.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.cars.findIndex(car => car.id === action.payload.id);
        if (index !== -1) {
          state.cars[index] = action.payload;
        }
      })
      .addCase(updateCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update car';
      })
      // Delete car
      .addCase(deleteCar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = state.cars.filter(car => car.id !== action.payload.id);
        state.pagination.total -= 1;
      })
      .addCase(deleteCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete car';
      })
      // Bulk delete cars
      .addCase(bulkDeleteCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkDeleteCars.fulfilled, (state, action) => {
        state.loading = false;
        state.cars = state.cars.filter(car => !action.payload.ids.includes(car.id!));
        state.pagination.total -= action.payload.ids.length;
      })
      .addCase(bulkDeleteCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to bulk delete cars';
      });
  },
});

export default carSlice.reducer;
