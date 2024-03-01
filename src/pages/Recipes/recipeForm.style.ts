import { Button } from "antd";
import styled from "styled-components";
import { device } from "../../utils/breakpoints";

export const AddRecipeButton = styled(Button)`
  background: rgba(252, 208, 57, 0.7);
  font-size: 20px;
  color: #000000;
  height: 44px;
  transition: all 0.2s;
  text-align: center;

  &:hover {
    background: rgba(252, 208, 57, 1) !important;
  }
  @media ${device.mobile} {
    font-size: 16px;
    height: 32px;
  }
`;

export const UploadText = styled.div`
  margin-top: 8px;
  @media ${device.mobile} {
    margin-top: 4px;
  }
`;
