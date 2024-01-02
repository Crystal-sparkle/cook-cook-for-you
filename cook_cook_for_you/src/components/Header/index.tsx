import {
  FileTextOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu, Space, message } from "antd";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { Link } from "react-router-dom";
import { keyframes, styled } from "styled-components";
import { auth } from "../../firbase";
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

  @media screen and (max-width: 1279px) {
    height: 52px;
    border: none;
    padding: 5px;
  }
`;

const Logo = styled.img`
  height: 60px;
  background-repeat: none;
  @media screen and (max-width: 1279px) {
    height: 50px;
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
  z-index: 100;
  bottom: -22px;
  left: 50%;
`;
// const dripAnimation = keyframes`
//   0% { opacity: 0; transform: translateY(0); }
//   50% { opacity: 1; }
//   100% { opacity: 0; transform: translateY(50px); }
`;
// const LemonJuice = styled.div`;
//   width: 7px;
//   height: 16px;
//   background-color: #eed73e;
//   border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
//   position: absolute;
//   top: 100px;
//   left: 50px;
//   animation: ${dripAnimation} 3s ease-out infinite;
// `;

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
    console.log("click ", e);
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
            <span style={{ fontSize: "20px" }}>食譜列表</span>
          </Space>
        </Link>
      ),
      key: "recipes",
      icon: <FileTextOutlined style={{ fontSize: "1em" }} />,
    },
    {
      label: (
        <Link to="/">
          <Space>
            <span style={{ fontSize: "20px" }}>料理計畫</span>
          </Space>
        </Link>
      ),
      key: "dailymealplan",
      icon: <HomeOutlined style={{ fontSize: "1em" }} />,
      disabled: false,
    },
    {
      label: (
        <Space>
          <span style={{ fontSize: "20px" }}>會員</span>
        </Space>
      ),
      key: "profile",
      icon: <UserOutlined style={{ fontSize: "1em" }} />,

      children: [
        {
          label: (
            <Link to="/profile" style={{ textDecoration: "none" }}>
              <Space>
                <span style={{ fontSize: "20px" }}>會員資訊</span>
              </Space>
            </Link>
          ),
          key: "setting:1",
        },
        {
          label: (
            <Space>
              <span style={{ fontSize: "20px" }}>夥伴清單</span>
            </Space>
          ),
          key: "setting:2",
        },
      ],
    },
    {
      label: (
        <span style={{ fontSize: "20px" }} onClick={() => handleLogout()}>
          登出
        </span>
      ),
      key: "logout",
    },
  ];
  //
  return (
    <div>
      <Wrapper>
        <Link to="/" style={{ textDecoration: "none" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Logo src={logoFirst} />
          </div>
        </Link>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <div>
            <Menu
              onClick={onClick}
              selectedKeys={[current]}
              mode="horizontal"
              items={items}
            />
          </div>
        </div>
      </Wrapper>
      <div style={{ position: "absolute", width: "100%" }}>
        <ImageWrapper>
          <RotatingImage src={lemonCircle} alt="Rotating Image" />
          {/* <LemonJuice
            style={{ animationDelay: "5s", left: "40px", top: "30px" }}
          />
          <LemonJuice style={{ animationDelay: "7s", left: "50px" }} /> */}
        </ImageWrapper>
      </div>
    </div>
  );
}

export default Header;
