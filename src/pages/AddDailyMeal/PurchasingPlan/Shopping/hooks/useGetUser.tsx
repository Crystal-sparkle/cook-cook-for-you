import { User } from "firebase/auth";
import "firebase/database";
import { useEffect, useState } from "react";
import { handleGetDataObject } from "../../../../../services/firebase";

const useGetUser = (userId: string | undefined) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unsubscribe = handleGetDataObject("user", "uid", userId, setUser);

    return () => unsubscribe();
  }, [userId]);

  return user;
};

export default useGetUser;
