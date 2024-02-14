import { createContext, useState, ReactNode } from 'react';
import { User } from '../models/user';
import { UserResponse } from '../models/userResponse';

interface UserContextType {
  user: UserResponse | null;
  setUser: (user: UserResponse | null) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserResponse | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};