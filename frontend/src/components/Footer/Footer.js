import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useIsSmallScreen } from '../../hooks/useIsSmallScreen.js';
import { RxSlash } from "react-icons/rx";

const FooterContainer = styled.div`
  background-color: #E3DFDF;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  width: 100%;

  @media (max-width:1279px){
    flex-direction: column;
    padding:10px 0;
    }
`;


const InnerContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;




export const  Footer = () => {
  
    return (
      <FooterContainer>
          <InnerContainer>
          <RxSlash color='676574' fontSize="15px"/>
          <RxSlash color='676574' fontSize="15px"/>
        </InnerContainer>
      </FooterContainer>
    );
  }
