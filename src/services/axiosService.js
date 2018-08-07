import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://windspectpreprod.azurewebsites.net/rest/'
});
let authToken = localStorage.getItem('userInfo');
authToken = JSON.parse(authToken);
if(authToken){
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer vgfquZ4qXy1rLWAWPyS-nBDCkkFxap8t1W8ABNtQ5vPEcUC6lQ134OCBokdmfz-Hje9hrdgkkvyAJtFWXO-caLghLAqVskQO2WoBuUztUz9SbvFm1AnMkpfoeUIR8WGoKZ61yyvF5hwHrtcX71f4xj79GQi6ACgpjeGMrAD07FTclr2HUHZx1YLxQAcYL0E69f3RggcXiHO2-BBXxSsgRQWJIOr8--iw22vf8n29c1-1yLyrThiHy0dh--_vHmZ1ABXajAiUPDaGCVnd3n17pPbjr6jvBi5VH4TvRpGdTV57Vk_My-o2sAOuwNkAHK_leydBX1JxW64ymwxyGP_R2PqOOM8GPsX_s0TT9OjX-Dv_sm9ohzmm9coVvm19GlADCnRC_NnN7CkHElO175YUdi23qGui5LqAudVkGpyXB23dA-JeZiWISEV1FEAZzO45zryWh1qSCHRUNv2lgEDddDHq_9gAzmJ5Ku6Juyt6cUfHM6n901VvQ3AtmqY4YbwgkCxtdX-ohDQu-pgfUFmjq2HkZyadM7ULfjVKEnNEFuSps_GeJmH6hvX5VWb69k2R7jXZ9WQtCYB-6B5c0BZw0A`;
    axiosInstance.defaults.headers.common['Id'] = `NzczRUNDRDctNUMzMy00MDlELTgwQjYtREVFNTBERTg1REM3`;
}



export default axiosInstance;