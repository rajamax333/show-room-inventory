import { createContext } from 'react';
import { type FilterState } from '../pages/home/components/filter/filter';
import { type FilterAction } from './filterConstants';

interface FilterContextType {
  filters: FilterState;
  dispatch: React.Dispatch<FilterAction>;
}

export const FilterContext = createContext<FilterContextType | undefined>(undefined);