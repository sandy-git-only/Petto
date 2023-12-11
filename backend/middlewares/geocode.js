import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.MAPS_API_KEY;
export const geocoder = async (address) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?key=${apiKey}&address=${address}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};


