import type { MenuProps } from "antd";
import { Menu, Space, message } from "antd";
import { signOut } from "firebase/auth";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { auth } from "../../firbase";
import {
  HeaderSpan,
  ImageWrapper,
  Logo,
  MenuContainer,
  RotatingImage,
  Wrapper,
} from "./Header.style";
import logoFirst from "./LogoFirst.png";
import lemonCircle from "./lemonCircle.png";

export default function Header() {
  const userInformation = useContext(AuthContext);
  const userId = userInformation?.user?.uid;
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      message.error("登出失敗");
    }
  };

  const [currentPage, setCurrentPage] = useState("");

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrentPage(e.key);

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
    ...(userId
      ? [
          {
            label: <HeaderSpan onClick={() => handleLogout()}>登出</HeaderSpan>,
            key: "logout",
          },
        ]
      : []),
  ];

  return (
    <div>
      <Wrapper>
        <Link to="/" style={{ textDecoration: "none" }}>
          <div>
            <Logo src={logoFirst} />
          </div>
        </Link>

        <MenuContainer>
          <div>
            <Menu
              onClick={onClick}
              selectedKeys={[currentPage]}
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
