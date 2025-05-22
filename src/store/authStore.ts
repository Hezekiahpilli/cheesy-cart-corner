
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, firstName: string, lastName: string, email: string) => Promise<boolean>;
  logout: () => void;
  users: User[];
}

// In a real application, we would make API calls to authenticate
// For this demo, we'll use a simple in-memory user system
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      users: [
        {
          id: '1',
          username: 'admin',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@pizzadelight.com',
          isAdmin: true,
        },
        {
          id: '2',
          username: 'customer',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          isAdmin: false,
        }
      ],
      
      login: async (username, password) => {
        // For demo purposes, we're accepting any password
        // In a real app, you'd check password hash
        const user = get().users.find(u => u.username === username);
        
        if (user) {
          set({
            user,
            isAuthenticated: true,
            isAdmin: user.isAdmin
          });
          return true;
        }
        
        return false;
      },
      
      register: async (username, password, firstName, lastName, email) => {
        // Check if username already exists
        const existingUser = get().users.find(u => u.username === username || u.email === email);
        
        if (existingUser) {
          return false;
        }
        
        // Create new user
        const newUser: User = {
          id: uuidv4(),
          username,
          firstName,
          lastName,
          email,
          isAdmin: false,
        };
        
        set(state => ({
          users: [...state.users, newUser],
          user: newUser,
          isAuthenticated: true,
          isAdmin: false
        }));
        
        return true;
      },
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isAdmin: false
        });
      }
    }),
    {
      name: 'pizza-auth-storage',
    }
  )
);
