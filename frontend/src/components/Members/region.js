import { useState, useEffect } from "react";
import axios from "axios";
import {
  Cascader,
  Form,
} from 'antd';

export const District = ({onDistrictChange }) => {
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
            value: "", 
            label: '不限區域', 
          });
        
          return {
            value: city.name,
            label: city.name,
            children: cityOptions,
          };
        });
        formattedOptions.unshift({
          value: "", 
          label: '不限區域', 
        });
        
        // Add a global "不限區域" option for all cities
        
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