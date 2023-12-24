import { ConfigProvider } from "antd";

import zhTW from "antd/es/locale/zh_TW";
import "dayjs/locale/zh-cn";
import "firebase/database";
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import Header from "./components/Header";
import { auth } from "./firbase";
import AddDailyMeal from "./pages/AddDailyMeal/index.tsx";
import Login from "./pages/Login.tsx";
import Profile from "./pages/Profile/index.tsx";
import Recipes from "./pages/Recipes/index.tsx";
import Shopping from "./pages/Shopping";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

 
  @font-face {
  font-family: 'openhuninn';
  src: url('/src/fonts/jf-openhuninn-2.0.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

body, .ant {
  font-family: 'openhuninn' ,'Noto Sans TC', sans-serif, ;
    
  }
  


  #root {
    min-height: 100vh;
    padding: 75px 0 115px;
    position: relative;

    @media screen and (max-width: 1279px) {
      padding: 102px 0 208px;
    }
  }
`;

const App: React.FC = () => {
  const [user, setUser] = useState(() => {
    return auth.currentUser;
  });
  // const [userInformation, setUserInformation] = useState<UserInformation>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        console.log("使用者已登入:", user);
        console.log("user", user);
      } else {
        console.log("使用者未登入");
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <ConfigProvider
        locale={zhTW}
        theme={{
          components: {
            Button: {
              // primaryColor: "#330350ea",
            },
          },
          token: {
            colorPrimary: "#f7bc0d",
          },
        }}
      >
        <GlobalStyle />
        <Header />
        <Routes>
          {/* <Route path="/" element={<AddDailyMeal user={user} />} /> */}
          {/* <Route path="/"> */}
          {user ? (
            <>
              <Route path="/" element={<AddDailyMeal user={user} />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/recipes" element={<Recipes />} />
            </>
          ) : (
            <Route path="*" element={<Login />} />
          )}
          {/* </Route> */}
          <Route
            path="/login"
            element={user ? <Navigate to="/dailymealplan" /> : <Login />}
          />
          <Route
            path="/shopping/:userId/:purchasePlanId"
            element={<Shopping />}
          />
        </Routes>
      </ConfigProvider>
    </>
  );
};

export default App;
