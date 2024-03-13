import "firebase/database";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { db } from "../../../firbase";

const useGetPartnerList = () => {
  const userInformation = useContext(AuthContext);
  const currentUserUid = userInformation?.user?.uid;
  const [partnerList, setPartnerList] = useState<string[]>([]);

  useEffect(() => {
    const getPartnerData = async () => {
      const userCollection = collection(db, "user");
      if (currentUserUid !== null) {
        const q = query(userCollection, where("uid", "==", currentUserUid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.exists()) {
              const data = doc.data();

              if (data.partners) {
                setPartnerList(data.partners);
              }
            }
          });
        });

        return () => unsubscribe();
      }
    };

    getPartnerData();
  }, [currentUserUid]);

  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const getUserData = async () => {
      const userCollection = collection(db, "user");
      if (currentUserUid !== null) {
        const q = query(userCollection, where("uid", "==", currentUserUid));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.exists()) {
              const data = doc.data();

              if (data.name) {
                setUserName(data.name);
              }
            }
          });
        });

        return () => unsubscribe();
      }
    };

    getUserData();
  }, [currentUserUid]);

  const partners = [
    {
      label: userName,
      key: "1",
    },
    ...partnerList.map((partner, index) => ({
      label: partner,
      key: String(index + 2),
    })),
  ];
  return partners;
};
export default useGetPartnerList;
