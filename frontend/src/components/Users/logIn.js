import styled from 'styled-components';


export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
`;

export const LoginForm = styled.form`
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
  border-radius: 10px;
  border: 1px solid #ccc;
  outline: none; 
  transition: border-color 0.3s ease; 
  
  &:focus {
    border-color: #7D4F50; 
  }
  &::placeholder {
    color: #ccc; 
  }
`;

export const SubmitButton = styled.button`
  padding: 10px;
  font-size: 16px;
  background-color: #7D4F50;
  color: white;
  border: none;
  cursor: pointer;
`;

export const ErrorMessage = styled.div`
  color: red;
  margin-top: -10px;
  font-size: 80%;
`;

export const SigUpButton = styled.div`
  font-size:16px;
  color: #007bff;
  cursor: pointer;
  margin-top:-10px;
`;

export const ForgetButton = styled.div`
  font-size:16px;
  color: #007bff;
  cursor: pointer;
  margin-top:-10px;
`;