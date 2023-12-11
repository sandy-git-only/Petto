import axios from "axios";

const TOKEN_NAME = "jwtToken";

const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
export const getAuthToken = () => {
    return localStorage.getItem(TOKEN_NAME);
  };

export const setAuthToken = (token) => {
  localStorage.setItem(TOKEN_NAME, token);
};


export const getMe = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${REACT_APP_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    // 處理錯誤
    console.error('Error fetching user profile:', error);
    throw error; 
  }
};


