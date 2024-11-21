import axios from 'axios';
const config = {
    apiBaseUrl: process.env.REACT_APP_IS_DEV === 'true'
        ? process.env.REACT_APP_DEV_API_URL
        : process.env.REACT_APP_PROD_API_URL,
    dev: process.env.REACT_APP_IS_DEV === 'true'
};


const apiClient = axios.create({
    baseURL: config.apiBaseUrl
});

export default apiClient;
