// Menu.js
import styled from 'styled-components';

export const MenuImgContainer = styled.div`
  cursor: pointer;
  transition: all 0.3s ease
  
`;
export const MenuImg = styled.img`
  width:30px;
  height:30px;
  transition: all 0.3s ease
`;



export const MenuOptions = styled.div`
  display: ${({ isMenuOpen }) => (isMenuOpen ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
  gap: 10px;

  div {
    font-size: 14px;
    cursor: pointer;
    position: relative;

    &:hover {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
  }
`;