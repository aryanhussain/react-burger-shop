import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://windspectpreprod.azurewebsites.net/rest/'
});
let authToken = localStorage.getItem('userInfo');
if(authToken){
    authToken = JSON.parse(authToken);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer LqAGWosAEIYqoBvzu9to07rUOBfnyi9IfgpGDOn4y5SEju_NIJjZ2zecPe55FksMNbMwr3drq-l4IquXyO4ZJvh3b2w0-X_quQkB4kjzjg1nm-aM3YsgWoPZWig8XHnqzj5NRG4Y5ilyOnuEvt9kJoZRSmOnaAE_N1NRLbdEcQUPXQfCoRe4xWptIevdTkupveZVMxyEwVZAQIgrE1vatpM7UQMHyDQ5MdOkSa_S0IdkbtYPEIhjkvYWHIsDp8rfr9c5LYUjYFqPFqeNN1SaUxhtN_vTWMghuIMmWZvq-tw4QL8BHTAN8R4y4yj8YEV4JfhyE_XmOb124VGY6xRuTTeeGopeKAHznw7-gNuf6vdLZqKaalL6FdzFcGydm7guwyUvZ0RlYxSFKBVTNdSzaKRriGyPXGWjjx8q_jLU0dOCHBQ93dqvfnZaqP6sGTpHFnosoChd76c1R-SLCNtKXSNRcrCw2YsEf2JKl8RiH0kVecaO3yyZj6yI1tFusSe6EmA_-SBIkpb8sNYm_4JkHmvZHKdXTlrpwIev0B8JD6GdaRO19Zh_J5b9lfgSVMz2Ob2ha0bu9ErE9sODiI26T91W7p-Ft1BsU1eEVwvT35Y`;
    axiosInstance.defaults.headers.common['Id'] = `RUZDQzNCOUUtNzI3MC00REIzLThFMzQtMzM4NDhCMkUzRjUz`;
}



export default axiosInstance;