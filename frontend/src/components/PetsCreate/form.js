import styled from "styled-components";


export const FormContainer = styled.div`
  max-width: 400px;
  width: 100%;
  margin: 10px auto;
`;

export const FormGroup = styled.div`
  margin-bottom: 16px;
`;
export const CheckboxGroup = styled.div`
  display: flex;
  gap: 10px;
`;
export const Checkbox = styled.input`
 margin: 0 10px;

`
export const Label = styled.label`
  display: block;
  font-size: 16px;
  margin-bottom: 8px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  border-radius: 10px;
  margin-top: 5px;
`;

export const Select = styled.select`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #e9e9e9;
  border-radius: 5px;
`;
export const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 10px;
  border: 1px solid #e9e9e9;
`;

export const SubmitButton = styled.button`
  background-color: #3d5a80;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
