import { type User } from "firebase/auth";
import styles from "./home.module.scss";
import type React from "react";
import Header from "./components/header/header";
import { type FilterState } from "./components/filter/filter";
import { FilterProvider } from "../../store/filterStore";
import { CarListingPage } from "../carListingPage/carLP";
import { useAppDispatch } from "../../store/hooks";
import { fetchCars } from "../../store/carSlice";
import { ErrorBoundary } from "react-error-boundary";
import Filter from './components/filter/filter';
import { useState } from 'react';
import { Drawer } from '@mui/material';

interface HomePageProps {
  user: User | null;
}

function ErrorFallback({error}: {error: Error}) {
  return (
    <div role="alert">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
      <pre>{error.stack}</pre>
    </div>
  )
}

export const HomePage: React.FC<HomePageProps> = () => {
  const dispatch = useAppDispatch();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const handleFilterChange = (filters: FilterState) => {
    dispatch(fetchCars({
      pagination: { page: 1, limit: 10 },
      filters: {
        brand: filters.brands.join(','),
        vehicleType: filters.vehicleTypes.join(','),
        minPrice: filters.priceRange[0].toString(),
        maxPrice: filters.priceRange[1].toString(),
        minRating: filters.minRating.toString()
      }
    }));
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className={styles.homeContainer}>
        <Header 
          onFilterClick={() => setMobileFilterOpen(true)}
          showFilterIcon={true}
        />
        <FilterProvider>
          <aside className={styles.filterSection}>
            <Filter onFilterChange={handleFilterChange} />
          </aside>
          <main className={styles.mainContent}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <CarListingPage />
            </ErrorBoundary>
          </main>
          
          <Drawer
            anchor="left"
            open={mobileFilterOpen}
            onClose={() => setMobileFilterOpen(false)}
            className={styles.mobileFilterDrawer}
          >
            <Filter onFilterChange={handleFilterChange} />
          </Drawer>
        </FilterProvider>
      </div>
    </ErrorBoundary>
  );
};
