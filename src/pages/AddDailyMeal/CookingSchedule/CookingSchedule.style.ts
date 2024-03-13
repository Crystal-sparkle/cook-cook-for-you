import { Button, Card } from "antd";
import styled from "styled-components";
import { device } from "../../../utils/breakpoints";

export const CardStyle = styled(Card)`
  width: 100%;
  margin-bottom: 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  justify-content: space-between;

  @media ${device.mobile} {
    margin-bottom: 4px;
  }
`;

export const Wrapper = styled.div`
  min-width: 300px;
`;

export const TotalServingTitle = styled.div`
  font-size: 14px;
  margin-top: 5px;
`;

export const ServingList = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px auto;
  font-size: 16px;
  text-align: center;
  @media ${device.mobile} {
    margin: 2px auto;
    font-size: 14px;
  }
`;

export const ServingItem = styled.div`
  display: flex;
  margin-top: 6px;
  margin-right: 5px;
`;

export const CookingScheduleButton = styled(Button)`
  background-color: #b7dbdf;
  color: #4b4947;

  @media ${device.mobile} {
    font-size: 14px;
  }
`;

export const ModleText = styled.p`
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  color: #000000;
  @media ${device.mobile} {
    font-size: 16px;
  }
`;
export const ShoppingListPhoto = styled.img`
  width: 200px;
  vertical-align: middle;
  border-radius: 20px;

  @media ${device.mobile} {
    width: 100px;
  }
`;

export const PhotoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
