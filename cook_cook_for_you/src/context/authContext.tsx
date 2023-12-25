import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../firbase";

export const AuthContext = createContext<{ user: User | null }>({ user: null });

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(() => {
    return auth.currentUser;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log("使用者已登入:", user);
      } else {
        console.log("使用者未登入");
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};
