import { createContext, useState, useContext } from "react";

export const UserContext = createContext(null);

export function UserContextProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}

// Kullanıcı bağlamını kullanmak için custom hook
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserContextProvider');
  }
  return context;
}
