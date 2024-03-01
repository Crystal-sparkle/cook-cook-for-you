import { UserOutlined } from "@ant-design/icons";
import { Button, Flex, Space, message } from "antd";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "firebase/firestore";
import { useState } from "react";
import { auth } from "../firbase";

import {
  Background,
  InputStyle,
  LoginButtonStyle,
  LoginFormContainer,
  Overlay,
  ProCardStyle,
  SigninButtonStyle,
  SpaceStyle,
  VideoContainer,
} from "./login.style";

function Login() {
  const [email, setEmail] = useState("jing@gmail.com");
  const [password, setPassword] = useState("111111");
  const [userName, SetUserName] = useState("");

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      message.success("註冊成功");
    } catch (error) {
      message.error("註冊失敗");
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      message.success("登入成功!");

      const currentUser = auth.currentUser;
      if (currentUser) {
        const userUID = currentUser.uid;
        console.log(`使用者 UID: ${userUID}`);
      } else {
        console.log("沒有當前登入的使用者");
      }
    } catch (error) {
      message.error("登入失敗");
    }
  };

  const [showLogin, setShowLogin] = useState(true);

  const handleToggle = () => {
    setShowLogin(!showLogin);
  };

  return (
    <>
      <VideoContainer>
        {/* <BackgroundVideo autoPlay loop muted playsInline>
          <source
          // src="https://firebasestorage.googleapis.com/v0/b/cook-cook-for-you-test.appspot.com/o/baking-cut.mp4?alt=media&token=6f6d9fdc-1d05-4f51-9f8b-7d30b213e1de"
          // type="video/mp4"
          />
        </BackgroundVideo> */}
        <Background src="https://firebasestorage.googleapis.com/v0/b/cook-cook-for-you-test.appspot.com/o/%E8%8D%89%E8%8E%93%E6%B2%99%E6%8B%89.jpeg?alt=media&token=4d731914-153f-4001-b7cb-bd451c343968" />
        <Overlay />
        <LoginFormContainer>
          {showLogin ? (
            <Flex wrap="wrap" gap="small" justify="center" align="middle">
              <ProCardStyle title="登入" boxShadow>
                <SpaceStyle direction="vertical" size="middle">
                  <InputStyle
                    size="large"
                    placeholder="E-mail"
                    prefix={<UserOutlined />}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <InputStyle
                    size="large"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <br />
                </SpaceStyle>
                <Space>
                  <Button type="primary" onClick={handleLogin}>
                    Login
                  </Button>
                  <br />
                  <br />
                  {/* <SigninButtonStyle type="primary" onClick={handleLogout}>
                    Logout
                  </SigninButtonStyle>
                  <br /> */}
                  <SigninButtonStyle type="link" onClick={handleToggle}>
                    新帳號註冊
                  </SigninButtonStyle>
                </Space>
              </ProCardStyle>
            </Flex>
          ) : (
            <Flex wrap="wrap" gap="small" justify="center" align="middle">
              <ProCardStyle title="註冊帳號" tooltip="請輸入有效帳號" boxShadow>
                <Space direction="vertical" size="middle">
                  <InputStyle
                    size="large"
                    type="name"
                    placeholder="Crystal"
                    value={userName}
                    onChange={(e) => SetUserName(e.target.value)}
                  />

                  <InputStyle
                    size="large"
                    placeholder="E-mail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <InputStyle
                    size="large"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div>
                    <Button type="primary" onClick={handleRegister}>
                      Register
                    </Button>
                    <LoginButtonStyle type="link" onClick={handleToggle}>
                      已有帳號囉
                    </LoginButtonStyle>
                  </div>
                </Space>
              </ProCardStyle>
            </Flex>
          )}
        </LoginFormContainer>
      </VideoContainer>
    </>
  );
}

export default Login;
