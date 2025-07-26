import { createContext } from 'react';
import { type User } from 'firebase/auth';

export interface AuthContextType {
  currentUser: User | null;
  userRole: string | null;
  signin: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
