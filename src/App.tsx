import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/loginPage/Login.tsx';
import './App.css';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { HomePage } from './pages/home/home.tsx';
import CarDetailPage from './pages/carDetailPage/CarDetailPage';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="loader-spinner"></div>
        <p>Loading your car inventory...</p>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/home" replace />} 
        />
        <Route 
          path="/home" 
          element={user ? <HomePage user={user} /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/car/:id" 
          element={user ? <CarDetailPage /> : <Navigate to="/login" replace />} 
        />
        {/* <Route 
          path="/purchases" 
          element={user ? <PurchasesPage /> : <Navigate to="/login" replace />} 
        /> */}
        <Route 
          path="/" 
          element={<Navigate to={user ? "/home" : "/login"} replace />} 
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
