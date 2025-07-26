import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { useAppDispatch } from '../../store/hooks';
import { addCar, updateCar } from '../../store/carSlice';
import { toast } from 'react-toastify';

interface Car {
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
  mileage: string;
  transmission: string;
  seatingCapacity: number;
}

interface CarFormProps {
  open: boolean;
  onClose: () => void;
  car?: Car | null;
}

const CarForm: React.FC<CarFormProps> = ({ open, onClose, car }) => {

  useEffect(() => {
    if (car) {
      setFormData({
        brand: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
        vehicleType: car.vehicleType,
        rating: car.rating,
        stock: car.stock,
        color: car.color,
        imageUrl: car.imageUrl,
        description: car.description,
        mileage: car.mileage,
        transmission: car.transmission,
        seatingCapacity: car.seatingCapacity
      });
    }
    return () =>{
      setFormData({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
        vehicleType: 'Petrol',
        rating: 0,
        stock: 0,
        color: '',
        imageUrl: '',
        description: '',
        mileage: '',
        transmission: 'Manual',
        seatingCapacity: 5
      });
    } 
  },[car]);
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    brand: car?.brand || '',
    model: car?.model || '',
    year: car?.year || new Date().getFullYear(),
    price: car?.price || 0,
    vehicleType: car?.vehicleType || 'Petrol',
    rating: car?.rating || 0,
    stock: car?.stock || 0,
    color: car?.color || '',
    imageUrl: car?.imageUrl || '',
    description: car?.description || '',
    mileage: car?.mileage || '',
    transmission: car?.transmission || 'Manual',
    seatingCapacity: car?.seatingCapacity || 5
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (car?.id) {
        await dispatch(updateCar({ id: car.id, updates: formData }));
        toast.success('Car updated successfully!');
      } else {
        await dispatch(addCar({ ...formData, available: true, features: [] }));
        toast.success('Car created successfully!');
      }
      onClose();
    } catch (error) {
      console.error('Failed to save car:', error);
      toast.error('Operation failed. Please try again.');
    }
  };

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{car ? 'Edit Car' : 'Add New Car'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                label="Brand"
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Model"
                value={formData.model}
                onChange={(e) => handleChange('model', e.target.value)}
                required
              />
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', Number(e.target.value))}
                required
              />
              <TextField
                fullWidth
                label="Stock"
                type="number"
                value={formData.stock}
                onChange={(e) => handleChange('stock', Number(e.target.value))}
                required
              />
            </Box>
            <TextField
              fullWidth
              label="Image URL"
              value={formData.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {car ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CarForm;
