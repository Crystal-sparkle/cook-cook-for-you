import { UserOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { Button, Flex, Input, Space, message } from "antd";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import "firebase/firestore";
import { useState } from "react";
import styled from "styled-components";
import { auth } from "../firbase";

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const BackgroundVideo = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: auto;

  transform: translate(-50%, -50%);
  z-index: 1;

  @media (min-aspect-ratio: 16/9) {
    width: 100%;
    height: auto;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 2;
`;

const LoginFormContainer = styled.div`
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40%;

  z-index: 3;
`;
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
  const handleLogout = async () => {
    try {
      await signOut(auth);
      message.success("登出成功!");
    } catch (error) {
      message.error("登出失敗");
    }
  };

  const [showLogin, setShowLogin] = useState(true);

  const handleToggle = () => {
    setShowLogin(!showLogin);
  };

  return (
    <>
      <VideoContainer>
        <BackgroundVideo autoPlay loop muted playsInline>
          <source
            src="https://firebasestorage.googleapis.com/v0/b/cook-cook-for-you-test.appspot.com/o/baking-cut.mp4?alt=media&token=6f6d9fdc-1d05-4f51-9f8b-7d30b213e1de"
            type="video/mp4"
          />
        </BackgroundVideo>
        <Overlay />
        <LoginFormContainer>
          {showLogin ? (
            <Flex wrap="wrap" gap="small" justify="center" align="middle">
              <ProCard
                title="登入"
                style={{
                  maxWidth: 440,
                  padding: "10px",
                  fontSize: "20px",
                  backgroundColor: " rgba(255, 255, 255, 0.9)",
                }}
                boxShadow
              >
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ display: "flex" }}
                >
                  <Input
                    size="large"
                    placeholder="E-mail"
                    prefix={<UserOutlined />}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ height: "40px" }}
                  />
                  <Input
                    size="large"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ height: "40px" }}
                  />
                  <br />
                </Space>

                <Space>
                  <Button
                    type="primary"
                    onClick={handleLogin}
                    style={{ fontSize: "18px", height: "36px" }}
                  >
                    Login
                  </Button>
                  <br />
                  <br />
                  <Button
                    type="primary"
                    onClick={handleLogout}
                    style={{ fontSize: "18px", height: "36px" }}
                  >
                    Logout
                  </Button>
                  <br />
                  <Button
                    type="link"
                    onClick={handleToggle}
                    style={{ fontSize: "16px" }}
                  >
                    還沒有帳號嗎？ 點選註冊
                  </Button>
                </Space>
              </ProCard>
            </Flex>
          ) : (
            <Flex wrap="wrap" gap="small" justify="center" align="middle">
              <ProCard
                title="註冊帳號"
                tooltip="請輸入有效帳號"
                style={{ maxWidth: 400, margin: 100 }}
                boxShadow
              >
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ display: "flex" }}
                >
                  <Input
                    size="large"
                    type="name"
                    placeholder="Crystal"
                    value={userName}
                    onChange={(e) => SetUserName(e.target.value)}
                    style={{ height: "40px" }}
                  />

                  <Input
                    size="large"
                    placeholder="E-mail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ height: "40px" }}
                  />
                  <Input
                    size="large"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ height: "40px" }}
                  />
                  <br />
                </Space>

                <Button type="primary" onClick={handleRegister}>
                  Register
                </Button>
                <Button
                  style={{ marginLeft: "5px" }}
                  type="link"
                  onClick={handleToggle}
                >
                  已有帳號囉 點選登入
                </Button>
              </ProCard>
            </Flex>
          )}
        </LoginFormContainer>
      </VideoContainer>
    </>
  );
}

export default Login;
