import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useContext } from 'react';
import { AuthContext } from '../../utils/contexts.js';
const FloatingButtonContainer = styled.div`
  position: fixed;
  bottom: 15px;
  right: 15px;
`;

const MainButton = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding:5px;
  cursor: pointer;
  position: relative;
  box-shadow: 0 2px 6px 2px rgba(0, 0, 0, 0.3);
  transition: all 300ms ease;
  transform: ${(props) => (props.active ? 'rotateZ(-45deg)' : 'rotateZ(0)')};
`;

const OptionsContainer = styled.div`
  position: absolute;
  transform: ${(props) => (props.active ? 'translate(-5px, -5px) scale(1)' : 'translate(30px, 30px) scale(0)')};
  opacity: ${(props) => (props.active ? '1' : '0')};
  transition: all 300ms ease;
`;

const Option = styled.div`
  width: 50px;
  height: 50px;
  font-size:85%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
  border-radius: 50%;
  box-shadow: 0 4px 8px -3px rgba(0, 0, 0, 0.3);
  position: absolute;
  cursor: pointer;
  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); 
    transform: scale(1.1);
  }

`;

const OptionLink = styled.a`
  text-decoration: none;
  color: #222;
  user-select: none;
`;

export const FloatingButton = () => {
  const [active, setActive] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const handleDocumentClick = () => {
      setActive(false);
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, []);

  const handleToggle = (e) => {
    e.stopPropagation(); // Prevent document click event from triggering immediately
    setActive(!active);
  };
  
  return (
    <FloatingButtonContainer>
      <MainButton active={active} onClick={handleToggle}>
      <img src="/images/pawprint.png" alt="floating button" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
      </MainButton>
      <OptionsContainer active={active}>
      <Link to="/pets/create">
        <Option style={{ transform: 'translate(10px, -110px)' }}>
          <OptionLink href="#">送養</OptionLink>
        </Option>
        </Link>
        <Link to="/pets/missing">
        <Option style={{ transform: 'translate(-55px, -100px) rotate(-45deg)' }}>
          <OptionLink href="#">走失</OptionLink>
        </Option>
        </Link>
        <Link to="/pets/found">
        <Option style={{ transform: 'translate(-60px, -40px) rotate(-120deg)' }}>
          <OptionLink href="#">通報</OptionLink>
        </Option>
        </Link>
      </OptionsContainer>
    </FloatingButtonContainer>
  );
};


