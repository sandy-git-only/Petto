import React, { useState, useContext } from "react";
import {
  LoginContainer,
  LoginForm,
  ForgetButton,
  SubmitButton,
  ErrorMessage,
  SigUpButton,
  InputField
} from "../components/Users/logIn.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setAuthToken, getAuthToken } from "../utils/token.js";
import { AuthContext } from "../utils/contexts.js";
import { getMe } from "../utils/token.js";


export const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { user,setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  if(user){
    navigate("/");
  }
  const handleSignUpClick = () => {
    navigate("/users/register");
  };
  const handleLogIn = async (e) => {
    e.preventDefault();
    // Add your login logic here
    try {
      setError("");
      if (password.length < 8) {
        console.log(password.length);
        setError("密碼至少為8位數");
        return;
      }
      setError("");
      const response = await axios.post(`http://46.51.228.163:4000/api/1.0/users/signin`, {
        email,
        password,
      });
      const data = await response.data.data;
      setAuthToken(data.access_token);
      await getMe().then((response) => {
        if (!response) {
          // 在 getMe() 出錯代表還沒成功登入，因此要把 token 清空
          setAuthToken(null);
          setError(response.toString());
        }
        setUser(response.userID);
      });
      navigate("/");
    } catch (e) {
      console.error("Login error", e.response);
      setError("登入失敗，請檢查輸入訊息");
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleLogIn}>
        <InputField
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          type="password"
          placeholder="密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <SubmitButton type="submit" >會員登入</SubmitButton>
        <div style={{display:"flex", justifyContent:"space-between"}}>
        <SigUpButton onClick={handleSignUpClick}>會員註冊</SigUpButton>
        <ForgetButton>忘記密碼?</ForgetButton>
        </div>
      </LoginForm>
    </LoginContainer>
  );
};
