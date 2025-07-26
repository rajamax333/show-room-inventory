import React, { useReducer, type ReactNode } from 'react';
import { initialFilterState, filterReducer } from './filterConstants';
import { FilterContext } from './filterContext';

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filters, dispatch] = useReducer(filterReducer, initialFilterState);

  return (
    <FilterContext.Provider value={{ filters, dispatch }}>
      {children}
    </FilterContext.Provider>
  );
};


