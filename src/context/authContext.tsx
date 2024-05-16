import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../firebase";

export const AuthContext = createContext<{ user: User | null }>({ user: null });

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(() => {
    return auth.currentUser;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};
