import "firebase/database";
import { useEffect, useState } from "react";
import { subscribeToPartnerData } from "../../../../../services/firebase";

const useGetPartnerList = (userId: string | undefined) => {
  const [partnerList, setPartnerList] = useState<string[]>([]);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    if (userId !== null) {
      const unsubscribe = subscribeToPartnerData(
        "user",
        "uid",
        userId,
        setPartnerList,
        setUserName
      );
      return () => unsubscribe();
    }
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
