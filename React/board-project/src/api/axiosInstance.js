import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost', // 모든 요청 앞에 자동으로 붙음
  withCredentials: true,       // 쿠키 포함 (필요 시)
});

export default axiosInstance;