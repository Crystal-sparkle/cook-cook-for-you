import "firebase/database";
import { useEffect, useState } from "react";
import { handleGetDataObject } from "../../../../../services/firebase";
import { PurchasePlan } from "../../../../../types";

const useGetPurchasePlan = (purchasePlanId: string | undefined) => {
  const [purchasePlan, setPurchasePlan] = useState<PurchasePlan>();

  useEffect(() => {
    const unsubscribe = handleGetDataObject(
      "purchasePlan",
      "planId",
      purchasePlanId,
      setPurchasePlan
    );
    return () => unsubscribe();
  }, [purchasePlanId]);

  return purchasePlan;
};

export default useGetPurchasePlan;
