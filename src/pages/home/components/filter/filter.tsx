import React from 'react';
import {
  Box,
  Typography,
  Slider,
  Chip,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@mui/material';
import { ExpandMore, FilterList, Clear } from '@mui/icons-material';
import styles from './filter.module.scss';
import { useFilter } from '../../../../hooks/useFilter';

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  priceRange: [number, number];
  brands: string[];
  vehicleTypes: string[];
  minRating: number;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const { filters, dispatch } = useFilter();

  const brands = ['BMW', 'Mercedes', 'Audi', 'Toyota', 'Honda', 'Ford'];
  const vehicleTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];

  const handlePriceChange = (_: Event, newValue: number | number[]) => {
    const updatedFilters = { ...filters, priceRange: newValue as [number, number] };
    dispatch({ type: 'SET_PRICE_RANGE', payload: newValue as [number, number] });
    onFilterChange(updatedFilters);
  };

  const handleBrandToggle = (brand: string) => {
    dispatch({ type: 'TOGGLE_BRAND', payload: brand });
    const updatedBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    const updatedFilters = { ...filters, brands: updatedBrands };
    onFilterChange(updatedFilters);
  };

  const handleVehicleTypeToggle = (type: string) => {
    dispatch({ type: 'TOGGLE_VEHICLE_TYPE', payload: type });
    const updatedTypes = filters.vehicleTypes.includes(type)
      ? filters.vehicleTypes.filter(t => t !== type)
      : [...filters.vehicleTypes, type];
    const updatedFilters = { ...filters, vehicleTypes: updatedTypes };
    onFilterChange(updatedFilters);
  };

  const handleRatingChange = (_: React.SyntheticEvent, newValue: number | null) => {
    dispatch({ type: 'SET_RATING', payload: newValue || 0 });
    const updatedFilters = { ...filters, minRating: newValue || 0 };
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
    const resetFilters = {
      priceRange: [0, 100000] as [number, number],
      brands: [],
      vehicleTypes: [],
      minRating: 0,
    };
    onFilterChange(resetFilters);
  };

  return (
    <div className={styles.filterContainer}>
      <Box className={styles.filterHeader}>
        <FilterList />
        <Typography 
          variant="h6" 
          sx={{
            color: "black",
            fontSize: {
              xs: '1rem',
              sm: '1.1rem', 
              md: '1.25rem'
            }
          }}
        >
          Filters
        </Typography>
        <Button onClick={clearFilters} size="small" startIcon={<Clear />}>
          Clear
        </Button>
      </Box>

      <Accordion >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Price Range</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Slider
            value={filters.priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={100000}
            step={5000}
            valueLabelFormat={(value) => `₹${value.toLocaleString()}`}
          />
          <Typography variant="body2" color="textSecondary">
            ₹{filters.priceRange[0].toLocaleString()} - ₹{filters.priceRange[1].toLocaleString()}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Brand</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className={styles.chipContainer}>
            {brands.map((brand) => (
              <Chip
                key={brand}
                label={String(brand)}
                onClick={() => handleBrandToggle(brand)}
                color={filters.brands.includes(brand) ? 'primary' : 'default'}
                variant={filters.brands.includes(brand) ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Vehicle Type</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className={styles.chipContainer}>
            {vehicleTypes.map((type) => (
              <Chip
                key={type}
                label={String(type)}
                onClick={() => handleVehicleTypeToggle(type)}
                color={filters.vehicleTypes.includes(type) ? 'primary' : 'default'}
                variant={filters.vehicleTypes.includes(type) ? 'filled' : 'outlined'}
              />
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Minimum Rating</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Rating
            value={filters.minRating}
            onChange={handleRatingChange}
            precision={0.5}
            size="large"
          />
          <Typography variant="body2" color="textSecondary">
            {filters.minRating} stars & above
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default Filter;
