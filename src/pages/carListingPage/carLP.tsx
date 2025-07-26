import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Pagination } from '@mui/material';
import { Add } from '@mui/icons-material';
import styles from './carLp.module.scss';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';
import { fetchCars, type Car } from '../../store/carSlice.ts';
import { LazyLoadCard } from './LaxyLoadCard/lazyloadcard.tsx';
import { useAuth } from '../../hooks/useAuth';
import CarForm from '../../components/CarForm/CarForm';
import { useFilter } from '../../hooks/useFilter';
import { CardShimmer } from '../../components/Shimmer/CardShimmer';

export const CarListingPage = () => {
  const dispatch = useAppDispatch();
  const { cars, loading, pagination } = useAppSelector(state => state.cars);
  
  // Debug log to see what data we're getting
  console.log('CarListingPage data:', { cars, loading, pagination });
  
  // Check if cars data is valid
  const safeCars = Array.isArray(cars) ? cars.filter(car => car && typeof car === 'object') : [];
  
  console.log('Safe cars:', safeCars);
  const [showCarForm, setShowCarForm] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const { userRole } = useAuth();
  const { filters } = useFilter();
  
  const isAdmin = userRole === 'admin';

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch(fetchCars({ 
      pagination: { page: value, limit: 10 },
      filters: {
        brand: filters.brands.join(','),
        vehicleType: filters.vehicleTypes.join(','),
        minPrice: filters.priceRange[0].toString(),
        maxPrice: filters.priceRange[1].toString(),
        minRating: filters.minRating.toString()
      }
    }));
  };

  // Initial fetch or filters changed
  useEffect(() => {
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
  }, [dispatch, filters]);

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    setShowCarForm(true);
  };

  const handleCloseForm = () => {
    setShowCarForm(false);
    setEditingCar(null);
  };

  if (loading && cars.length === 0) {
    return (
      <Box p={3}>
        <Box className={styles.cardContainer}>
          {Array.from({ length: 6 }).map((_, index) => (
            <CardShimmer key={index} />
          ))}
        </Box>
      </Box>
    );
  }

  // Add this safety check at the top of the component
  if (!cars || !Array.isArray(cars)) {
    return <div>Loading...</div>;
  }

  return (
    <Box 
      p={{ xs: 1, sm: 2, md: 3 }} 
      sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={{ xs: 2, sm: 3 }}
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 },
          textAlign: { xs: 'center', sm: 'left' }
        }}
      >
        <Typography 
          variant="h4" 
          component="h1"
          sx={{
            fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.125rem' },
            fontWeight: { xs: 600, sm: 500 },
            color: 'black'
          }}
        >
          Available Cars ({pagination?.total || 0})
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowCarForm(true)}
            sx={{
              minWidth: { xs: '100%', sm: 'auto' },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              padding: { xs: '12px 24px', sm: '8px 16px' },
              borderRadius: { xs: '8px', sm: '4px' }
            }}
          >
            Add New Car
          </Button>
        )}
      </Box>
      
      <Box 
        className={styles.cardContainer} 
        sx={{ 
          flex: 1, 
          overflow: 'auto',
          px: { xs: 0, sm: 1 }
        }}
      >
        {cars.map((car) => (
          <LazyLoadCard 
            key={car.id || `${car.brand}-${car.model}-${car.year}`} 
            car={car}
            onEdit={isAdmin ? handleEditCar : undefined}
          />
        ))}
      </Box>

      {/* Fixed Pagination at Bottom */}
      {pagination.totalPages > 1 && (
        <Box 
          display="flex" 
          justifyContent="center" 
          py={{ xs: 1, sm: 2 }}
          sx={{ 
            position: 'sticky',
            bottom: 0,
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #e0e0e0',
            zIndex: 10
          }}
        >
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton={false}
            showLastButton={false}
            siblingCount={1}
            boundaryCount={1}
          />
        </Box>
      )}

      <CarForm
        open={showCarForm}
        onClose={handleCloseForm}
        car={editingCar}
      />
    </Box>
  );
};
