// types/auth.ts
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'anonymous';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}