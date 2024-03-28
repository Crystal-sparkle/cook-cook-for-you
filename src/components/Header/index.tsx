import type { MenuProps } from "antd";
import { Menu, Space, message } from "antd";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";
import { keyframes, styled } from "styled-components";
import { auth } from "../../firbase";
import { device } from "../../utils/breakpoints";
import logoFirst from "./LogoFirst.png";
import lemonCircle from "./lemonCircle.png";
const Wrapper = styled.div`
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

const Logo = styled.img`
  height: 60px;
  background-repeat: none;
  @media ${device.mobile} {
    height: 40px;
  }
`;

const MenuContainer = styled.div`
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

const RotatingImage = styled.img`
  width: 44px;
  height: auto;
  border-radius: 100%;
  animation:
    ${rotateClockwise} 7s linear infinite,
    ${rotateCounterClockwise} 7s linear infinite;
`;

const ImageWrapper = styled.div`
  position: absolute;
  z-index: 80;
  bottom: -22px;
  left: 50%;
  transform: translateX(-50%);
`;

const HeaderSpan = styled.span`
  font-size: 20px;
  @media ${device.mobile} {
    font-size: 14px;
  }
`;

const LogoWrapper = styled.div``;

function Header() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      message.error("登出失敗");
    }
  };
  //
  const [current, setCurrent] = useState("");

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);

    if (e.key === "logout") {
      handleLogout();
    }
  };

  const items: MenuProps["items"] = [
    {
      label: (
        <Link to="/recipes">
          <Space>
            <HeaderSpan>食譜列表</HeaderSpan>
          </Space>
        </Link>
      ),
      key: "recipes",
    },
    {
      label: (
        <Link to="/">
          <Space>
            <HeaderSpan>料理計畫</HeaderSpan>
          </Space>
        </Link>
      ),
      key: "dailymealplan",
      disabled: false,
    },

    {
      label: <HeaderSpan onClick={() => handleLogout()}>登出</HeaderSpan>,
      key: "logout",
    },
  ];
  //
  return (
    <div>
      <Wrapper>
        <Link to="/" style={{ textDecoration: "none" }}>
          <LogoWrapper>
            <Logo src={logoFirst} />
          </LogoWrapper>
        </Link>

        <MenuContainer>
          <div>
            <Menu
              onClick={onClick}
              selectedKeys={[current]}
              mode="horizontal"
              items={items}
            />
          </div>
        </MenuContainer>
      </Wrapper>
      <div style={{ position: "absolute", width: "100%" }}>
        <ImageWrapper>
          <RotatingImage src={lemonCircle} alt="Rotating Image" />
        </ImageWrapper>
      </div>
    </div>
  );
}

export default Header;
