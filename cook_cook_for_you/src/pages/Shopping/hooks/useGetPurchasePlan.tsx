import { message } from "antd";
import "firebase/database";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../firbase";
import { PurchasePlan } from "../../../types";

const useGetPurchasePlan = (purchasePlanId: string | undefined) => {
  const [purchasePlan, setPurchasePlan] = useState<PurchasePlan>();

  useEffect(() => {
    const getPurchasePlan = async () => {
      const purchaseCollection = collection(db, "purchasePlan");
      const queryRef = query(
        purchaseCollection,
        where("planId", "==", purchasePlanId)
      );

      const unsubscribe = onSnapshot(
        queryRef,
        (querySnapshot) => {
          const results: PurchasePlan[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();

            results.push(data as PurchasePlan);
          });

          setPurchasePlan(results[0]);
        },
        () => {
          message.error("取得資料時發生錯誤");
        }
      );

      return () => unsubscribe();
    };

    if (purchasePlanId) {
      getPurchasePlan();
    }
  }, [purchasePlanId]);

  return purchasePlan;
};

export default useGetPurchasePlan;
