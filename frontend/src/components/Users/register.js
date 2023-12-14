import styled from 'styled-components';
import { Link } from 'react-router-dom';
export const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
`;

export const RegisterForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 20px;
  border: 1px solid #e9ecef;
  border-radius: 5px;
  gap:20px;
  background-color: #f8f9fa;

`;

export const InputField = styled.input`
  margin-bottom: 10px;
  padding: 8px;
  font-size: 16px;
`;

export const SubmitButton = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: #7D4F50;
  border: none ;
  color: white;
  cursor: pointer;
`;


export const BackToLoginLink = styled.div`
  margin-top: -10px;
  font-size:16px;
  color: #007bff;
  cursor: pointer;
`;
export const ErrorMessage = styled.div`
  color: red;
  margin-top: 5px;
`;