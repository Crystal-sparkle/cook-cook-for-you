import styled from "styled-components";
import { device } from "../../utils/breakpoints";
import banner1 from "./banner1.jpeg";

export const Wrapper = styled.div`
  margin: 20px;
  padding: 10px;
  border-radius: 20px;

  @media ${device.mobile} {
    margin: 10px 0;
  }
`;
export const BannerImg = styled.div`
  background-size: cover;
  background-image: url(${banner1});
  width: 100%;
  height: 240px;
  object-fit: cover;
  display: flex;
  align-items: center;
  @media ${device.mobile} {
    height: 120px;
  }
`;
export const RecipeFormWrapper = styled.div`
  margin: 0 auto;
`;

export const Title = styled.div`
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 20px;

  @media ${device.mobile} {
    font-size: 20px;
    margin-bottom: 10px;
  }
`;
