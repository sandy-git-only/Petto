import styled from "styled-components";

export const PageDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin: 10px 0;
`;
export const IconContainer = styled.div`
  gap:20px;
  display: flex;
  justify-content: center;
  padding: 10px;
`;
export const OptionContainer = styled.div`
  display: flex;
  gap:20px;
`;
export const CardContainer = styled.div`
  position: relative;
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 10px;
  border-radius: 20px;
  background-color: #FFFFFF;
  transition: box-shadow 0.3s ease;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2); 
  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); 
    transform: scale(1.05); ;
} 
`;
export const PetContainer = styled.div``;
export const InfoContainer = styled.div`
  bottom: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #FFFFFF;
`;
export const AllInfoContainer = styled.div`
  position: absolute;
  bottom: 5px;
  display: flex;
  justify-content: space-between;
  width: 70%;
`;
