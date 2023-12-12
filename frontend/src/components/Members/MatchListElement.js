import styled from "styled-components";
import { useContext } from 'react';
import { AuthContext } from '../../utils/contexts.js';
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;


const CardContainer = styled.div`
  display: flex;
  background-color: #ffffff;
  border-radius: 20px;
  margin:10px 0;
  gap:5px;
  background-color: #f4f3ee;
`;
const ImageContainer = styled.div`
    width: 50px;
    height: 50px;
    max-width: 10;
    max-height: 10;
    padding: 5px;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    
`;
const Image = styled.img`
  justify-content: flex-start;
  max-width: 100%;
  max-height: 100%;
  background-color: #000;
  object-fit: cover;
  border-radius: 50%;
  border:none;

`;
const TextArea = styled.div`
    position: relative;
    display: flex;
    justify-content: space-around;
`;
const Name = styled.text`
    position: absolute;
    border-radius:5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
    width: fit-content;
    white-space: nowrap;
    padding: 3px;
    left:-30px;
    bottom: 5px;
    font-size: 8px;
    font-weight: "bold";
    color:"#463f3a";
    background-color: #f3de2c;
`;
const MessageContainer = styled.div`
    display: flex;
    width: 100%;
    align-items: center;
 justify-content: space-around;
`;
const MessageCard = styled.div`
   display: flex;
    width: 40px;
    height: 40px;
    max-width: 100%;
    max-height: 100%;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.5);
    justify-content: center;
    align-items:center;
`;
const MessageImg = styled.img`
    width: 30px;
    height: auto;
    opacity: ${props => props.isTransparent ? '0.3' : '1'};

`;

const ligationImg = "/images/surgery.png";
const IsLigated = "/images/isligation.png";
const Isbugfree = "/images/isbugfree.png";
const Isvaccine = "/images/isvaccine.png"
const bugImg = "/images/tick.png";
const vaccineImg = "/images/vaccinated.png";
const unvaccinatedImg = "/images/syringe.png";
const likeImg = "/images/like.png";
const AdoptionListElement = () => {
    const { user } = useContext(AuthContext);
    const [matchResults, setMatchResults] = useState([]);
    useEffect(() => {
        
        const fetchMatchResults = async () => {
          try {
            const response = await axios.get(`${REACT_APP_BASE_URL}/matches/matchSuccess?id=${user}`);
            setMatchResults(response.data); 
          } catch (error) {
            console.error('Error fetching match results:', error);
          }
        };
        if(user){
            fetchMatchResults();
        }
        
      }, []);
        
  return (
    
    <div>
    {matchResults &&
    matchResults.map((match) => (
      <CardContainer key={match.petData.id}>
      <Link to={`/pets/details/${match.petData.id}`}>
        <ImageContainer>
          <Image src={match.petData.main_image} alt="pet-image"/>
        </ImageContainer>
        </Link>
        <TextArea>
            <Name>{match.petData.name}</Name>
        </TextArea>
        <MessageContainer>
            <MessageCard>
                <MessageImg src={match.petData.ligation=="1"? IsLigated : ligationImg} isTransparent={!(match.petData.ligation=="1")} />
            </MessageCard>
            <MessageCard>
                <MessageImg src={match.petData.anthel=="1"? Isbugfree : bugImg} isTransparent={!(match.petData.anthel=="1")} />
            </MessageCard>
            <MessageCard>
                <MessageImg src={match.petData.vaccine=="1"? Isvaccine : unvaccinatedImg} isTransparent={!(match.petData.vaccine=="1")} />
            </MessageCard>
            <MessageCard>
                <MessageImg src={likeImg} />
            </MessageCard>
        </MessageContainer>
      </CardContainer>
    ))}
    </div>
  );
};

export default () => <AdoptionListElement />;
