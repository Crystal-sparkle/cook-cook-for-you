import "firebase/database";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import { db } from "../../../firbase";

const useGetPartnerList = (userId: string | undefined) => {
  // const { userId } = useParams();
  const [partnerList, setPartnerList] = useState<string[]>([]);

  useEffect(() => {
    const getPartnerData = async () => {
      const userCollection = collection(db, "user");
      if (userId !== null) {
        const q = query(userCollection, where("uid", "==", userId));
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
  }, [userId]);

  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const getUserData = async () => {
      const userCollection = collection(db, "user");
      if (userId !== null) {
        const q = query(userCollection, where("uid", "==", userId));
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
  }, [userId]);

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
