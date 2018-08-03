import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://windspectpreprod.azurewebsites.net/rest/'
});
let authToken = localStorage.getItem('userInfo');
authToken = JSON.parse(authToken);
if(authToken){
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer pMy5zNj4zgVEASTU2uAMw-fRkolVu6Ay57-v0zNuTq0oQ4NqWrLY8Lw2eK08EoqiTx57IL0ogJ5FGGBxw469MpKV1FN5tRP4HDTK9eLPY7mIWHmzQ7lY81PjpXPpIsOxr6j8oNx1skMqzOqtx5XcZbJlRD7yhBdZE_wf4RALE3CIpJpnRAOIlIIM3duEAx20WsEDLwQOejciiJPxP7l11RYTCZNozE7D-RJ7-9TyvnPKCuXpWiUTTDPwSZdq_nZ5v8rS-0u8bcA39yI_GDfQTOWIP_7LmaGWO4qQzAPihLyx0nu9zMpXRf6x58yjq_uOjWxfYWPed0fj1irEok6WjxnoGD0BaNpZjXsKG_mejhVFfb_MCBKUx-JbZBjdICXsD7XuW1t9BDShAYOLMs997lTMf0mLaC2P08_o0zoSa9tNupbjerJ0fnqTdEgGjdZPO8K9IRa_zEWjKtWBcU370_x_6ZFGVMvLk9C-g21NBNpTygzcCqtNvjHwOwdhGpwuBgUo6INrkZwxvrdfc74i3INsmKNexWMTl0StF-qR7RvqVbrpWqBJoCSbm-cof1B-3EtKVsPMXdVTYpfSE50_BQ`;
    axiosInstance.defaults.headers.common['Id'] = `NzczRUNDRDctNUMzMy00MDlELTgwQjYtREVFNTBERTg1REM3`;
}



export default axiosInstance;