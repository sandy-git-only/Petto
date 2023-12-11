import LinearProgress from "../components/Global/linearProgress.js";
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
  SubTitle,
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
  Breed,
} from "../components/PetsDetails/titleInfo.js";
import {
  AdoptBlock,
  AdoptButton,
  ContactPerson,
  MapFrame,
} from "../components/PetsDetails/adopt.js";
import {
  FormContainer,
  FormGroup,
  Label,
  SelectGroup,
} from "../components/PetsDetails/form.js";
import { Image, Input, Select, Checkbox } from "antd";
import { useParams, useLocation } from "react-router-dom";
import { Radio } from "antd";
const femaleImg = "/images/girl.png";
const maleImg = "/images/boy.png";
const vaccineImg = "/images/vaccine.png";
const featureImg = "/images/pet-care.png";
const descriptionImg = "/images/description.png";
const userImg = "/images/user.png";
const shelterImg = "/images/shelter.png";
export function PetDetail() {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fromGovData = queryParams.get("from") === "shelter";
  const [govData, setGovData] = useState([]);
  const [isLoadingGovData, setIsLoadingGovData] = useState(true);
  const [gender, setGender] = useState(1);
  const [petData, setPetData] = useState({});
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



  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  if (isLoading) {
    return <LinearProgress />;
  }

  if (isError) {
    return <p>Error fetching product data</p>;
  }

  const Form = () => {
    const handleSubmit = (e) => {
      e.preventDefault();
    };

    return (
      <FormContainer onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">姓名 Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            required
            style={{ width: "100%" }}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="email">電子郵件 Email / LineID</Label>
          <Input
            type="email"
            id="email"
            name="email"
            required
            style={{ width: "100%" }}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="city">居住地 Address</Label>
          <Select id="city" name="city" style={{ width: "50%" }}>
            <option value="taipei">台北</option>
            <option value="tainan">台南</option>
            <option value="taichung">台中</option>
          </Select>
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
            <Checkbox style={{ fontSize: "50%" }}>
              認養不棄養，不離不棄
            </Checkbox>
          </SelectGroup>
        </FormGroup>
        <AdoptBlock>
          <AdoptButton type="submit">Adopt!</AdoptButton>
        </AdoptBlock>
      </FormContainer>
    );
  };
  const REACT_APP_MAPS_API_KEY = process.env.REACT_APP_MAPS_API_KEY;
  return !fromGovData ? (
    <PageDiv>
      <Image style={{ borderRadius: "10px" }} src={petData.main_image} />
      <TitleBlock>
        <SubTitleBlock>
          <Name>{petData.name}</Name>
          <GenderImage src={pet.gender === "male" ? maleImg : femaleImg} />
        </SubTitleBlock>
      </TitleBlock>
      <TitleBlock>
        <CardContainer>
          <Card style={{ backgroundColor: "#dad7cd" }}>
            <SubTitleInfo>{petData.age} y/o</SubTitleInfo>
            <SubInfo>Age</SubInfo>
          </Card>
          <Card style={{ backgroundColor: "#fefae0" }}>
            <SubTitleInfo
              style={{ fontSize: petData.type.length >= 3 ? "60%" : "80%" }}
            >
              {petData.type}
            </SubTitleInfo>
            <SubInfo
              style={{ marginTop: petData.type.length >= 3 ? "3px" : "60%" }}
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
          <Text>疫苗   {petData.vaccine === "1" ? "Yes" : "No"}</Text>
        </TextContainer>
        <TextContainer>
          <img
            src={featureImg}
            alt="feature"
            style={{ width: "20px", height: "20px" }}
          />
          <Text>個性   {petData.feature === null ? "等你發掘" : petData.feature}</Text>
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
      <Form />
      <Divider />
    </PageDiv>
  ) : (
    <PageDiv>
      <Image style={{ borderRadius: "10px" }} src={petData.album_file} />
      <TitleBlock>
        <SubTitleBlock>
          <Name>{petData.animal_kind === "狗" ? "Dog" : "Cat"} </Name>
          <GenderImage src={petData.animal_sex === "M" ? maleImg : femaleImg} />
          
        </SubTitleBlock>
        <Text style={{marginTop:"30px", color:"gray"}}> ( 等一個好名字 )</Text>
      </TitleBlock>
      <TitleBlock>
        <CardContainer>
          <Card style={{ backgroundColor: "#dad7cd" }}>
            <SubTitleInfo>{petData.animal_age}</SubTitleInfo>
            <SubInfo>Age</SubInfo>
          </Card>
          <Card style={{ backgroundColor: "#fefae0" }}>
            <SubTitleInfo
              style={{ fontSize: petData.animal_Variety.length >= 3 ? "60%" : "80%" }}
            >
              {petData.animal_Variety}
            </SubTitleInfo>
            <SubInfo
              style={{ marginTop: petData.animal_Variety.length >= 3 ? "3px" : "60%" }}
            >
              品種
            </SubInfo>
          </Card>
          <Card style={{ backgroundColor: "#FFFFFF" }}>
            <SubTitleInfo>{petData.shelter_address.substring(0,3)}</SubTitleInfo>
            <SubInfo>地區</SubInfo>
          </Card>
          <Card style={{ backgroundColor: "#fefae0" }}>
            <SubTitleInfo
              style={{ color: petData.sterilization === "T" ? "#414833" : "gray" }}
            >
              {petData.sterilization === "T" ? "Yes" : "No"}
            </SubTitleInfo>
            <SubInfo>絕育</SubInfo>
          </Card>
          <Card style={{ backgroundColor: "#dad7cd" }}>
            <SubTitleInfo
              style={{ color:"gray" }}
            >
              未知
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
        <Text>
         收容所電話 {petData.shelter_tel}
        </Text>
      </AboutContainer>
      <TitleBlock
        style={{ fontSize: "15px", fontWeight: "bold", marginTop: "5px" }}
      >
        Where you can adopt me
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
