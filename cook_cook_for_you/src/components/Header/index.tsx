import {
  FileTextOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Space } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 140px;
  width: 100%;
  padding: 0 54px 0 60px;
  border-bottom: 10px solid #313538;
  z-index: 99;
  background-color: white;
  justify-content: space-between;
  display: flex;

  /* @media screen and (max-width: 1279px) {
    height: 52px;
    padding: 0;
    border: none;
    justify-content: center;
  } */
`;

const CustomBreadcrumb = styled(Breadcrumb)`
  display: flex;
  justify-content: flex-end;
  font-size: 20px;
`;
function Header() {
  return (
    <Wrapper>
      <CustomBreadcrumb>
        <Link to="/dailymealplan">
          <Space>
            <span>我是Logo</span>
          </Space>
        </Link>
        <Breadcrumb.Item></Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/dailymealplan">
            <Space>
              <HomeOutlined style={{ fontSize: "1em" }} />
              <span>dailymealplan</span>
            </Space>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/recipes">
            <Space>
              <FileTextOutlined style={{ fontSize: "1em" }} />
              <span>建立食譜</span>
            </Space>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/profile">
            <Space>
              <UserOutlined style={{ fontSize: "1em" }} />
              <span>會員</span>
            </Space>
          </Link>
        </Breadcrumb.Item>
      </CustomBreadcrumb>
    </Wrapper>
  );
}

export default Header;
