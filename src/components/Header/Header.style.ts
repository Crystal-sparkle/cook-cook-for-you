import styled, { keyframes } from "styled-components";
import { device } from "../../utils/breakpoints";

export const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 75px;
  width: 100%;
  padding: 10px 24px 0px 20px;
  z-index: 99;
  background-color: white;
  justify-content: space-between;
  display: flex;
  align-items: center;

  @media ${device.mobile} {
    height: 70px;
    border: none;
    padding: 5px;
    flex-direction: column;
  }
`;

export const Logo = styled.img`
  height: 60px;
  background-repeat: none;
  @media ${device.mobile} {
    height: 40px;
  }
`;

export const MenuContainer = styled.div`
  display: flex;

  @media ${device.mobile} {
    width: 100%;
    justify-content: center;
  }
`;

const rotateClockwise = keyframes`
  0%, 50% { transform: rotate(0deg); }
  25% { transform: rotate(360deg); }
`;

const rotateCounterClockwise = keyframes`
  50%, 100% { transform: rotate(0deg); }
  75% { transform: rotate(-360deg); }
`;

export const RotatingImage = styled.img`
  width: 44px;
  height: auto;
  border-radius: 100%;
  animation:
    ${rotateClockwise} 7s linear infinite,
    ${rotateCounterClockwise} 7s linear infinite;
`;

export const ImageWrapper = styled.div`
  position: absolute;
  z-index: 80;
  bottom: -22px;
  left: 50%;
  transform: translateX(-50%);
`;

export const HeaderSpan = styled.span`
  font-size: 20px;
  @media ${device.mobile} {
    font-size: 14px;
  }
`;
