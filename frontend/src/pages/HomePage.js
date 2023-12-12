import { Card } from "../components/PetsList/card.js";
import { PetMainImg } from "../components/PetsList/petMainImg.js";
import { Text } from "../components/PetsList/text.js";
import LinearProgress from "../components/Global/linearProgress.js";
import { useQuery, useInfiniteQuery } from "react-query";
import Select from "react-select";
import { useState, useEffect } from "react";
import axios from "axios";
import CircularIndeterminate from "../components/Global/loading.js"
import {
  OptionsSelection,
  customStyles,
  ButtonContainer,
  ImgInButton,
} from "../components/PetsList/selectButton.js";
import {
  PageDiv,
  IconContainer,
  CardContainer,
  PetContainer,
  InfoContainer,
  AllInfoContainer,
  OptionContainer
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

const Selection = () => {
  const [selectedPetType, setSelectedPetType] = useState("");
  const [breedOptions, setBreedOptions] = useState([]);
  const [clicked, setClicked] = useState(false);
  const handlePetTypeChange = (newPetType) => {
    setSelectedPetType(newPetType);
    setClicked(true);
    setBreedOptions([]);

    // Update breed options based on the selected pet type
    if (newPetType === "dogs") {
      setBreedOptions([
        { value: "1", label: "米克斯 (Mixed)" },
        { value: "2", label: "拉布拉多犬 (Labrador Retriever)" },
        { value: "3", label: "德國牧羊犬 (German Shepherd)" },
        { value: "4", label: "黃金獵犬 (Golden Retriever)" },
        { value: "5", label: "法國鬥牛犬 (French Bulldog)" },
        { value: "6", label: "貴賓 (Poodle)" },
        { value: "7", label: "西斯梗犬 (Shih Tzu)" },
        { value: "8", label: "柴犬 (Shiba Inu)" },
        { value: "9", label: "邊境牧羊犬 (Border Collie)" },
        { value: "other", label: "其他" },
      ]);
    } else if (newPetType === "cats") {
      setBreedOptions([
        { value: "1", label: "波斯貓 (Persian)" },
        { value: "2", label: "馬恩島貓 (Manx)" },
        { value: "3", label: "暹羅貓 (Siamese)" },
        { value: "4", label: "蘇格蘭摺耳貓 (Scottish Fold)" },
        { value: "5", label: "緬因貓 (Maine Coon)" },
        { value: "6", label: "豹貓 (Bengal)" },
        { value: "7", label: "俄羅斯藍貓 (Russian Blue)" },
        { value: "8", label: "埃及毛貓 (Egyptian Mau)" },
        { value: "9", label: "布偶貓 (Ragdoll)" },
      ]);
    } else {
      setBreedOptions([]); // Clear options if no pet type selected
    }
  };
  const locationOptions = ["不限", "台北市", "新北市", "桃園市"];

  return (
    <>
      <IconContainer>
        <div>
        <OptionContainer>
        <DogButton
          key="dog"
          onClick={() => handlePetTypeChange("dogs")}
          clicked={clicked && selectedPetType === "dogs"}
        />
        <CatButton
          key="cat"
          onClick={() => handlePetTypeChange("cats")}
          clicked={clicked && selectedPetType === "cats"}
        />
        </OptionContainer>
        {selectedPetType && (
          <>
            <Select styles={customStyles} options={breedOptions} />
          </>
        )}
        </div>
        <OptionsSelection options={locationOptions} optionName={"區域"} />
      </IconContainer>
    </>
  );
};

export function Home() {
  const queryKey = "pets";

  const {
    data: pets,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    queryKey,
    async ({ pageParam = 0 }) => {
      const response = await axios(
        `${process.env.REACT_APP_PETS_LIST_API_URL}/all?paging=${pageParam}`
      );
      return response.data;
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.next_paging? lastPage.next_paging : null;
      },
    }
  );

  const [govData, setGovData] = useState([]);
  const [isLoadingGovData, setIsLoadingGovData] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [isFetchingGovDataNextPage, setIsFetchingGovDataNextPage] = useState(false);
  const govPetsAPI =
    "https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL";
  

  const govQueryKey = 'govPets';
  const {
    data: govPets,
    isGovDataLoading,
    isGovDataError,
    fetchNextPage:fetchGovDataNextPage,
    hasNextPage: hasGovDataNextPage,
  } = useInfiniteQuery(
    govQueryKey,
    async ({ pageParam = 0 }) => {
      const response = await axios(
        `https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL&$top=20&$skip=${pageParam * 20}`,
      );
      return response.data;
    },
    {
      getNextPageParam: (lastPage,allPages) => {
        if (lastPage && lastPage.length > 0 ) {
          const currentPageSize = lastPage.length;
          return currentPageSize < 20 ? null : allPages.length;
        }
      },
    }
  );

 
  
  // useEffect(() => {
  //   axios(govPetsAPI)
  //     .then((response) => {
  //       setGovData(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching additional data:", error);
  //     })
  //     .finally(() => {
  //       setIsLoadingGovData(false);
  //     });
  // }, []);

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.innerHeight + window.scrollY;
    const threshold = 50; 

    if (scrollTop >= scrollHeight - threshold ) {
      if(hasNextPage && !isLoading){
      setIsFetchingNextPage(true); 
      fetchNextPage()
      .then(() => {
        setIsFetchingNextPage(false); // Reset loading state after fetching
      })
      .then(() => {
        
      })
      .catch(() => {
        setIsFetchingNextPage(false); // Handle errors and reset loading state
      });
    }};

    if (scrollTop >= scrollHeight - threshold && hasGovDataNextPage && !isGovDataLoading) {
      setIsFetchingGovDataNextPage(true);
      fetchGovDataNextPage()
        .then(() => {
          setIsFetchingGovDataNextPage(false);
        })
        .catch(() => {
          setIsFetchingGovDataNextPage(false);
        });
    };
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  if (isLoading || isGovDataLoading) {
    return <LinearProgress />;
  }
  if (isGovDataError) {
    return <p>Error fetching GOV data</p>;
  }

  if (isError) {
    return <p>Error fetching data</p>;
  }
  
  const allGovPetsData = govPets ? govPets.pages.map((page) => page) : [];
  const allPetsData = pets ? pets.pages.map((page) => page.data) : [];
  return (
    <>
      <Selection />
      <PageDiv>
        {allPetsData.map((petsData) =>
        petsData.map((pet) => (
          <PetContainer>
            <Link to={`/pets/details/${pet.id}`}>
              <CardContainer>
                <Card key={pet.id}>
                  <PetMainImg src={pet.main_image || ImageDefault} alt="pet image" />
                </Card>
                <AllInfoContainer>
                  <InfoContainer>
                    <Text style={{ fontSize: "14px", fontWeight: "bold" }}>
                      {pet.name}
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
                      alt="genderimage"
                    />
                  </InfoContainer>
                </AllInfoContainer>
              </CardContainer>
            </Link>
          </PetContainer>
        )))}
        {isFetchingNextPage ? (
          <div>
          <CircularIndeterminate />
          </div>
        ) : <></>}
        {allGovPetsData.map((govData)=>
          govData.map((pet) => (
        <PetContainer>
        <Link to={`/pets/details/${pet.animal_id}?from=shelter`}>
          <CardContainer>
            <Card key={pet.animal_id} >
            <PetMainImg src={pet.album_file || ImageDefault} alt="pet image" />
            </Card>
            <AllInfoContainer>
            <InfoContainer>
              <Text style={{ fontSize: "14px",fontWeight: "bold" }}>{pet.animal_Variety}</Text>
              <Text style={{ fontSize: "10px", color:"#C3C3C3" }}>{pet.shelter_address.substring(0,3)}</Text>
            </InfoContainer>
            <InfoContainer style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <img 
              src={pet.animal_sex==="M"? maleImg : femaleImg} 
              style={{width:"20px"}} />
            </InfoContainer>
            </AllInfoContainer>
          </CardContainer>
          </Link>
        </PetContainer>
      )))}
      {hasGovDataNextPage ? (
        <div>
          <CircularIndeterminate />
        </div>
        ) : <></>}
      </PageDiv>
    </>
  );
}

