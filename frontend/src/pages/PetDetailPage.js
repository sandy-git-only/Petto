import LoadingOverlay from "../components/Global/progress.js";
import { useQuery } from "react-query";
import { useState } from "react";
import axios from "axios";
import {
  PageDiv,
  Divider,
  GenderImage,
  AboutContainer,
} from "../components/PetsDetails/containers.js";
import {
  SubTitleBlock,
  SubTitleInfo,
  CardContainer,
  Card,
  SubInfo,
  Text,
  TextContainer,
} from "../components/PetsDetails/subtitleInfo.js";
import {
  TitleBlock,
  Name,
} from "../components/PetsDetails/titleInfo.js";
import { MapFrame,} from "../components/PetsDetails/adopt.js";
import {
  FormContainer,
  FormGroup,
  Label,
  SelectGroup,
} from "../components/PetsDetails/form.js";
import Swal from "sweetalert2";
import { Image, Input, Checkbox } from "antd";
import { useParams, useLocation } from "react-router-dom";
import { Radio } from "antd";
import { Modal, Button } from "antd";
const femaleImg = "/images/girl.png";
const maleImg = "/images/boy.png";
const vaccineImg = "/images/vaccine.png";
const featureImg = "/images/pet-care.png";
const descriptionImg = "/images/description.png";
const userImg = "/images/user.png";
const shelterImg = "/images/shelter.png";
const ImageDefault = "/images/image-default.png";


const Form = ({
  handleNameChange,
  handleEmailChange,
  handleContactChange,
  handleQuestionChange,
  handleTimeChange,
  handleGenderChange,
  gender,
  name,
  email,
  contact,
  question,
  time,
}) => {
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  // };
  

  return (
    // <FormContainer onSubmit={handleSubmit}>
    <FormContainer>
      <FormGroup>
        <Label htmlFor="name">姓名 Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          required
          style={{ width: "100%" }}
          onChange={handleNameChange}
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="email">* 聯絡方式: 電子郵件 Email</Label>
        <Input
          type="email"
          id="email"
          name="email"
          required
          style={{ width: "100%" }}
          onChange={handleEmailChange}
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="phone">聯絡方式: LineID / 手機</Label>
        <Input
          id="phone"
          name="phone"
          style={{ width: "100%" }}
          onChange={handleContactChange}
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="question">有什麼想先詢問的嗎? </Label>
        <Input
          id="question"
          name="question"
          style={{ width: "100%", height: "60px" }}
          onChange={handleQuestionChange}
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="time">希望聯絡的時間(早上/下午/晚上/皆可)</Label>
        <Input
          id="time"
          name="time"
          style={{ width: "100%" }}
          onChange={handleTimeChange}
        />
      </FormGroup>
      <FormGroup>
        <Label>性別：</Label>
      </FormGroup>
      <FormGroup style={{ display: "flex" }}>
        <Radio.Group onChange={handleGenderChange} value={gender}>
          <Radio value="boy" style={{ fontSize: "10px" }}>
            男生
          </Radio>
          <Radio value="girl" style={{ fontSize: "10px" }}>
            女生
          </Radio>
          <Radio value="notProvide" style={{ fontSize: "10px" }}>
            不願透露
          </Radio>
        </Radio.Group>
      </FormGroup>

      <FormGroup>
        <Label style={{ color: "brown" }}>* 我願意承諾 *</Label>

        <SelectGroup>
          {/* <Input type="checkbox" id="reading" name="interest" value="reading" /> */}
          <Checkbox style={{ fontSize: "0.5rem" }}>
            認養不棄養，不離不棄
          </Checkbox>
        </SelectGroup>
      </FormGroup>
      {/* <AdoptBlock>
        <AdoptButton type="submit">Adopt!</AdoptButton>
      </AdoptBlock> */}
    </FormContainer>
  );
};




export function PetDetail() {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fromGovData = queryParams.get("from") === "shelter";
  const [govData, setGovData] = useState([]);
  const [isLoadingGovData, setIsLoadingGovData] = useState(true);
  const [petData, setPetData] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [gender, setGender] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [question, setQuestion] = useState("");
  const [time, setTime] = useState("");

    const handleGenderChange = (e) => {
      setGender(e.target.value);
    };
    const handleNameChange = (e) => {
      setName(e.target.value);
    };
    const handleEmailChange = (e) => {
      setEmail(e.target.value);
    };
    const handleContactChange = (e) => {
      setContact(e.target.value);
    };
    const handleQuestionChange = (e) => {
      setQuestion(e.target.value);
    };
    const handleTimeChange = (e) => {
      setTime(e.target.value);
    };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const data = {
    name: name,
    email: email,
    question: question,
    contact: contact,
    time: time,
    gender: gender,
    recipient: petData.email
  };
  const handleOk = () => {
    axios.post(`${process.env.REACT_APP_BASE_URL}/matches/send-adoption`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Send to the poster successfully", response.data);
        Swal.fire({
          icon: "success",
          title: "成功送出！",
          timer: 1500,
        });
        setIsModalVisible(false);
      })
      .catch((error) => {
        console.error("Fail to send to the poster", error);
      });
  };

  const govPetsAPI =
    "https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL";

  const databaseQueryKey = ["details", id];
  const govApiQueryKey = ["govDataDetails", id];

  const {
    data: pet,
    isLoading,
    isError,
  } = useQuery(fromGovData ? govApiQueryKey : databaseQueryKey, async () => {
    try {
      if (fromGovData) {
        const response = await axios(govPetsAPI);
        setGovData(response.data);
        setIsLoadingGovData(false);
        const petData =
          response.data.find((govPet) => govPet.animal_id == id) || {};
        setPetData(petData);
        return petData;
      } else {
        const response = await axios(
          `${process.env.REACT_APP_PETS_LIST_API_URL}/details?id=${id}`
        );
        const petData = response.data.data;
        setPetData(petData);
        return petData;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoadingGovData(false);
      throw error;
    }
  });
 
  

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (isError) {
    return <p>Error fetching product data</p>;
  }
  
  const REACT_APP_MAPS_API_KEY = process.env.REACT_APP_MAPS_API_KEY;
  return !fromGovData && petData.type.length ? (
    <PageDiv>
      <Image
        style={{ borderRadius: "10px" }}
        src={petData.main_image || ImageDefault}
      />
      <TitleBlock>
        <SubTitleBlock>
          <Name>{petData.name}</Name>
          <GenderImage src={pet.gender === "male" ? maleImg : femaleImg} />
        </SubTitleBlock>
      </TitleBlock>
      <TitleBlock>
        <CardContainer>
          <Card style={{ backgroundColor: "#dad7cd" }}>
            <SubTitleInfo>{petData.age} Y</SubTitleInfo>
            <SubInfo>Age</SubInfo>
          </Card>
          <Card style={{ backgroundColor: "#fefae0" }}>
            <SubTitleInfo
              style={{ fontSize: petData.type.length >= 3 ? "60%" : "80%" }}
            >
              {petData.type}
            </SubTitleInfo>
            <SubInfo
              style={{ marginTop: petData.type.length >= 3 ? "3px" : "" }}
            >
              品種
            </SubInfo>
          </Card>
          <Card style={{ backgroundColor: "#FFFFFF" }}>
            <SubTitleInfo>{petData.city}</SubTitleInfo>
            <SubInfo>地區</SubInfo>
          </Card>
          <Card style={{ backgroundColor: "#fefae0" }}>
            <SubTitleInfo
              style={{ color: petData.ligation === "1" ? "#414833" : "gray" }}
            >
              {petData.ligation === "1" ? "Yes" : "No"}
            </SubTitleInfo>
            <SubInfo>絕育</SubInfo>
          </Card>
          <Card style={{ backgroundColor: "#dad7cd" }}>
            <SubTitleInfo
              style={{ color: petData.anthel === "1" ? "#414833" : "gray" }}
            >
              {petData.anthel === "1" ? "Yes" : "No"}
            </SubTitleInfo>
            <SubInfo>驅蟲</SubInfo>
          </Card>
        </CardContainer>
      </TitleBlock>
      <TitleBlock
        style={{ fontSize: "15px", fontWeight: "bold", marginTop: "5px" }}
      >
        About me
      </TitleBlock>
      <AboutContainer>
        <TextContainer>
          <img
            src={userImg}
            alt="user"
            style={{ width: "20px", height: "20px" }}
          />
          <Text>個人中途</Text>
        </TextContainer>
        <TextContainer></TextContainer>
        <TextContainer>
          <img
            src={vaccineImg}
            alt="vaccine"
            style={{ width: "20px", height: "20px" }}
          />
          <Text>疫苗 {petData.vaccine === "1" ? "Yes" : "No"}</Text>
        </TextContainer>
        <TextContainer>
          <img
            src={featureImg}
            alt="feature"
            style={{ width: "20px", height: "20px" }}
          />
          <Text>
            個性 {petData.feature === null ? "等你發掘" : petData.feature}
          </Text>
        </TextContainer>
        <Divider />
        <img
          src={descriptionImg}
          alt="description"
          style={{ width: "20px", height: "20px" }}
        />
        <Text>
          {petData.description === null
            ? "可以直接私訊送養人更多細節喔"
            : petData.description}
        </Text>
      </AboutContainer>
      <TitleBlock
        style={{ fontSize: "15px", fontWeight: "bold", marginTop: "5px" }}
      >
        Where is {petData.name}
      </TitleBlock>
      <MapFrame
        src={`https://www.google.com/maps/embed/v1/place?key=${REACT_APP_MAPS_API_KEY}&q=${petData.location}`}
        allowfullscreen
        title="Google Maps"
      />
      <Divider />
      <text style={{ color: "#8d0801", fontSize: "0.8rem" }}>
        填寫表單，聯絡送養人
      </text>
      <Button
        style={{ backgroundColor: "#f26419" }}
        type="primary"
        onClick={showModal}
      >
        我想領養
      </Button>

      {/* Modal with your form */}
      <Modal visible={isModalVisible} onCancel={handleCancel} onOk={handleOk}>
        <Form 
        closeModal={handleCancel} 
        handleNameChange={handleNameChange}
          handleEmailChange={handleEmailChange}
          handleContactChange={handleContactChange}
          handleQuestionChange={handleQuestionChange}
          handleTimeChange={handleTimeChange}
          handleGenderChange={handleGenderChange}
          gender={gender}
          name={name}
          email={email}
          contact={contact}
          question={question}
          time={time}
        />
      </Modal>
      <Divider />
    </PageDiv>
  ) : (
    <PageDiv>
      <Image
        style={{ borderRadius: "10px" }}
        src={
          petData.album_file !== undefined ? petData.album_file : ImageDefault
        }
      />
      <TitleBlock>
        <SubTitleBlock>
          <Name>{petData.animal_kind === "狗" ? "Dog" : "Cat"} </Name>
          <GenderImage src={petData.animal_sex === "M" ? maleImg : femaleImg} />
        </SubTitleBlock>
        <Text style={{ marginTop: "30px", color: "gray" }}>
          {" "}
          ( 等一個名字 )
        </Text>
      </TitleBlock>
      <TitleBlock>
        <CardContainer>
          <Card style={{ backgroundColor: "#dad7cd" }}>
            <SubTitleInfo>{petData.animal_age}</SubTitleInfo>
            <SubInfo>Age</SubInfo>
          </Card>
          <Card style={{ backgroundColor: "#fefae0" }}>
            <SubTitleInfo
              style={{
                fontSize: petData.animal_Variety.length >= 3 ? "60%" : "80%",
              }}
            >
              {petData.animal_Variety}
            </SubTitleInfo>
            <SubInfo
              style={{
                marginTop: petData.animal_Variety.length >= 3 ? "3px" : "60%",
              }}
            >
              品種
            </SubInfo>
          </Card>
          <Card style={{ backgroundColor: "#FFFFFF" }}>
            <SubTitleInfo>
              {petData.shelter_address.substring(0, 3)}
            </SubTitleInfo>
            <SubInfo>地區</SubInfo>
          </Card>
          <Card style={{ backgroundColor: "#fefae0" }}>
            <SubTitleInfo
              style={{
                color: petData.sterilization === "T" ? "#414833" : "gray",
              }}
            >
              {petData.sterilization === "T" ? "Yes" : "No"}
            </SubTitleInfo>
            <SubInfo>絕育</SubInfo>
          </Card>
          <Card style={{ backgroundColor: "#dad7cd" }}>
            <SubTitleInfo style={{ color: "gray" }}>未知</SubTitleInfo>
            <SubInfo>驅蟲</SubInfo>
          </Card>
        </CardContainer>
      </TitleBlock>
      <TitleBlock
        style={{ fontSize: "15px", fontWeight: "bold", marginTop: "5px" }}
      >
        About me
      </TitleBlock>
      <AboutContainer>
        <TextContainer>
          <img
            src={shelterImg}
            alt="user"
            style={{ width: "20px", height: "20px" }}
          />
          <Text>{petData.shelter_name}</Text>
        </TextContainer>
        <TextContainer></TextContainer>
        <TextContainer>
          <img
            src={vaccineImg}
            alt="vaccine"
            style={{ width: "20px", height: "20px" }}
          />
          <Text>{petData.bacterin === "T" ? "Yes" : "No"}</Text>
        </TextContainer>
        <TextContainer>
          <img
            src={featureImg}
            alt="feature"
            style={{ width: "20px", height: "20px" }}
          />
          <Text>等你發掘</Text>
        </TextContainer>
        <Divider />
        <br />
        <img
          src={descriptionImg}
          alt="description"
          style={{ width: "20px", height: "20px" }}
        />
        <Text>電話 {petData.shelter_tel}</Text>
      </AboutContainer>
      <TitleBlock
        style={{ fontSize: "15px", fontWeight: "bold", marginTop: "5px" }}
      >
        Where You Can Find Me
      </TitleBlock>
      <MapFrame
        src={`https://www.google.com/maps/embed/v1/place?key=${REACT_APP_MAPS_API_KEY}&q=${petData.shelter_address}`}
        allowfullscreen
        title="Google Maps"
      />
      <Divider />
    </PageDiv>
  );
}
