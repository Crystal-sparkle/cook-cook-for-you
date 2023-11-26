import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "firebase/firestore";
import { useState } from "react";
import styled from "styled-components";
import { auth } from "../firbase";

const Wrapper = styled.div`
  width: 100%;
  border: 2px solid #8488d9;
  background-color: #81c2ce;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: start;
  flex-wrap: wrap;
  flex-direction: column;
  margin: 10px;
`;
const Section = styled.div`
  display: flex;
  height: 10vh;
  width: 80px;
  flex-direction: column;
  text-align: left;
`;

const InputBtn = styled.button`
  margin: 10px;
  padding: 3px;
  height: 4vh;
  width: 100px;
  background-color: #fddb69;
  border: solid 1px #c7a125;
  font-size: 14px;
`;

const Input = styled.input`
  height: 30px;
  width: 300px;
  border-radius: 10px;
  border: 2px solid #015d67;
  margin: 20px auto;
  font-size: 20px;
  padding: 4px;
`;
const H3 = styled.h3`
  color: #5c16f4;
  width: 100px;
  margin: 0;
`;

function Profile() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registration successful!");
    } catch (error) {
      console.error("Registration failed:", error);
      alert(`Registration failed: ${(error as any).message}`);
    }
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
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
      alert(`Login failed: ${(error as any).message}`);
    }
  };

  return (
    <>
      <h1>User Registration</h1>
      <Wrapper>
        <Section>
          <H3>E-mail :</H3>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Section>
        <Section>
          <H3>Password :</H3>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Section>
        <section>
          <InputBtn onClick={handleRegister}>Register</InputBtn>
          <InputBtn onClick={handleLogin}>Login</InputBtn>
        </section>
      </Wrapper>
    </>
  );
}

export default Profile;
