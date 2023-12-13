import styled from "styled-components";
import { Logo } from "./logo.js";
import { Link } from "react-router-dom";
import { MenuImgContainer, MenuImg, MenuOptions } from "./menu.js";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../utils/contexts.js";


const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ isMenuOpen }) => (isMenuOpen ? '10px 30px 15px 30px' : '10px 30px')};
  transition: padding 0.3s ease-in-out;
`;

const Text = styled.div`
  font-size: 50%;
  position: relative;
  overflow: hidden;
  &:hover {
    &:before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      border-bottom: 1px solid #000; // 你想要的底线颜色
      transform: scaleX(0);
      transform-origin: bottom right;
      transition: transform 0.3s ease; 
    }
  }
`;

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleTextChange =() =>{
    setIsMenuOpen(!isMenuOpen);  
  }

  useEffect(() => {
  }, [isMenuOpen]);

  return (
    <>
    <HeaderContainer isMenuOpen={isMenuOpen}>
      <MenuImgContainer onClick={toggleMenu}>
        <MenuImg src={isMenuOpen ? './images/close.png' : '/images/stats.svg'} alt='Menu' />
      </MenuImgContainer>
      <Link to="/"><Logo src="/images/petto-logo.png" alt="logo" /></Link>
      {user ? (
        <Link to="/members/adoption-list">
          <img src="/images/member.png" alt="member" style={{ maxWidth: '30px', height: 'auto' }}/>
        </Link>
      ) : (
        <Link to="/users/login">
          <img src="/images/member.png" alt="member" style={{ maxWidth: '30px', height: 'auto' }}/>
        </Link>
      )}
    </HeaderContainer>
    <MenuOptions isMenuOpen={isMenuOpen}>
        <Text>走失協尋</Text>
        <Link to="/pets/create" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleTextChange}>
        <Text >我要送養</Text>
        </Link>
        <Link to="/pets/gps" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleTextChange}>
        <Text>GPS找緣分</Text>
        </Link>
        <Link to="/members/match-application" style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleTextChange}>
        <Text>申請配對通知</Text>
        </Link>
      </MenuOptions>
      </>
  );
}
