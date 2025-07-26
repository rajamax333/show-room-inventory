export interface Car {
  id?: string;
  brand: string;
  model: string;
  price: number;
  stock: number;
  // ... other properties
}

export declare const purchaseCar: (userId: string, carId: string, carDetails: Car) => Promise<void>;
export declare const getCars: () => Promise<Car[]>;
// ... other function declarations
