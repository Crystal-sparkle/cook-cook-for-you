import { ProCard } from "@ant-design/pro-components";
import { Button, Input, Space } from "antd";
import styled from "styled-components";
import { device } from "../../utils/breakpoints";

export const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

export const Background = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  z-index: 2;
`;

export const LoginFormContainer = styled.div`
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40%;

  z-index: 3;
`;

export const ProCardStyle = styled(ProCard)`
  min-width: 340px;
  padding: 10px;
  font-size: 20px;
  background-color: rgba(255, 255, 255, 0.9);
`;

export const SpaceStyle = styled(Space)`
  display: flex;
`;

export const InputStyle = styled(Input)`
  height: 40px;
`;

export const LoginButtonStyle = styled(Button)`
  margin-left: 5px;
`;

export const SigninButtonStyle = styled(Button)`
  /* font-size: 16px;
  height: 36px;
  width: 78px; */
  text-align: center;

  @media ${device.mobile} {
    /* font-size: 14px;
    height: 34px; */
  }
`;
