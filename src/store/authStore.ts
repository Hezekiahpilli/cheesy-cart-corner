
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<LoginResult>;
  register: (username: string, password: string, firstName: string, lastName: string, email: string) => Promise<boolean>;
  logout: () => void;
  users: User[];
}

type LoginResult =
  | { success: true }
  | { success: false; error: 'username' | 'password' };

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
          passwordHash: '$2b$10$BGwH73Ke3Pg3XlOkSPW8jOrqaW6hmKAWJaJ3PEFYK1ANy6bzAxRNC',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@pizzadelight.com',
          isAdmin: true,
        },
        {
          id: '2',
          username: 'customer',
          passwordHash: '$2b$10$Q8L.zwXMKm82kdFt.MWuAu.qjZKwbcx6ZqWJPXy2b35VSRehMvKZO',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          isAdmin: false,
        },
      ],

      login: async (username, password) => {
        const user = get().users.find(u => u.username === username);

        if (!user) {
          return { success: false, error: 'username' };
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
          return { success: false, error: 'password' };
        }

        set({
          user,
          isAuthenticated: true,
          isAdmin: user.isAdmin
        });
        return { success: true };
      },

      register: async (username, password, firstName, lastName, email) => {
        // Check if username already exists
        const existingUser = get().users.find(u => u.username === username || u.email === email);

        if (existingUser) {
          return false;
        }

        const passwordHash = await bcrypt.hash(password, 10);

        // Create new user
        const newUser: User = {
          id: uuidv4(),
          username,
          passwordHash,
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
