import { UserOutlined } from "@ant-design/icons";
import { ProCard } from "@ant-design/pro-components";
import { Button, Flex, Input, Space } from "antd";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import "firebase/firestore";
import { useState } from "react";
// import styled from "styled-components";
import { auth } from "../firbase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      alert("註冊成功");
    } catch (error) {
      console.error("註冊失敗:", error);
      alert("註冊失敗");
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("登入成功!");
      // 獲取當前已登入使用者的 UID
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userUID = currentUser.uid;
        console.log(`使用者 UID: ${userUID}`);
        //註冊時新增user檔案且抓到userUID
        // addUser(userUID);
      } else {
        console.log("沒有當前登入的使用者");
      }
    } catch (error) {
      alert("登入失敗");
    }
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("登出成功!");
    } catch (error) {
      console.error("登出失敗", error);
      alert("登出失敗");
    }
  };

  const [showLogin, setShowLogin] = useState(true);

  const handleToggle = () => {
    setShowLogin(!showLogin);
  };

  return (
    <>
      {showLogin ? (
        <Flex wrap="wrap" gap="small" justify="center" align="middle">
          <ProCard
            title="登入"
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
                placeholder="E-mail"
                prefix={<UserOutlined />}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                size="large"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />
            </Space>

            <Space>
              <Button type="primary" onClick={handleLogin}>
                Login
              </Button>
              <br />
              <br />
              <Button type="primary" onClick={handleLogout}>
                Logout
              </Button>
              <br />
              <Button type="link" onClick={handleToggle}>
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Input
                size="large"
                placeholder="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                size="large"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
    </>
  );
}

export default Login;

// export  authState;