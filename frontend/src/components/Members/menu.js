import styled from "styled-components";


export const LeftGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  padding: 0 10px;
  width: fit-content;
`;


export const Text = styled.text`
  font-size: 12px;
  white-space: nowrap;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    width: 0;
    height: 1px;
    bottom: 0;
    background-color: #fca311; 
    transition: width 0.3s ease; 
  }

  &:hover:before {
    width: 100%;
  }
`;

export const PageDiv = styled.div`
  width: 100%;
  display: flex;
  /* margin: 0 auto; */
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  padding: 10px 10px;
`;

export const TitleImg = styled.img`
  width:20px;
`

export const LinkContainer  = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  gap:5px;
  &:hover ${TitleImg} {
    transform: scale(1.2); 
  }
`