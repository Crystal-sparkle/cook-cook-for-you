import { StepForwardOutlined } from "@ant-design/icons";
import { Button, Space } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import "firebase/database";
import React from "react";
import styled from "styled-components";
import AddDailyMeal from "./AddDailyMeal";
dayjs.locale("zh-cn");

const Wrapper = styled.div`
  margin: 40px;
  padding: 20px;
  border-radius: 20px;
`;

const App: React.FC = () => {
  return (
    <Wrapper>
      <Space>
        <Button type="primary">
          <StepForwardOutlined />
        </Button>
      </Space>
      <AddDailyMeal />
    </Wrapper>
  );
};

export default App;
