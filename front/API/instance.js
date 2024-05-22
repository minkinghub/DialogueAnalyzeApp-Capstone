import axios from 'axios';
import {GetToken} from '../component/tokenData/GetToken';
const baseURL = 'http://35.216.126.98:8080/api/';

// token이 있는 경우
//ex) 로그인 후 페이지
//axiosinstance
const axiosAuthApi = axios.create({
  baseURL,
  timeout: 600000,
});

axiosAuthApi.interceptors.request.use(
  async config => {
    // 요청을 보내기 전에 실행 할 것
    const {access_token} = await GetToken();
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  error => {
    // 에러가 발생하기 전에 실행 할것
    return Promise.reject(error);
  },
);
// axiosApi.interceptors.response.use(
//   response => {
//     //응답 데이터를 받기전에 실행 할 것
//     return response;
//   },
//   error => {
//     //에러가 발생하기 전에 실행 할 것

//     return Promise.reject(error);
//   },
// );

export {axiosAuthApi};
