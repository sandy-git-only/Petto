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
  gap: 5px;
  margin: 10px;
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
  border: none;
  aspect-ratio: 1/1;
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
  align-items: center;
  justify-content: center;
  gap: 10px;
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

const ligationImg = "/images/surgery.png";
const IsLigated = "/images/isligation.png";
const Isbugfree = "/images/isbugfree.png";
const Isvaccine = "/images/isvaccine.png";
const bugImg = "/images/tick.png";
const vaccineImg = "/images/vaccinated.png";
const unvaccinatedImg = "/images/syringe.png";
const AdoptionListElement = () => {
  const { user } = useContext(AuthContext);
  const [matchResults, setMatchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchMatchResults = async () => {
      try {
        const response = await axios.get(
          `${REACT_APP_BASE_URL}/matches/matchSuccess?id=${user}`
        );
        setMatchResults(response.data);
      } catch (error) {
        console.error("Error fetching match results:", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchMatchResults();
      setLoading(true);
    }
  }, []);

  console.log("matchResults", matchResults);
  return (
    <div>
      {loading && <LoadingOverlay />}
      {matchResults &&
        matchResults.map((match) => {
          const data = match.petData || match.shelterPetData;

          return (
            <CardContainer key={data.id}>
              <Link to={`/pets/details/${data.id}`}>
                <ImageContainer>
                  <Image src={data.main_image} alt="pet-image" />
                </ImageContainer>
              </Link>
              <TextArea>
                <Name>{data.name}</Name>
              </TextArea>
              <MessageContainer>
                <MessageCard>
                  <MessageImg
                    src={data.ligation == "1" ? IsLigated : ligationImg}
                    isTransparent={!(data.ligation == "1")}
                  />
                </MessageCard>
                <MessageCard>
                  <MessageImg
                    src={data.anthel == "1" ? Isbugfree : bugImg}
                    isTransparent={!(data.anthel == "1")}
                  />
                </MessageCard>
                <MessageCard>
                  <MessageImg
                    src={data.vaccine == "1" ? Isvaccine : unvaccinatedImg}
                    isTransparent={!(data.vaccine == "1")}
                  />
                </MessageCard>
                <MessageCard>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <text style={{ fontSize: "0.4rem", alignSelf: "center" }}>
                      Age
                    </text>
                    <text
                      style={{
                        fontSize: "0.5rem",
                        alignSelf: "center",
                        fontWeight: "bold",
                        borderBottom: "1px solid orange",
                      }}
                    >
                      {data.age}
                    </text>
                  </div>
                </MessageCard>
                <MessageCard>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <text style={{ fontSize: "0.4rem", alignSelf: "center" }}>
                      {data.city || data.district}
                    </text>
                    <text
                      style={{
                        fontSize: "0.4rem",
                        alignSelf: "center",
                        borderBottom: "1px solid blue",
                      }}
                    >
                      {data.district}
                    </text>
                  </div>
                </MessageCard>
              </MessageContainer>
            </CardContainer>
          );
        })}
    </div>
  );
};

export default () => <AdoptionListElement />;
