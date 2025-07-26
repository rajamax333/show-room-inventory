import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Rating,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  LocalGasStation,
  Speed,
  People,
  Favorite,
  FavoriteBorder,
  MoreVert,
  Edit,
  Delete
} from '@mui/icons-material';
import { useAuth } from '../../../hooks/useAuth';
import { useAppDispatch } from '../../../store/hooks';
import { deleteCar } from '../../../store/carSlice';
import { Shimmer } from '../../../components/Shimmer/Shimmer';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import type { Car } from "../../../store/carSlice";

const CarCard: React.FC<{ car: Car; onEdit?: (car: Car) => void }> = ({ car, onEdit }) => {
  const navigate = useNavigate();
  // Debug logging to catch undefined values
  console.log('CarCard props:', {
    brand: car.brand,
    model: car.model,
    vehicleType: car.vehicleType,
    description: car.description,
    mileage: car.mileage,
    transmission: car.transmission,
    seatingCapacity: car.seatingCapacity
  });

  const [isFavorite, setIsFavorite] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { userRole } = useAuth();
  const dispatch = useAppDispatch();
  const [imageLoaded, setImageLoaded] = useState(false);

  const isAdmin = userRole === 'admin'; // Adjust based on your auth logic

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation(); // Prevent card click navigation
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    if (car.id && window.confirm('Are you sure you want to delete this car?')) {
      try {
        await dispatch(deleteCar(car.id));
        toast.success('Car deleted successfully!');
      } catch (error) {
        console.error('Failed to delete car:', error);
        toast.error('Failed to delete car. Please try again.');
      }
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(car);
    }
    handleMenuClose();
  };

  const handleCardClick = () => {
    navigate(`/car/${car.id}`);
  };


  // Safety function to ensure string values
  const safeString = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined) return '';
    return String(value);
  };

  return (
    <Card 
      sx={{ 
        maxWidth: 345, 
        margin: 'auto', 
        position: 'relative',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          transform: 'translateY(-2px)',
          cursor: 'pointer'
        },
        transition: 'all 0.3s ease'
      }}
      onClick={handleCardClick}
    >
      {!imageLoaded && (
        <Shimmer height="200px" />
      )}
      {isAdmin && (
        <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
          <IconButton onClick={handleMenuOpen} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.8)' }}>
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={(event) => event.stopPropagation()}
          >
            <MenuItem onClick={(event) => {
              event.stopPropagation();
              handleEdit();
            }}>
              <Edit sx={{ mr: 1 }} /> 
              <span>Edit</span>
            </MenuItem>
            <MenuItem onClick={(event) => {
              event.stopPropagation();
              handleDelete();
            }}>
              <Delete sx={{ mr: 1 }} /> 
              <span>Delete</span>
            </MenuItem>
          </Menu>
        </Box>
      )}
      
      <CardMedia
        component="img"
        height="200"
        image={safeString(car.imageUrl)}
        alt={`${safeString(car.brand)} ${safeString(car.model)}`}
        onLoad={() => setImageLoaded(true)}
        style={{ display: imageLoaded ? 'block' : 'none' }}
      />
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" component="div">
            {safeString(car.brand)} {safeString(car.model)}
          </Typography>
          <Chip 
            label={safeString(car.vehicleType) || 'Unknown'} 
            color="primary" 
            size="small"
            variant="outlined"
          />
        </Box>
        
        <Typography variant="h5" color="primary" fontWeight="bold" mb={1}>
          ₹{car.price?.toLocaleString() || '0'}
        </Typography>
        
        <Box display="flex" alignItems="center" mb={1}>
          <Rating value={car.rating || 0} precision={0.1} size="small" readOnly />
          <Typography variant="body2" color="text.secondary" ml={1}>
            ({car.rating || 0})
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" mb={2}>
          {safeString(car.description)}
        </Typography>
        
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center">
            <LocalGasStation fontSize="small" color="action" />
            <Typography variant="caption" ml={0.5}>
              {safeString(car.mileage)}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Speed fontSize="small" color="action" />
            <Typography variant="caption" ml={0.5}>
              {safeString(car.transmission)}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <People fontSize="small" color="action" />
            <Typography variant="caption" ml={0.5}>
              {safeString(car.seatingCapacity)}
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="body2" color={car.stock > 0 ? "success.main" : "error.main"}>
          {car.stock > 0 ? `${car.stock} in stock` : 'Out of stock'}
        </Typography>
      </CardContent>
      
      <CardActions>
        {!isAdmin && (
          <IconButton 
            onClick={(event) => {
              event.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            color="error"
          >
            {isFavorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};

export default CarCard;
