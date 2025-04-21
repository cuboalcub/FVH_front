import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserContextType = {
  userType: string;
  setUserType: React.Dispatch<React.SetStateAction<string>>;
};

// Create the context with an initial undefined value
const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<string>('user'); // Default to normal user

  return (
    <UserContext.Provider value={{ userType, setUserType }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
