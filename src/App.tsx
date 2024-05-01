import { ConfigProvider } from "antd";
import zhTW from "antd/es/locale/zh_TW";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import "firebase/database";
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import Header from "./components/Header/index.tsx";
import { AuthContextProvider } from "./context/authContext.tsx";
import { auth } from "./firbase.ts";
import Shopping from "./pages/AddDailyMeal/PurchasingPlan/Shopping/index.tsx";
import AddDailyMeal from "./pages/AddDailyMeal/index.tsx";
import Login from "./pages/Login/Login.tsx";
import Recipes from "./pages/Recipes/index.tsx";
dayjs.locale("zh-cn");

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
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState(() => {
    return auth.currentUser;
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
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
        <AuthContextProvider>
          <Header />
          <Routes>
            {!loading && (
              <>
                {user ? (
                  <>
                    <Route path="/" element={<AddDailyMeal />} />
                    <Route path="/recipes" element={<Recipes />} />
                  </>
                ) : (
                  <Route path="*" element={<Login />} />
                )}
                <Route
                  path="/login"
                  element={user ? <Navigate to="/" /> : <Login />}
                />
              </>
            )}
            <Route
              path="/shopping/:userId/:purchasePlanId"
              element={<Shopping />}
            />
          </Routes>
        </AuthContextProvider>
      </ConfigProvider>
    </>
  );
};

export default App;
