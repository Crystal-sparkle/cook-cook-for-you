import { message } from "antd";
import { User } from "firebase/auth";
import "firebase/database";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../../../firbase";

const useGetUser = (userId: string | undefined) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const getUser = async () => {
      const purchaseCollection = collection(db, "user");
      const queryRef = query(purchaseCollection, where("uid", "==", userId));

      const unsubscribe = onSnapshot(
        queryRef,
        (querySnapshot) => {
          const results: User[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();

            results.push(data as User);
          });

          setUser(results[0]);
        },
        () => {
          message.error("取得資料時發生錯誤");
        }
      );

      return () => unsubscribe();
    };

    if (userId) {
      getUser();
    }
  }, [userId]);

  return user;
};

export default useGetUser;
