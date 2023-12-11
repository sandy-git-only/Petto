import styled from 'styled-components';

export const AdoptBlock = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 100%;
    height: auto;
`;

export const ContactPerson = styled.text`
    font-size: 60%;

`

export const AdoptButton = styled.button`
  border-radius: 30px;
  font-size: 12px;
  padding: 8px;
  border: #D1BE9C;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease-in-out; 
  cursor: pointer;
  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); 
    transform: scale(1.1);
  }

  &:active {
    transform: translateY(2px); 
  }
`;

export const MapFrame = styled.iframe`
  width: 100%;
  height: auto;
  border: 0;
`;