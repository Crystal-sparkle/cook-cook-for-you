import styled from "styled-components";
import { device } from "../../utils/breakpoints";

export const Image = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  object-position: 50% -110px;
`;
export const MainContent = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 5px;
  border-radius: 5px;
`;

export const StepsWrapper = styled.div`
  width: 22%;

  @media ${device.mobile} {
    display: contents;
  }
`;
export const MealCalenderWrapper = styled.div`
  width: 77%;
  @media ${device.mobile} {
    display: contents;
  }
`;

export const StepsButton = styled.div`
  margin: 24px 0;
  @media ${device.mobile} {
    margin: 6px 0;
  }
`;

export const Cotent = styled.div`
  /* line-height: 120px; */
  text-align: start;
  border-radius: 8px;
  margin-top: 6px;
  width: 100%;
`;
