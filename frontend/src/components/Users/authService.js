// AuthService.js
import axios from "axios";

export class AuthService {
    static registerUser = async (userData) => {
      try {
        const response = await axios.post('http://localhost:3000/api/1.0/users/signup', userData);
        return response.data.data.access_token; // Assuming the token is returned from the backend
      } catch (error) {
        throw error;
      }
    };
  
    static loginUser = async (credentials) => {
      try {
        const response = await axios.post('http://localhost:3000/api/1.0/users/signin', credentials);
        return response.data.data.access_token; // Assuming the token is returned from the backend
      } catch (error) {
        throw error;
      }
    };
  
    static setToken = (token) => {
      localStorage.setItem('jwtToken', token);
    };
  
    static getToken = () => {
      return localStorage.getItem('jwtToken');
    };
  
    static removeToken = () => {
      localStorage.removeItem('jwtToken');
    };
  
    static isLoggedIn = () => {
      const token = this.getToken();
      return token !== null;
    };
  }
  
  