import { EditOutlined, ExportOutlined } from "@ant-design/icons";
import { Button, Drawer } from "antd";
import styled from "styled-components";
import { device } from "../../../utils/breakpoints";

export const SharingButton = styled(Button)`
  margin-right: 5px;
  color: #f7bc0d;

  @media ${device.mobile} {
    width: 100%;
  }
`;

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  justify-content: space-around;
`;

export const CookingDate = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
`;
export const GroupPartner = styled.div`
  display: flex;
  align-items: baseline;
`;

export const ExportOutlinedIconStyle = styled(ExportOutlined)`
  font-size: 24px;
`;
export const ShowMembers = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
  font-size: 16px;
`;

export const ShowServing = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
  font-size: 16px;
  font-weight: 500;
`;

export const Serving = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
  font-size: 16px;
`;

export const ShoppingListButtonStyle = styled(Button)`
  width: 100%;
  font-size: 18px;
  height: 40px;

  @media ${device.mobile} {
  }
`;

export const UserOutlinedIconStyle = styled(EditOutlined)`
  color: #f7bc0d;
  font-weight: 800;
`;

export const DrawerStyle = styled(Drawer)`
  color: #000;
  .body {
    padding-bottom: 70px;
  }
`;
