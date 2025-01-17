import React, { useState } from "react";
import Select from "react-select";
import styled from "styled-components";
export const customStyles = {
  control: (provided, state) => ({
    ...provided,
    height: "10px",
    maxHeight: "20px",
    borderRadius: "20px",
    backgroundColor: "#1d3557",
    fontSize: "12px",
    border: state.isFocused ? "2px solid #4A90E2" : "none",
    boxShadow: state.isFocused ? "0 0 3px rgba(74, 144, 226, 0.6)" : "none",
  }),
  option: (provided, { isSelected }) => ({
    ...provided,
    fontSize: "12px",
    color: "black",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: "#FFFFFF",
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: "12px",
    color: "#FFFFFF",
  }),
};
export const customStylesForClass = {
  control: (provided, state) => ({
    ...provided,
    height: "10px",
    maxHeight: "20px",
    borderRadius: "20px",
    backgroundColor: "#e5e5e5",
    fontSize: "12px",
    border: state.isFocused ? "2px solid #4A90E2" : "none",
    boxShadow: state.isFocused ? "0 0 3px rgba(74, 144, 226, 0.6)" : "none",
  }),
  option: (provided, { isSelected }) => ({
    ...provided,
    fontSize: "10px",
    color: "black",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: "#000",
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: "12px",
    color: "#000",
  }),
};
export const ImgInButton = styled.img`
  width: 20px;
`;

export function OptionsSelection({ options, optionName, onSelect }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (selected) => {
    setSelectedOption(selected);
    onSelect(selected.value);
  };

  return (
    <Select
      value={selectedOption}
      onChange={handleOptionChange}
      options={options.map((option) => ({ label: option, value: option }))}
      placeholder={optionName}
      styles={customStyles}
    />
  );
}

export const ButtonContainer = styled.button`
  height: 38px;
  display: flex;
  border-radius: 30px;
  background-color: ${({ clicked }) => (clicked ? "#ffc300" : "#e5e5e5")};
  color: ${({ clicked }) => (clicked ? "#FFFFFF" : "#000000")};
  border: none;
  justify-content: center;
  align-items: center;
  padding: 10px;
  gap: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
`;



export const SearchButtonContainer = styled.button`
  /* height: 15x; */
  display: flex;
  border-radius: 5px;
  background-color: ${({ clicked }) => (clicked ? "#FFFFFF" : "#FFFFFF")};
  color: ${({ clicked }) => (clicked ? "#FFFFFF" : "#000000")};
  border: none;
  justify-content: center;
  align-items: center;
  padding: 3px 3px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: 1px solid #ccc;
`;
