import { ConfigProvider } from "antd";
import zhTW from "antd/es/locale/zh_TW";
import "dayjs/locale/zh-cn";
import "firebase/database";
import React from "react";
import { Outlet } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import Header from "./components/Header";
import { auth } from "./firbase";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Noto Sans TC', sans-serif;
  }

  #root {
    min-height: 100vh;
    padding: 140px 0 115px;
    position: relative;

    @media screen and (max-width: 1279px) {
      padding: 102px 0 208px;
    }
  }
`;

auth.onAuthStateChanged((user) => {
  if (user) {
    // 使用者已登入
    console.log("使用者已登入:", user);
  } else {
    // 使用者已登出
    console.log("使用者已登出");
  }
});

const App: React.FC = () => {
  return (
    <>
      <ConfigProvider locale={zhTW}>
        <GlobalStyle />
        <Header />
        <Outlet />
        {/* <AddDailyMeal /> */}
      </ConfigProvider>
    </>
  );
};

export default App;
