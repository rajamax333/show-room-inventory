import { type FilterState } from '../pages/home/components/filter/filter';

export const initialFilterState: FilterState = {
  priceRange: [0, 100000],
  brands: [],
  vehicleTypes: [],
  minRating: 0,
};

export type FilterAction = 
  | { type: 'SET_PRICE_RANGE'; payload: [number, number] }
  | { type: 'TOGGLE_BRAND'; payload: string }
  | { type: 'TOGGLE_VEHICLE_TYPE'; payload: string }
  | { type: 'SET_RATING'; payload: number }
  | { type: 'CLEAR_FILTERS' };

export const filterReducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case 'SET_PRICE_RANGE':
      return { ...state, priceRange: action.payload };
    case 'TOGGLE_BRAND': {
      const updatedBrands = state.brands.includes(action.payload)
        ? state.brands.filter(b => b !== action.payload)
        : [...state.brands, action.payload];
      return { ...state, brands: updatedBrands };
    }
    case 'TOGGLE_VEHICLE_TYPE': {
      const updatedTypes = state.vehicleTypes.includes(action.payload)
        ? state.vehicleTypes.filter(t => t !== action.payload)
        : [...state.vehicleTypes, action.payload];
      return { ...state, vehicleTypes: updatedTypes };
    }
    case 'SET_RATING':
      return { ...state, minRating: action.payload };
    case 'CLEAR_FILTERS':
      return initialFilterState;
    default:
      return state;
  }
};
