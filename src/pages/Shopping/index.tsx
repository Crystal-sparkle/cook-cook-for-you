import { useParams } from "react-router-dom";
import ShoppingList from "../AddDailyMeal/ShoppingList";

import useGetPurchasePlan from "./hooks/useGetPurchasePlan";
import useGetUser from "./hooks/useGetUser";

const Shopping = () => {
  const { userId, purchasePlanId } = useParams();

  const user = useGetUser(userId);
  const purchasePlan = useGetPurchasePlan(purchasePlanId);

  if (!purchasePlan || !user) return null;

  return <ShoppingList purchasePlan={purchasePlan} index={0} />;
};

export default Shopping;
