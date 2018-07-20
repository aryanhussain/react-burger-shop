import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://windspectpreprod-dev.azurewebsites.net/rest/'
});
let authToken = localStorage.getItem('userInfo');
authToken = JSON.parse(authToken);
if(authToken){
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${authToken.access_token}`;
    axiosInstance.defaults.headers.common['Id'] = authToken.id;
}



export default axiosInstance;