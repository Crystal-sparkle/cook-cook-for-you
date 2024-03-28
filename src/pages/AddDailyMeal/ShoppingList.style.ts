import styled from "styled-components";
import { device } from "../../utils/breakpoints";

export const Header = styled.div`
  display: flex;
  justify-content: space-around;

  @media ${device.mobile} {
    border-bottom: 1px solid #3f3a3a;
    padding: 10px 0;
  }
`;

export const TitleContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: nowrap;
  align-items: center;

  border: 2px dashed #33cfe0;
  font-size: 18px;
  line-height: 30px;
  font-weight: bold;
`;

export const Item = styled.div`
  width: 100px;
  font-size: 16px;
  text-align: center;

  @media ${device.mobile} {
    font-size: 14px;
    width: 80px;
  }
`;
export const ItemOrder = styled.div`
  width: 70px;
  font-size: 16px;
  text-align: center;
  @media ${device.mobile} {
    font-size: 14px;
    width: 30px;
  }
`;

export const InputCheck = styled.input`
  margin: 0 3px;
  width: 16px;
  height: 16px;
`;

export const Wrapper = styled.div`
  width: 100%;
  padding: 10px 0;
`;

export const ShoppingListTitle = styled.div`
  font-size: 18px;
  @media ${device.mobile} {
    font-size: 14px;
  }
`;

export const ShoppingItems = styled.div`
  margin: 10px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;
