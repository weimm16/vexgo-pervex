import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { login as loginApi } from '../api/articleApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初始化：检查token是否存在
  useEffect(() => {
    const token = Cookies.get('vexgo_token');
    if (token) {
      // 简化处理：实际可调用/user/info接口获取用户信息
      setUser({ isLogin: true });
    }
    setLoading(false);
  }, []);

  // 登录方法
  const login = async (formData) => {
    try {
      setLoading(true);
      const res = await loginApi(formData);
      const { token } = res.data;
      Cookies.set('vexgo_token', token, { expires: 7 }); // 7天有效期
      setUser({ isLogin: true });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || '登录失败' };
    } finally {
      setLoading(false);
    }
  };

  // 退出登录
  const logout = () => {
    Cookies.remove('vexgo_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义Hook：简化上下文调用
export const useAuth = () => useContext(AuthContext);
