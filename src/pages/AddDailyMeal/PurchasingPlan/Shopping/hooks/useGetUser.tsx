import { User } from "firebase/auth";
import "firebase/database";
import { useEffect, useState } from "react";
import { handleGetDataObject } from "../../../../../services/firebase";

const useGetUser = (userId: string | undefined) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    handleGetDataObject("user", "uid", userId, setUser);
  }, [userId]);

  return user;
};

export default useGetUser;
