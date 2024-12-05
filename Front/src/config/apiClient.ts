import axios from 'axios';

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const config = {
    apiBaseUrl: process.env.REACT_APP_IS_DEV === 'true'
        ? (isMobile
            ? `http://${window.location.hostname}:5001/tomexplore-c1c71/europe-west3/api`
            : process.env.REACT_APP_DEV_API_URL)
        : process.env.REACT_APP_PROD_API_URL,
    dev: process.env.REACT_APP_IS_DEV === 'true',
};

const apiClient = axios.create({
    baseURL: config.apiBaseUrl
});

export default apiClient;
