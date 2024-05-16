import { ProCard } from "@ant-design/pro-components";
import { Card } from "antd";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { handleGetData } from "../../../services/firebase";
import { PartnerList, PurchasePlanProps } from "../../../types";
import Partner from "./Partner";
import PurchasingDrawer from "./PurchasingDrawer";
import {
  CookingDate,
  GroupPartner,
  Serving,
  ShowMembers,
  ShowServing,
  Wrapper,
} from "./PurchasingPlan.style";
import useGetPartnerList from "./Shopping/hooks/useGetPartnerList";
const PurchasingPlan = ({
  purchasePlanCollection,
  activeCookingPlan,
  setPurchasePlanCollection,
}: PurchasePlanProps) => {
  const userInformation = useContext(AuthContext);
  const userId = userInformation?.user?.uid;
  const partners: PartnerList[] = useGetPartnerList(userId);
  const [planId, setPlanId] = useState<string>("");

  useEffect(() => {
    handleGetData("purchasePlan", "isActive", true, setPlanId);
  }, []);

  const dateForCooking = activeCookingPlan?.cookingDate
    ?.toDate()
    .toLocaleDateString("zh-TW");
  if (activeCookingPlan === undefined) {
    return <div>請先建立烹煮計畫</div>;
  }

  return (
    <Wrapper>
      <Card>
        <div>
          <ProCard>
            <div>
              <CookingDate>烹煮日期：{dateForCooking}</CookingDate>
              <GroupPartner>
                <ShowServing> 夥伴：</ShowServing>
                <div style={{ height: "27px" }}>
                  {" "}
                  <Partner />
                </div>
              </GroupPartner>
              <ShowMembers>
                <div></div>
                {partners.map(
                  (partner, index) =>
                    index !== 0 && (
                      <Serving
                        key={`${partner.key}-${partner.label}`}
                        style={{ marginLeft: 6 }}
                      >
                        {partner.label}
                      </Serving>
                    )
                )}
              </ShowMembers>
              <ShowServing>料理份量：</ShowServing>
              {activeCookingPlan?.cookingItems.map((plan, index) => (
                <Serving key={`${index}-${plan}`}>
                  <div>
                    {index + 1}. {plan.name}
                  </div>
                  <div>
                    {plan.serving} {plan.unit}
                  </div>
                </Serving>
              ))}
            </div>
          </ProCard>
        </div>
        <div>
          <PurchasingDrawer
            purchasePlanCollection={purchasePlanCollection}
            planId={planId}
            setPurchasePlanCollection={setPurchasePlanCollection}
          />
        </div>
      </Card>
    </Wrapper>
  );
};
export default PurchasingPlan;
