import { Card } from "../components/PetsList/card.js";
import { PetMainImg } from "../components/PetsList/petMainImg.js";
import { Text } from "../components/PetsList/text.js";
import LinearProgress from "../components/Global/linearProgress.js";
import { useQuery, useInfiniteQuery } from "react-query";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import CircularIndeterminate from "../components/Global/loading.js";
import {
  OptionsSelection,
  customStylesForClass,
  customStyles,
  ButtonContainer,
  SearchButtonContainer,
  ImgInButton,
} from "../components/PetsList/selectButton.js";
import {
  PageDiv,
  IconContainer,
  CardContainer,
  PetContainer,
  InfoContainer,
  AllInfoContainer,
  OptionContainer,
} from "../components/PetsList/containers.js";
import { Link } from "react-router-dom";
const femaleImg = "/images/girl.png";
const maleImg = "/images/boy.png";
const ImageDefault = "images/image-default.png";
export const DogButton = ({ onClick, clicked }) => {
  return (
    <ButtonContainer onClick={onClick} clicked={clicked}>
      <ImgInButton src="/images/dog.png" />
      <div style={{ fontWeight: "bold" }}>Dog</div>
    </ButtonContainer>
  );
};

export const CatButton = ({ onClick, clicked }) => {
  return (
    <ButtonContainer onClick={onClick} clicked={clicked}>
      <ImgInButton src="/images/cat.png" />
      <div style={{ fontWeight: "bold" }}>Cat</div>
    </ButtonContainer>
  );
};

export const SearchButton = ({ onClick, clicked }) => {
  return (
    <SearchButtonContainer onClick={onClick} clicked={clicked}>
      <div style={{ fontSize: "0.6rem" }}>Search</div>
    </SearchButtonContainer>
  );
};

export function ClassOptionsSelection({ options, optionName, onSelect }) {
  const [selectedClass, setSelectedClass] = useState("收容所");
  const navigate = useNavigate();
  const handleOptionChange = (selected) => {
    setSelectedClass(selected);
    onSelect(selected.value);
    if (selected.value === "個人送養") {
      navigate("/");
    }
  };
  return (
    <Select
      value={selectedClass}
      onChange={handleOptionChange}
      options={options.map((option) => ({ label: option, value: option }))}
      placeholder={optionName}
      styles={customStylesForClass}
    />
  );
}

const Selection = ({
  selectedPetType,
  setSelectedLocation,
  setSelectedPetType,
  setClicked,
  clicked,
}) => {
  const [selectedClass, setSelectedClass] = useState("收容所");
  const [breedOptions, setBreedOptions] = useState([]);

  const handlePetTypeChange = (newPetType) => {
    setSelectedPetType(newPetType);
    setClicked(true);
  };

  const classOption = ["個人送養", "收容所"];

  const locationOptions = [
    "不限區域",
    "基隆市",
    "臺北市",
    "新北市",
    "桃園市",
    "臺中市",
    "新竹縣",
    "新竹市",
    "苗栗縣",
    "南投縣",
    "彰化縣",
    "雲林縣",
    "嘉義縣",
    "嘉義市",
    "臺南市",
    "高雄市",
    "屏東縣",
    "宜蘭縣",
    "花蓮縣",
    "臺東縣",
    "澎湖縣",
    "金門縣",
    "連江縣",
  ];

  return (
    <>
      <IconContainer>
        <ClassOptionsSelection
          options={classOption}
          optionName={"收容所"}
          onSelect={(option) => setSelectedClass(option)}
        />
        <div>
          <OptionContainer>
            <DogButton
              key="dog"
              onClick={() => handlePetTypeChange("dog")}
              clicked={clicked && selectedPetType === "dog"}
            />
            <CatButton
              key="cat"
              onClick={() => handlePetTypeChange("cat")}
              clicked={clicked && selectedPetType === "cat"}
            />
          </OptionContainer>
          {/* {selectedPetType && (
            <>
              <Select
                styles={customStyles}
                options={breedOptions}
                onChange={(breed) => setBreed(breed.value)}
              />
            </>
          )} */}
        </div>
        <OptionsSelection
          options={locationOptions}
          optionName={"區域"}
          onSelect={(location) => setSelectedLocation(location)}
        />
      </IconContainer>
    </>
  );
};

export function HomeShelter() {
  const [breed, setBreed] = useState("");
  const [selectedPetType, setSelectedPetType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isFetchingGovDataNextPage, setIsFetchingGovDataNextPage] =
    useState(false);
  const [clicked, setClicked] = useState(false);

  const useCategorizedPets = ({ breed, location, petType }) => {
    const govQueryKey = ["categorizedPets", { breed, location, petType }];

    return useInfiniteQuery(
      govQueryKey,
      async ({ pageParam = 0 }) => {
        let apiUrl = `${process.env.REACT_APP_PETS_LIST_API_URL}/shelters/`;

        if (breed || location || petType) {
          apiUrl += `conditions/`;
          if (breed) apiUrl += `&type=${encodeURIComponent(breed)}`;
          if (location && location !== "不限區域")
            apiUrl += `&city=${encodeURIComponent(location)}`;
          if (petType && petType !== "不限種類")
            apiUrl += `&animalClass=${encodeURIComponent(petType)}`;
          console.log("apiUrl", apiUrl);
        } else {
          apiUrl += `all?paging=${pageParam}`;
        }

        const response = await axios(apiUrl);
        return response.data;
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.next_paging ? lastPage.next_paging : null;
        },
      }
    );
  };

  const {
    data: categorizedPets,
    isLoading: isCategorizedLoading,
    isError: isCategorizedError,
    fetchNextPage: fetchNextCategorizedPage,
    hasNextPage: hasCategorizedNextPage,
  } = useCategorizedPets({
    breed,
    location: selectedLocation,
    petType: selectedPetType,
  });

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.innerHeight + window.scrollY;
    const threshold = 150;

    if (
      scrollTop >= scrollHeight - threshold &&
      hasCategorizedNextPage &&
      !isCategorizedLoading
    ) {
      setIsFetchingGovDataNextPage(true);
      fetchNextCategorizedPage()
        .then(() => {
          fetchNextCategorizedPage();
          setIsFetchingGovDataNextPage(false);
        })
        .catch(() => {
          setIsFetchingGovDataNextPage(false);
        });
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  if (isCategorizedLoading) {
    return <LinearProgress />;
  }

  if (isCategorizedError) {
    return <p>Error fetching data</p>;
  }

  const allGovPetsData = categorizedPets
    ? categorizedPets.pages.map((page) => page)
    : [];
  return (
    <>
      <Selection
        setBreed={setBreed}
        setSelectedLocation={setSelectedLocation}
        setSelectedPetType={setSelectedPetType}
        breed={breed}
        selectedLocation={selectedLocation}
        selectedPetType={selectedPetType}
        clicked={clicked}
        setClicked={setClicked}
      />
      <PageDiv>
        {allGovPetsData.map((petsData) =>
          petsData.data.map((pet) => (
            <PetContainer>
              <Link to={`/pets/details/${pet.id}?from=shelter`}>
                <CardContainer>
                  <Card key={pet.id}>
                    <PetMainImg
                      src={pet.main_image || ImageDefault}
                      alt="pet image"
                    />
                  </Card>
                  <AllInfoContainer>
                    <InfoContainer>
                      <Text style={{ fontSize: "14px", fontWeight: "bold" }}>
                        {pet.type}
                      </Text>
                      <Text style={{ fontSize: "10px", color: "#C3C3C3" }}>
                        {pet.location}
                      </Text>
                    </InfoContainer>
                    <InfoContainer
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={pet.gender === "male" ? maleImg : femaleImg}
                        style={{ width: "20px" }}
                      />
                    </InfoContainer>
                  </AllInfoContainer>
                </CardContainer>
              </Link>
            </PetContainer>
          ))
        )}
        {hasCategorizedNextPage ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <CircularIndeterminate />
          </div>
        ) : (
          <></>
        )}
      </PageDiv>
    </>
  );
}
