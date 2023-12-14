import styled from "styled-components";
import { useContext } from "react";
import { AuthContext } from "../../utils/contexts.js";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import LoadingOverlay from "../Global/progress.js";

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;

const CardContainer = styled.div`
  display: flex;
  background-color: #ffffff;
  border-radius: 15px;
  gap: 10px;
  background-color: #f4f3ee;
  margin: 10px;
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
  width: 50px;
  height: 50px;
  max-width: 100%;
  max-height: 100%;
  background-color: #000;
  object-fit: cover;
  border-radius: 50%;
  border: none;
`;
const TextArea = styled.div`
  position: relative;
  display: flex;
  justify-content: space-around;
`;
const Name = styled.text`
  position: absolute;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: fit-content;
  white-space: nowrap;
  padding: 3px;
  left: -30px;
  bottom: 5px;
  font-size: 8px;
  font-weight: "bold";
  color: "#463f3a";
  background-color: #f3de2c;
`;
const MessageContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding-right: 5px;
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
  align-items: center;
`;
const MessageImg = styled.img`
  width: 30px;
  height: auto;
  opacity: ${(props) => (props.isTransparent ? "0.3" : "1")};
`;
const LostImg = "/images/lost.png";
const AdoptSmall = "/images/pet-care2.png";
const SearchImg = "/images/search.png";
const ligationImg = "/images/surgery.png";
const IsLigated = "/images/isligation.png";
const bugImg = "/images/tick.png";
const Isvaccine = "/images/isvaccine.png";
const unvaccinatedImg = "/images/syringe.png";
const Isbugfree = "/images/isbugfree.png";

const AdoptionListElement = () => {
  const { user } = useContext(AuthContext);
  const [postResults, setPostResults] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPostResults = async () => {
      try {
        const response = await axios.get(
          `${REACT_APP_BASE_URL}/pets/user-post?userID=${user}`
        );
        setPostResults(response.data.data);
      } catch (error) {
        console.error("Error fetching match results:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchPostResults();
    }
  }, []);

  return (
    <div>
    {loading && <LoadingOverlay />}
      {postResults &&
        postResults.map((pet) => (
          <CardContainer key={pet.id}>
            <Link to={`/pets/details/${pet.id}`}>
              <ImageContainer>
                <Image src={pet.main_image} alt="pet-image" />
              </ImageContainer>
            </Link>
            <TextArea>
              <Name>{pet.name}</Name>
            </TextArea>
            <MessageContainer>
              <MessageCard style={{ display: "flex", flexDirection: "column" }}>
                <MessageImg
                  style={{ width: "20px", height: "20px" }}
                  src={
                    pet.category == "送養"
                      ? AdoptSmall
                      : pet.category == "走失"
                      ? LostImg
                      : SearchImg
                  }
                />
                <text style={{ fontSize: "8px", color: "gray" }}>
                  {pet.category == "送養"
                    ? "送養"
                    : pet.category == "走失"
                    ? "走失"
                    : "拾獲"}{" "}
                </text>
              </MessageCard>
              <MessageCard>
                <MessageImg
                  src={pet.ligation == "1"? IsLigated:ligationImg}
                  isTransparent={!(pet.ligation == "1")}
                />
              </MessageCard>
              <MessageCard>
                <MessageImg src={pet.anthel == "1"?Isbugfree:bugImg} isTransparent={!(pet.anthel == "1")} />
              </MessageCard>
              <MessageCard>
                <MessageImg
                  src={pet.vaccine == "1" ? Isvaccine : unvaccinatedImg}
                  isTransparent={!(pet.vaccine == "1")}
                />
              </MessageCard>
            </MessageContainer>
          </CardContainer>
        ))}
    </div>
  );
};

export default () => <AdoptionListElement />;
