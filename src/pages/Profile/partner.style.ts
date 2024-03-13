import { ProCard } from "@ant-design/pro-components";
import styled from "styled-components";
import { device } from "../../utils/breakpoints";

export const PartnerContainer = styled.div`
  display: flex;
  margin: 10px auto;

  @media ${device.mobile} {
    margin: 6px auto;
  }
`;

export const PartnerProCard = styled(ProCard)`
  min-width: 330px;
`;
