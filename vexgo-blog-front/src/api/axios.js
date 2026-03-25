import axios from 'axios';
import Cookies from 'js-cookie';

// 后端API基础地址（根据实际部署调整）
// 使用相对路径避免跨域问题
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：添加JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('vexgo_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：处理token过期/错误
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 清除token
      Cookies.remove('vexgo_token');
      // 注意：这里不能使用navigate，因为这不是React组件
      // 可以在组件中处理401错误，或者使用window.location进行重定向
      // window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;