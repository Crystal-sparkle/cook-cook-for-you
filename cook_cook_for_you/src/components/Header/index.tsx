import {
  FileTextOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu, Space } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import logoFirst from "./LogoFirst.png";
const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 75px;
  width: 100%;
  padding: 10px 24px 0px 20px;
  /* border-bottom: 10px solid #313538; */
  z-index: 99;
  background-color: white;
  justify-content: space-between;
  display: flex;
  align-items: center;

  @media screen and (max-width: 1279px) {
    height: 52px;
    border: none;
    padding: 5px;
    /* justify-content: center; */
  }
`;

const Logo = styled.img`
  height: 60px;
  background-repeat: none;

  @media screen and (max-width: 1279px) {
    height: 50px;
  }
`;

/// menu prop
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
      <Link to="/dailymealplan">
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
];
// {
//   label: (
//     <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
//       Navigation Four - Link
//     </a>
//   ),
//   key: "alipay",
// },
// ];

///
function Header() {
  //
  const [current, setCurrent] = useState("");

  const onClick: MenuProps["onClick"] = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };

  //
  return (
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
      <div>
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
        />
      </div>
    </Wrapper>
  );
}

export default Header;
