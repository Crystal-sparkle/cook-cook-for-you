import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { Button, message } from "antd";
import React from "react";
import { UpdateToPartnerList, auth } from "../../../../services/firebase";
import { PartnerType } from "../../../../types";
import { UserOutlinedIconStyle } from "../PurchasingPlan.style";
import { PartnerContainer, PartnerProCard } from "./partner.style";

const Partner: React.FC = () => {
  const currentUser = auth.currentUser;
  const currentUid: string = currentUser?.uid ?? "";

  const handlePartnerList = async (values: PartnerType) => {
    if (!values.partner1Name) {
      message.error("Missing partner details");
      return false;
    }
    UpdateToPartnerList("user", "uid", currentUid, [
      values.partner1Name,
      values.partner2Name,
    ]);
    return true;
  };

  return (
    <>
      <ModalForm
        title="編輯夥伴清單"
        trigger={
          <Button type="text">
            <UserOutlinedIconStyle />
          </Button>
        }
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
        }}
        onFinish={handlePartnerList}
      >
        <PartnerContainer>
          <PartnerProCard>
            <ProFormText
              width="md"
              label="夥伴 1 名字 "
              name="partner1Name"
              labelCol={{ span: 8 }}
            />

            <ProFormText
              width="md"
              label="夥伴 2 名字 "
              name="partner2Name"
              labelCol={{ span: 8 }}
            />
          </PartnerProCard>
        </PartnerContainer>
      </ModalForm>
    </>
  );
};
export default Partner;
