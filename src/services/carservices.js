import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';

// Get all cars
export const getCars = async () => {
  const carsCollection = collection(db, 'cars');
  const carsSnapshot = await getDocs(carsCollection);
  return carsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Add new car
export const addCar = async (carData) => {
  const carsCollection = collection(db, 'cars');
  return await addDoc(carsCollection, {
    ...carData,
    createdAt: new Date().toISOString()
  });
};

// Update car
export const updateCar = async (carId, carData) => {
  const carDoc = doc(db, 'cars', carId);
  return await updateDoc(carDoc, {
    ...carData,
    updatedAt: new Date().toISOString()
  });
};

// Delete car
export const deleteCar = async (carId) => {
  const carDoc = doc(db, 'cars', carId);
  return await deleteDoc(carDoc);
};

// Purchase car
export const purchaseCar = async (userId, carId, carDetails) => {
  const purchasesCollection = collection(db, 'purchases');
  
  // Add purchase record
  await addDoc(purchasesCollection, {
    userId,
    carId,
    carDetails,
    purchasePrice: carDetails.price,
    purchaseDate: new Date().toISOString(),
    status: 'completed'
  });
  
  // Update car stock
  const carDoc = doc(db, 'cars', carId);
  await updateDoc(carDoc, {
    stock: carDetails.stock - 1
  });
};

// Get user purchases
export const getUserPurchases = async (userId) => {
  const purchasesCollection = collection(db, 'purchases');
  const q = query(
    purchasesCollection, 
    where('userId', '==', userId),
    orderBy('purchaseDate', 'desc')
  );
  const purchasesSnapshot = await getDocs(q);
  return purchasesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
