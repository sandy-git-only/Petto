import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  GoogleMap,
  InfoWindow,
  MarkerF,
  useLoadScript,
  LoadScript,
  InfoWindowF,
} from "@react-google-maps/api";
// import { GoogleMap, MarkerF, LoadScript } from "@react-google-maps/api";
import LinearProgress from "../components/Global/linearProgress.js";
import Swal from "sweetalert2";
import styled from "styled-components";
import { Link } from "react-router-dom";
const PageDiv = styled.div`
  display: flex;
  flex-direction: column;
  /* justify-content: space-around; */
  align-items: center;
  /* height: 100vh; */
  /* padding: 10px; */
`;
const containerStyle = {
  width: "100%",
  height: "500px",
};

const CardContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  overflow-x: auto;
  width: 100%;
  white-space: nowrap;
  background-color: #ebebeb;
  padding: 10px 10px;
`;
const Card = styled.div`
  display: flex;
  flex-shrink: 0;
  justify-content: space-around;
  gap: 10px;
  background-color: #f6f4f3;
  padding: 10px;
  box-sizing: border-box;
  background-color: #ffffff;
  border-radius: 20px;
  margin: 0 6px 0 5px;
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
  background-color: black;
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  border-radius: 20px;
`;
const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;
const Label = styled.label`
  font-size: 70%;
`;
const InfoTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 2px;
`;

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL

const locationImg = "/images/location.png";
const LostImg = "/images/lost.png";
const AdoptSmall = "/images/pet-adopt.png";
const ForAdoptionImg = "/images/pets-marker.png";
const FoundImg = "/images/search.png";
const geoJsonFilePath = `${REACT_APP_BASE_URL}/geojson`;
const location = await axios.get(`${REACT_APP_BASE_URL}/gps`);
const response = await axios.get(geoJsonFilePath);
const geojsonData = response.data;
// Extract coordinates from GeoJSON features
const markers = await geojsonData.features.map((feature) => ({
  id: feature.properties.id,
  name: feature.properties.name,
  img: feature.properties.img,
  category: feature.properties.category,
  city: feature.properties.city,
  district: feature.properties.district,
  position: {
    lat: feature.geometry.coordinates[1],
    lng: feature.geometry.coordinates[0],
  },
}));

function GoogleMapBlock({
  closedPets,
  setClosedPets,
  onLoad,
  activeMarker,
  setActiveMarker,
}) {
  const [libraries] = useState(["geometry"]);
  const { isLoaded } = useLoadScript({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GPS_API_KEY,
    libraries,
  });

  const [map, setMap] = React.useState(null);
  const [userCenter, setUserCenter] = useState("");

  //User's location
  useEffect(() => {

    

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const initialUserCenter = {
          lat: parseFloat(position.coords.latitude),
          lng: parseFloat(position.coords.longitude),
        };

        setUserCenter(initialUserCenter);
      },
      // Ask for tracking user's location
      () => {
        Swal.fire({
          position: "middle",
          text: "允許存取使用者位置來使用此功能",
          icon: "warning",
          showCloseButton: true,
          showConfirmButton: false,
        });
      }
    );
  }, []);

  const handleActiveMarker = (marker) => {
    // if (marker === activeMarker) {
    //   return;
    // }
    setActiveMarker(marker);
  };

  let availablePets = [];
  const handleOnLoad = (map) => {
    const bounds = new window.google.maps.LatLngBounds();
    markers.forEach((marker) => {
      bounds.extend(marker.position);
    });

    map.fitBounds(bounds);
    markers.forEach((marker) => {
      const distanceResult =
        window.google.maps.geometry.spherical.computeDistanceBetween(
          userCenter,
          marker.position
        );
      if (distanceResult < 50000) {
        availablePets.push({ marker: marker, distance: distanceResult });
        availablePets.sort((a, b) => a.distance - b.distance);
        setClosedPets([...availablePets]);
        // setClosedPets(availablePets);
      }
    });
    // setClosedPets(availablePets);
    onLoad(availablePets);
  };
  //Click pets and show information about
  return isLoaded && userCenter && location && geojsonData ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={userCenter}
      zoom={12}
      onLoad={handleOnLoad}
      // onUnmount={onUnmount}
    >
      <div>
        {markers.map((marker) => (
          <MarkerF
            key={marker.id}
            position={marker.position}
            options={{
              icon: {
                url: marker.category === "送養" ? ForAdoptionImg :marker.category === "走失" ? LostImg : FoundImg,
                scaledSize: new window.google.maps.Size(40, 40),
              },
            }}
            onClick={() => handleActiveMarker(marker.id)}
          >
            {activeMarker === marker.id ? (
              <InfoWindowF onCloseClick={() => setActiveMarker(null)}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Link to={`/pets/details/${marker.id}`}>
                    <img
                      src={marker.img}
                      alt="marker-petimg"
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  </Link>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "2px",
                      }}
                    >
                      <img
                        src={marker.category == "送養" ? AdoptSmall : marker.category === "走失"? LostImg: FoundImg}
                        alt="adopt-small"
                        style={{ width: "20px", height: "20px" }}
                      />
                      <p
                        style={{
                          color:
                            marker.category == "送養" ? "#0d3b66" : "ff0000",
                          fontWeight: "bold",
                        }}
                      >
                        {marker.name}
                      </p>
                    </div>
                    <p
                      style={{
                        fontSize: "10px",
                        marginTop: "-5px",
                        paddingLeft: "5px",
                      }}
                    >
                      {marker.city}
                      {marker.district}
                    </p>
                  </div>
                </div>
              </InfoWindowF>
            ) : null}
          </MarkerF>
        ))}
      </div>
    </GoogleMap>
  ) : (
    <></>
  );
}

const CardBlock = ({ closedPets, setActiveMarker }) => {
  const handleCardClick = (markerId) => {
    setActiveMarker(markerId);
  };
  console.log(closedPets);
  return (
    <CardContainer>
      {closedPets.map((pet) => (
        <Card key={pet.marker.id}>
          <Image
            src={pet.marker.img}
            alt="Pet_img_inCard"
            onClick={() => handleCardClick(pet.marker.id)}
          />
          <InfoContainer>
            <InfoTitle>
              <img
                src={pet.marker.category == "走失" ? LostImg : pet.marker.category === "送養" ? AdoptSmall : FoundImg }
                alt="marker-img"
                style={{ width: "20px", margin: "auto opx" }}
              />
              <Label style={{ fontWeight: "bold", color: "#333533" }}>
                {pet.marker.category}
              </Label>
            </InfoTitle>
            <Label style={{ fontSize: "80%", fontFamily: "Roboto" }}>
              {pet.marker.name}
            </Label>
            <InfoTitle>
              <img
                src={locationImg}
                alt="location-img"
                style={{ width: "15px", margin: "auto opx" }}
              />
              <Label style={{ fontSize: "60%", color: "gray" }}>
                {parseFloat(pet.distance / 1000).toFixed(2)} km
              </Label>
            </InfoTitle>
          </InfoContainer>
        </Card>
      ))}
    </CardContainer>
  );
};

const GPS = () => {
  const [closedPets, setClosedPets] = useState([]);
  const [isMapLoaded, setMapLoaded] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const handleMapLoad = (closedPetsData) => {
    setClosedPets(closedPetsData);
    setMapLoaded(true);
  };
  return (
    <PageDiv>
      {isMapLoaded ? (
        <>
          <CardBlock
            closedPets={closedPets}
            setActiveMarker={setActiveMarker}
          />
          <GoogleMapBlock
            setClosedPets={setClosedPets}
            onLoad={handleMapLoad}
            setActiveMarker={setActiveMarker}
            activeMarker={activeMarker}
          />
        </>
      ) : (
        <GoogleMapBlock
          setClosedPets={setClosedPets}
          onLoad={handleMapLoad}
          setActiveMarker={setActiveMarker}
          activeMarker={activeMarker}
        />
      )}
    </PageDiv>
  );
};

export default GPS;
