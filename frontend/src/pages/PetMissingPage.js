import { PageDiv, Divider } from "../components/PetsCreate/containers.js";
import { React, useState } from "react";
import {
  FormContainer,
  FormGroup,
  CheckboxGroup,
  Label,
  Select,
  TextArea,
  SubmitButton,
} from "../components/PetsCreate/form.js";
import { ImageCrop } from "../components/PetsCreate/getCroppedImg.js";
import { Input, InputNumber, Checkbox } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { District } from "../components/Members/region.js";
import Swal from 'sweetalert2';
import { useContext } from 'react';
import { AuthContext } from '../utils/contexts';
import LoadingOverlay from "../components/Global/progress.js";

export function PetMissing() {
  const [breed, setBreed] = useState("");
  const [otherBreed, setOtherBreed] = useState("");
  const [petType, setPetType] = useState("");
  const [isFleaControlled, setIsFleaControlled] = useState(false);
  const [hasVaccinations, setHasVaccinations] = useState(false);
  const [isLigated, setIsLigated] = useState(false);
  const [petName, setPetName] = useState("");
  const [color, setColor] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState(0);
  const [description, setDescription] = useState("");
  const [feature, setFeature] = useState("");
  const [fileList, setFileList] = useState([]);
  const [otherColor, setOtherColor] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [loading, setLoading] = useState(false);
  const category = "走失";
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const handlePetTypeChange = (e) => {
    setPetType(e.target.value);
    setBreed("");
  };
  const handleBreedChange = (e) => {
    setBreed(e.target.value);
  };

  const handlePetNameChange = (e) => {
    setPetName(e.target.value);
  };

  const handleAgeChange = (value) => {
    setAge(parseInt(value, 10));
  };
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };
  const handleColorChange = (e) => {
    setColor(e.target.value);
  };
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };
  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleFeatureChange = (e) => {
    setFeature(e.target.value);
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
  };

  const handleSubmit = async ({ e, fileList }) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fileData = new FormData();
      const city = selectedDistrict[0];
      const district = selectedDistrict[1];

      fileData.append("category", category);
      fileData.append("name", petName);
      fileData.append("animalClass", petType);
      fileData.append("type", breed);
      fileData.append("color", color);
      fileData.append("city", city === "[null]" ? null : city);
      fileData.append("district", district === "[null]" ? null : district);
      fileData.append("address", address === "[null]" ? null : address);
      fileData.append("age", age);
      fileData.append("gender", gender);
      fileData.append("description", description);
      fileData.append("anthel", isFleaControlled ? "1" : "0");
      fileData.append("ligation", isLigated);
      fileData.append("vaccine", hasVaccinations);
      fileData.append("feature", feature);
      fileData.append("userID",user);
      fileData.append(`main_image`, fileList[0].originFileObj);
      const images = fileList.slice(1);
      images.forEach((image) => {
        fileData.append(`images`, image.originFileObj);
      });
      const petsResponse = await axios.post(
        "http://localhost:3000/api/1.0/pets/create",
        fileData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const gpsResponse = await axios.get("http://localhost:3000/api/1.0/gps");
      if (petsResponse && gpsResponse) {
        await Swal.fire({
          icon: 'success',
          title: '成功送出表單',
          text: '提醒：可以申請配對通知，如果有找到特徵相符的寵物就會收到通知喔',
          showConfirmButton: false,
          timer: 2000,
        });
        
      }
      setLoading(true);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      navigate("/");
    }
  };

  const breedOptions =
    petType === "dog"
      ? [
          { value: "米克斯", label: "米克斯 (Mixed)" },
          { value: "拉布拉多", label: "拉布拉多犬 (Labrador Retriever)" },
          { value: "德國牧羊犬", label: "德國牧羊犬 (German Shepherd)" },
          { value: "黃金獵犬", label: "黃金獵犬 (Golden Retriever)" },
          { value: "法國鬥牛", label: "法國鬥牛犬 (French Bulldog)" },
          { value: "貴賓", label: "貴賓 (Poodle)" },
          { value: "西斯梗犬", label: "西斯梗犬 (Shih Tzu)" },
          { value: "柴犬8", label: "柴犬 (Shiba Inu)" },
          { value: "邊境牧羊", label: "邊境牧羊犬 (Border Collie)" },
          { value: "other", label: "其他" },
        ]
      : petType === "cat"
      ? [
          { value: "波斯貓", label: "波斯貓 (Persian)" },
          { value: "馬恩島貓", label: "馬恩島貓 (Manx)" },
          { value: "暹羅貓", label: "暹羅貓 (Siamese)" },
          { value: "摺耳貓", label: "蘇格蘭摺耳貓 (Scottish Fold)" },
          { value: "緬因貓", label: "緬因貓 (Maine Coon)" },
          { value: "豹貓", label: "豹貓 (Bengal)" },
          { value: "俄羅斯藍貓", label: "俄羅斯藍貓 (Russian Blue)" },
          { value: "埃及毛貓", label: "埃及毛貓 (Egyptian Mau)" },
          { value: "布偶貓", label: "布偶貓 (Ragdoll)" },
          { value: "other", label: "其他" },
        ]
      : [];

  return (
    <PageDiv>
    {loading && <LoadingOverlay />}
      <FormContainer>
        <form onSubmit={(e) => handleSubmit({ e, fileList })}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img src="/images/missing.png" style={{ width: "100%" }} alt="pet-missing"/>
          </div>
          <FormGroup></FormGroup>
          <FormGroup>
            <Label>寵物名字 Name</Label>
            <Input type="text" value={petName} onChange={handlePetNameChange} />
          </FormGroup>
          <FormGroup>
            <Label>性別 Gender</Label>
            <Select value={gender} onChange={handleGenderChange}>
              <option value="">請選擇性別</option>
              <option value="male">男 Male</option>
              <option value="female">女 Female</option>
            </Select>
          </FormGroup>
          <FormGroup></FormGroup>
          <FormGroup>
            <Label>寵物種類 Category</Label>
            <Select value={petType} onChange={handlePetTypeChange}>
              <option value="">請選擇寵物種類</option>
              <option value="dog">狗狗 Dogs</option>
              <option value="cat">貓咪 Cats</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>品種 Breed</Label>
            <Select value={breed} onChange={handleBreedChange}>
              <option value="" disabled>
                請選擇品種
              </option>
              {breedOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            {breed === "other" && (
              <Input
                type="text"
                placeholder="請填寫其他品種"
                value={otherBreed}
                onChange={(value) => setOtherBreed(value)}
              />
            )}
          </FormGroup>
          <FormGroup>
            <Label>顏色 Color</Label>
            <Select value={color} onChange={handleColorChange}>
              <option value="" disabled>
                請選擇寵物種類
              </option>
              <option value="白色">白色</option>
              <option value="黑色">黑色</option>
              <option value="黃色">黃色</option>
              <option value="米色">米色</option>
              <option value="咖啡">咖啡</option>
            </Select>
            {color === "other" && (
              <Input
                type="text"
                placeholder="請填寫其他顏色"
                value={otherColor}
                onChange={(e) => setOtherColor(e.target.value)}
              />
            )}
          </FormGroup>
          <FormGroup>
            <Label>年齡 Age</Label>
            <InputNumber
              style={{ width: "100%" }}
              placeholder="請填寫整數，不滿一歲則填0"
              type="number"
              value={age}
              onChange={handleAgeChange}
            />
          </FormGroup>
          <FormGroup>
            <Label>個性 Feature</Label>
            <Input
              type="text"
              value={feature}
              onChange={handleFeatureChange}
              placeholder="最多用兩個詞語描述 (ex.親人、親狗)"
            />
          </FormGroup>
          <FormGroup>
            <Label>走失地點 Address</Label>
            <District onDistrictChange={handleDistrictChange} />
            <Input
              placeholder="盡量填寫詳細地址(可以填寫公共地址)"
              type="text"
              value={address}
              onChange={handleAddressChange}
              style={{ top: "-20px" }}
            />
          </FormGroup>
          <Divider />
          <CheckboxGroup>
            <Checkbox
              type="checkbox"
              checked={isLigated}
              onChange={() => setIsLigated(!isLigated)}
            />
            <Label>是否結紮</Label>
          </CheckboxGroup>
          <CheckboxGroup>            
            <Checkbox
              type="checkbox"
              checked={isFleaControlled}
              onChange={() => setIsFleaControlled(!isFleaControlled)}
            />
            <Label check>是否驅蟲</Label>
          </CheckboxGroup>
          <CheckboxGroup>
            <Checkbox
              type="checkbox"
              checked={hasVaccinations}
              onChange={() => setHasVaccinations(!hasVaccinations)}
            />
            <Label check>是否有打疫苗</Label>
          </CheckboxGroup>
          <Divider />
          <FormGroup>
            <Label>其他任何想說的話 Descriptions</Label>
            <TextArea placeholder="可以詳細寫特徵、是否有晶片...等等" value={description} onChange={handleDescriptionChange} />
            <ImageCrop fileList={fileList} setFileList={setFileList} />
          </FormGroup>
          <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
          <SubmitButton type="submit" disabled={loading}>Submit</SubmitButton>
          </div>
        </form>
      </FormContainer>
    </PageDiv>
  );
}
