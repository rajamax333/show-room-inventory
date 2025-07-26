import { http, HttpResponse } from 'msw';
import { carData } from '../data';
import type { Car } from '../store/carSlice';

// In-memory storage for cars (simulates database)
let cars = [...carData.map((car, index) => ({ ...car, id: index.toString() }))];

export const handlers = [
  // Get cars with filters and pagination
  http.get('/api/cars', ({ request }) => {
    const url = new URL(request.url);
    
    // Pagination params
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    // Filter params
    const brand = url.searchParams.get('brand');
    const vehicleType = url.searchParams.get('vehicleType');
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const minRating = url.searchParams.get('minRating');
    const search = url.searchParams.get('search');
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';

    let filteredCars = [...cars];

    // Apply filters
    if (brand) {
      const brands = brand.split(',');
      filteredCars = filteredCars.filter(car => 
        brands.some(b => car.brand.toLowerCase().includes(b.toLowerCase()))
      );
    }

    if (vehicleType) {
      const types = vehicleType.split(',');
      filteredCars = filteredCars.filter(car => 
        types.includes(car.vehicleType)
      );
    }

    if (minPrice && maxPrice) {
      filteredCars = filteredCars.filter(car => 
        car.price >= parseInt(minPrice) && car.price <= parseInt(maxPrice)
      );
    }

    if (minRating) {
      const minRatingValue = parseFloat(minRating);
      filteredCars = filteredCars.filter(car => 
        car.rating >= minRatingValue
      );
    }

    if (search) {
      filteredCars = filteredCars.filter(car =>
        car.brand.toLowerCase().includes(search.toLowerCase()) ||
        car.model.toLowerCase().includes(search.toLowerCase()) ||
        car.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply sorting
    filteredCars.sort((a, b) => {
      let aValue = a[sortBy as keyof typeof a];
      let bValue = b[sortBy as keyof typeof b];
      
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
      
      if (sortOrder === 'asc') {
        return (aValue ?? '') > (bValue ?? '') ? 1 : -1;
      }
      return (aValue ?? '') < (bValue ?? '') ? 1 : -1;
    });

    // Apply pagination
    const total = filteredCars.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCars = filteredCars.slice(startIndex, endIndex);

    return HttpResponse.json({
      cars: paginatedCars,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: endIndex < total,
        hasPrev: page > 1
      }
    });
  }),

  // Get single car by ID
  http.get('/api/cars/:id', ({ params }) => {
    const car = cars.find(c => c.id === params.id);
    
    if (!car) {
      return HttpResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json(car);
  }),

  // Create new car
  http.post('/api/cars', async ({ request }) => {
    const newCar = await request.json() as Omit<Car, 'id' | 'createdAt' | 'updatedAt' | 'available'>;
    
    const car = {
      ...newCar,
      id: (cars.length + 1).toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      available: true
    };

    cars.push(car);

    return HttpResponse.json(car, { status: 201 });
  }),

  // Update car
  http.put('/api/cars/:id', async ({ params, request }) => {
    const carIndex = cars.findIndex(c => c.id === params.id);
    
    if (carIndex === -1) {
      return HttpResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      );
    }

    const updates = await request.json() as Partial<Omit<Car, 'id' | 'createdAt'>>;
    cars[carIndex] = {
      ...cars[carIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return HttpResponse.json(cars[carIndex]);
  }),

  // Delete car
  http.delete('/api/cars/:id', ({ params }) => {
    const carIndex = cars.findIndex(c => c.id === params.id);
    
    if (carIndex === -1) {
      return HttpResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      );
    }

    const deletedCar = cars.splice(carIndex, 1)[0];
    
    return HttpResponse.json({ 
      message: 'Car deleted successfully',
      car: deletedCar 
    });
  }),

  // Bulk operations
  http.post('/api/cars/bulk-delete', async ({ request }) => {
    const { ids } = await request.json() as { ids: string[] };
    
    const deletedCars = cars.filter(car => ids.includes(car.id));
    cars = cars.filter(car => !ids.includes(car.id));
    
    return HttpResponse.json({
      message: `${deletedCars.length} cars deleted successfully`,
      deletedCars
    });
  })
];
