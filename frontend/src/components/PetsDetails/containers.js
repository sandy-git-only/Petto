import styled from 'styled-components';


export const PageDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  width: 80%;
  gap:10px;
`;

export const Divider = styled.div`
 border-bottom: 1px solid #E5E5E5;
 display: inline-block;
 width: 90%;
 margin: 10px;
 align-items: flex-start;
`

export const GenderImage = styled.img`
  width:20px;
  height:20px;
  justify-content:flex-start;
  margin-top: 20px;
  margin-left: 5px;
`
export const AboutContainer = styled.div`
  width: 95%;
  background-color: #FFFFFF;
  border-radius: 10px;
  align-items: center;
  padding: 10px 10px;
`