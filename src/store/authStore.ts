import { create } from 'zustand';
import { signIn, signOut, getSession } from 'next-auth/react';
import { useCartStore } from './cartStore';

interface User {
  id: string;
  username: string;
  email: string;
  accountType: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (loading) => set({ loading }),
  checkAuth: async () => {
    try {
      const session = await getSession();
      if (session?.user) {
        set({ 
          user: {
            id: session.user.id,
            username: session.user.username,
            email: session.user.email,
            accountType: session.user.accountType
          },
          isAuthenticated: true,
          loading: false 
        });
      } else {
        set({ 
          user: null,
          isAuthenticated: false,
          loading: false 
        });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      set({ 
        user: null,
        isAuthenticated: false,
        loading: false 
      });
    }
  },
  login: async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/'
      });

      if (result?.error) {
        // Map NextAuth error messages to user-friendly messages
        if (result.error === 'CredentialsSignin') {
          throw new Error('Invalid email or password. Please try again.');
        } else if (result.error.includes('user not found')) {
          throw new Error('User not found. Please check your email or sign up.');
        } else {
          throw new Error(result.error);
        }
      }

      const session = await getSession();
      if (session?.user) {
        set({ 
          user: {
            id: session.user.id,
            username: session.user.username,
            email: session.user.email,
            accountType: session.user.accountType
          },
          isAuthenticated: true,
          loading: false 
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Login error:', errorMessage);
      throw new Error('Login failed. Please try again.');
    }
  },
  logout: async () => {
    try {
      await signOut({ redirect: false });
      set({ user: null, isAuthenticated: false });
      
      // Reset the cart when a user logs out
      const resetCart = useCartStore.getState().resetCart;
      resetCart();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
})); 