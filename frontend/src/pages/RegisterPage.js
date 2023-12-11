import { useNavigate } from "react-router-dom";
import {RegisterContainer, RegisterForm, InputField, SubmitButton, BackToLoginLink, ErrorMessage} from "../components/Users/register.js"
import { useState } from "react";
import { AuthService } from "../components/Users/authService.js";
import { Input } from 'antd';

export const Register = () => {
    const [name, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleLogInClick = () => {
      navigate("/users/login");
    };

    const handleRegister = async (e) => {
      e.preventDefault();
  
      if (password !== confirmPassword) {
        setError('密碼不符');
        return;
      }
  
      // Add your registration logic here
      console.log('Username:', name);
      console.log('Password:', password);
      console.log('Email:', email);
      // Reset error state
      setError('');
      try {
        const token = await AuthService.registerUser({ name, password, email });
        AuthService.setToken(token);
        navigate("/users/login");
      } catch (error) {
        console.error('Registration error:', error.response.data);
        setError('註冊失敗，請檢查輸入信息');
      }
    };

    const handleLogin = async (e) => {
      e.preventDefault();
    
      try {
        const token = await AuthService.loginUser({ name, password });
        AuthService.setToken(token);
        navigate("/"); // 你可以導向登入後的頁面
      } catch (error) {
        console.error('Login error:', error.response.data);
        setError('登入失敗，請檢查輸入信息');
      }
    };

  
    return (
      <RegisterContainer>
        <RegisterForm onSubmit={handleRegister}>
        <Input
            type="email"
            placeholder="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="text"
            placeholder="使用者帳號"
            value={name}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="再次確認密碼"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <SubmitButton type="submit">Register</SubmitButton>
          <BackToLoginLink onClick={handleLogInClick}>已有會員? 會員登入</BackToLoginLink>
        </RegisterForm>
      </RegisterContainer>
    );
  };