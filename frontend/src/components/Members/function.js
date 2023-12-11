
import styled from "styled-components";

export const RightGroup = styled.div`
  width: 100%;
  height: 100%; 
  justify-content: center;
  align-items: center;
  margin: auto 0px;
  border-radius:20px;
  background-color: #FFFFFF;
`;

// AdoptionList, LostAndFound, ReportRescue, MatchList, FollowPets

const Card = styled.div`
    width: 80%;
    background-color: #FFFFFF;
    border-radius: 10px;
    display: flex;
    
`;
const Image = styled.img`
    justify-content: flex-start;
`
const TextArea = styled.div`
`


export const Match = () =>{
    return(
        <Card>
        <Image />
        <TextArea>
            fdsfsdf
        </TextArea>
        </Card>
    )
};



