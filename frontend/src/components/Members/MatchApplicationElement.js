import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {
  Button,
  Cascader,
  Form,
  Input,
  Select,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useContext } from 'react';
import { AuthContext } from '../../utils/contexts.js';
const FormGroup = styled.div`
  margin-bottom: 16px;
`;
const Label = styled.label`
  display: block;
  font-size: 16px;
  margin-bottom: 8px;
`;



const District = ({onDistrictChange }) => {
    const [districtOptions, setDistrictOptions] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/1.0/taiwan-districts');
          const formattedOptions = response.data.map(city => {
            const cityOptions = city.districts.map(district => ({
              value: district.name,
              label: district.name,
            }));
            cityOptions.unshift({
              value: null, 
              label: '不限區域', 
            });
          
            return {
              value: city.name,
              label: city.name,
              children: cityOptions,
            };
          });
          formattedOptions.unshift({
            value: null, 
            label: '不限區域', 
          });
                  
          setDistrictOptions(formattedOptions);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []); // Fetch data only once when the component mounts
  
    const handleCascaderChange = (value, selectedOptions) => {
      // Do something with the selected value if needed
      setSelectedDistrict(value);
      onDistrictChange(value);
    };
  
    return (
      <Form.Item label="地區">
        <Cascader
          options={districtOptions}
          value={selectedDistrict}
          onChange={handleCascaderChange}
        />
      </Form.Item>
    );
  };
const MatchApplication = () => {
    const [petType, setPetType] = useState("");
    const [breed, setBreed] = useState("");
    const [otherBreed, setOtherBreed] = useState("");
    const [gender, setGender] = useState("");
    const [category, setCategory] = useState("");
    const [otherColor, setOtherColor] = useState("");
    const [color, setColor] = useState("");
    const [email, setEmail] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const navigate = useNavigate()
    const { user } = useContext(AuthContext);
    const handleDistrictChange = (value) => {
        setSelectedDistrict(value);
    };
    const handleGenderChange = (value) => {
        setGender(value) ;
    };
    const handleColorChange = (value) => {
        setColor(value);
      };

    const handlePetTypeChange = (value) => {
        setPetType(value);
        setBreed("");
      };
    
    const handleBreedChange = (value) =>{
        setBreed(value);
    };
    const handleCategoryChange = (value) =>{
        setCategory(value);
    };
    const handleEmailChange = (e) =>{
        setEmail(e.target.value);
    };
    const city = selectedDistrict[0]
    const district = selectedDistrict[1];
    const data = {
        userID: user,
        category: category,
        animalClass: petType,
        type: breed === "" ? null : breed,
        color: color === "" ? null : color,
        city:  city === "[null]" ? null : city,
        district: district === "[null]" ? null : district,
        gender: gender === "" ? null : gender,
        email: email,
      };
    const handleSubmit = async () =>{
        try {
            const url = "http://localhost:3000/api/1.0/matches/subscribe";
            const response = await axios.post(url, data);
            // const shelterResponse = await axios.get("https://data.moa.gov.tw/Service/OpenData/TransService.aspx?UnitId=QcbUEzN6E6DL&$filter=animal_kind=&animal_colour=黑色")
              const matchResponse = await axios.get(`http://localhost:3000/api/1.0/matches/match-user?userID=${user}`);
              if (response && matchResponse){
                await Swal.fire({
                  icon: 'success',
                  title: '申請成功！',
                  text: '等待緣分降臨中...',
                  showConfirmButton: false,
                  timer: 1500, 
                });
              await navigate("/members/match-list")
            }
            console.log(response.data);
          } catch (error) {
            console.error('Error submitting form:', error);
          }
    }
    


    const breedOptions =
    petType === "dog"
      ? [ { value: null, label: "不限種類" },
          { value: "米克斯", label: "米克斯 (Mixed)" },
          { value: "拉布拉多", label: "拉布拉多犬 (Labrador Retriever)" },
          { value: "德國牧羊", label: "德國牧羊犬 (German Shepherd)" },
          { value: "黃金獵犬", label: "黃金獵犬 (Golden Retriever)" },
          { value: "法國鬥牛", label: "法國鬥牛犬 (French Bulldog)" },
          { value: "貴賓", label: "貴賓 (Poodle)" },
          { value: "西斯梗犬", label: "西斯梗犬 (Shih Tzu)" },
          { value: "柴犬", label: "柴犬 (Shiba Inu)" },
          { value: "邊境牧羊", label: "邊境牧羊犬 (Border Collie)" },
          { value: "other", label: "其他" },
        ]
      : petType === "cat"
      ? [   { value: null, label: "不限種類" },
          { value: "波斯貓", label: "波斯貓 (Persian)" },
          { value: "馬恩島貓", label: "馬恩島貓 (Manx)" },
          { value: "暹羅貓", label: "暹羅貓 (Siamese)" },
          { value: "蘇格蘭摺耳貓", label: "蘇格蘭摺耳貓 (Scottish Fold)" },
          { value: "緬因貓", label: "緬因貓 (Maine Coon)" },
          { value: "豹貓", label: "豹貓 (Bengal)" },
          { value: "俄羅斯藍貓", label: "俄羅斯藍貓 (Russian Blue)" },
          { value: "埃及毛貓", label: "埃及毛貓 (Egyptian Mau)" },
          { value: "布偶貓", label: "布偶貓 (Ragdoll)" },
          { value: "other", label: "其他" },
        ]
      : [];
  return (
    <div style={{padding:"20px"}}>
  
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        style={{
          maxWidth: 600,
        }}
        onFinish={handleSubmit}
      >
        
        <Form.Item label="通知類別">
          <Select value={category} onChange={handleCategoryChange}>
            <Select.Option value="領養">我要領養</Select.Option>
            <Select.Option value="走失">走失通知</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="寵物種類 Animal">
            <Select value={petType} onChange={handlePetTypeChange}>
              <option disabled>請選擇寵物種類</option>
              <option value="dog">狗狗 Dogs</option>
              <option value="cat">貓咪 Cats</option>
            </Select>
          </Form.Item>
          <Form.Item label="品種 Breed">
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
                onChange={(e) => setOtherBreed(e.target.value)}
              />
            )}
            </Form.Item>
          <Form.Item label="性別" name="disabled" valuePropName="checked">
          <Select value={gender} onChange={handleGenderChange}>
              <option disabled>請選擇寵物性別</option>
              <option value= "">不限性別</option>
              <option value="male">男 Male</option>
              <option value="female">女 Female</option>
        </Select>
        
        </Form.Item>
        <FormGroup>
            <Label>顏色 Color</Label>
            <Select value={color} onChange={handleColorChange}>
              <option disabled>請選擇寵物顏色</option>
              <option value="">不限顏色</option>
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
                onChange={(value) => setOtherColor(value)}
              />
            )}
          </FormGroup>
        <District onDistrictChange={handleDistrictChange} />
        <Form.Item label="Email">
          <Input type="text" value={email} onChange={handleEmailChange}/>
        </Form.Item>
        <Form.Item >
          <Button type="primary" htmlType="submit">送出 Submit</Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default () => <MatchApplication />;