import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../api/axios';

// 个人设置页 - 基础骨架（简化版）
const Profile = () => {
  const THEME_KEY = 'vexgoTheme';
  const TITLE_KEY = 'vexgoTitle';
  const SUBTITLE_KEY = 'vexgoSubtitle';
  const TITLE_COLOR_KEY = 'vexgoTitleColor';
  const COLOR_KEY = 'vexgoColor';

  const themeOptions = [
    { id: 'default', name: 'Vexgo Default Theme', desc: '系统默认的初始主题' },
    { id: 'vexgo-pervex', name: 'VexGo Pervex Theme', desc: '当前正在使用的博客主题' },
  ];

  const colorOptions = [
    { id: 'black', name: '黑色', value: '#000000' },
    { id: 'red', name: '红色', value: '#ff4d4f' },
    { id: 'orange', name: '橙色', value: '#fa8c16' },
    { id: 'yellow', name: '黄色', value: '#faad14' },
    { id: 'green', name: '绿色', value: '#52c41a' },
    { id: 'cyan', name: '青色', value: '#13c2c2' },
    { id: 'blue', name: '蓝色', value: '#1890ff' },
    { id: 'purple', name: '紫色', value: '#722ed1' },
    { id: 'custom', name: '自定义', value: '#1890ff' }, // 默认值
  ];

  const [activeTab, setActiveTab] = useState('theme');
  const [theme, setTheme] = useState(() => window.localStorage.getItem(THEME_KEY) || 'vexgo-default');
  const [title, setTitle] = useState(() => window.localStorage.getItem(TITLE_KEY) || '我的个人博客');
  const [subtitle, setSubtitle] = useState(() => window.localStorage.getItem(SUBTITLE_KEY) || '记录生活，分享技术，保持热爱，奔赴山海');
  const [titleColor, setTitleColor] = useState(() => window.localStorage.getItem(TITLE_COLOR_KEY) || '#000000');
  const [titleSize, setTitleSize] = useState(() => window.localStorage.getItem('vexgoTitleSize') || '48');
  const [color, setColor] = useState(() => window.localStorage.getItem(COLOR_KEY) || 'black');
  const [customColor, setCustomColor] = useState(() => window.localStorage.getItem(COLOR_KEY) === 'custom' ? window.localStorage.getItem('vexgoCustomColor') || '#000000' : '#000000');

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
      : '0 0 0';
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const selectedColor = color === 'custom' ? customColor : (colorOptions.find(c => c.id === color)?.value || '#000000');
    document.documentElement.style.setProperty('--color-primary-rgb', hexToRgb(selectedColor));
    document.documentElement.style.setProperty('--color-title', titleColor);
  }, [theme, color, customColor, titleColor]);

  const applyTheme = async (themeId) => {
    setTheme(themeId);
    
    if (themeId === 'default') {
      try {
        await axiosInstance.put('/config/theme', { activeTheme: 'default' });
        alert('已成功切换回 Vexgo Default Theme，即将为您跳转...');
        const currentHost = window.location.hostname;
        window.location.href = `http://${currentHost}:3001/admin/theme`;
      } catch (error) {
        console.error('Failed to switch to default theme:', error);
        alert('切换失败，请检查网络或登录状态。');
      }
    } else {
      window.localStorage.setItem(THEME_KEY, themeId);
      document.documentElement.setAttribute('data-theme', themeId);
    }
  };

  const saveHomeSettings = () => {
    window.localStorage.setItem(TITLE_KEY, title);
    window.localStorage.setItem(SUBTITLE_KEY, subtitle);
    window.localStorage.setItem(TITLE_COLOR_KEY, titleColor);
    window.localStorage.setItem('vexgoTitleSize', titleSize);
    alert('主界面设置已保存');
  };

  const applyColor = (colorId) => {
    setColor(colorId);
    window.localStorage.setItem(COLOR_KEY, colorId);
    if (colorId === 'custom') {
      window.localStorage.setItem('vexgoCustomColor', customColor);
      document.documentElement.style.setProperty('--color-primary-rgb', hexToRgb(customColor));
    } else {
      const selectedColor = colorOptions.find(c => c.id === colorId)?.value || '#000000';
      document.documentElement.style.setProperty('--color-primary-rgb', hexToRgb(selectedColor));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-white dark:bg-dark/80 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-primary mb-6">个人设置</h2>

      {/* 菜单栏 */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          className={`px-4 py-2 ${activeTab === 'theme' ? 'border-b-2 border-primary text-primary' : 'text-gray-600 dark:text-gray-400'}`}
          onClick={() => setActiveTab('theme')}
        >
          主题管理
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'password' ? 'border-b-2 border-primary text-primary' : 'text-gray-600 dark:text-gray-400'}`}
          onClick={() => setActiveTab('password')}
        >
          密码更改
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'home' ? 'border-b-2 border-primary text-primary' : 'text-gray-600 dark:text-gray-400'}`}
          onClick={() => setActiveTab('home')}
        >
          主界面编辑
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'color' ? 'border-b-2 border-primary text-primary' : 'text-gray-600 dark:text-gray-400'}`}
          onClick={() => setActiveTab('color')}
        >
          主题颜色
        </button>
      </div>

      {/* 内容区域 */}
      <div className="space-y-6">
        {activeTab === 'theme' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              主题选择
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {themeOptions.map((item) => (
                <div
                  key={item.id}
                  onClick={() => applyTheme(item.id)}
                  className={`relative rounded-xl border-2 p-5 cursor-pointer transition-all duration-200 flex flex-col items-center text-center group bg-white dark:bg-dark/90 ${
                    theme === item.id
                      ? 'border-primary shadow-md'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-sm'
                  }`}
                >
                  <div className="w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    <span className="text-gray-400 dark:text-gray-500 text-xl font-bold tracking-wider">
                      {item.name}
                    </span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {item.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {item.desc}
                  </p>
                  {theme === item.id ? (
                    <span className="px-4 py-1.5 text-sm font-medium bg-primary text-white rounded-full">
                      当前使用中
                    </span>
                  ) : (
                    <span className="px-4 py-1.5 text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                      点击应用
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'password' && (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                邮箱
              </label>
              <input
                type="email"
                defaultValue="admin@example.com"
                disabled
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-dark/90 cursor-not-allowed"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                新密码
              </label>
              <input
                type="password"
                placeholder="请输入新密码（留空则不修改）"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-dark/90"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                确认新密码
              </label>
              <input
                type="password"
                placeholder="再次输入新密码"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-dark/90"
              />
            </div>
            <button
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              保存修改
            </button>
          </div>
        )}

        {activeTab === 'home' && (
          <div>
            <div className="mb-4">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    大标题
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-dark/90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    字号 (px)
                  </label>
                  <input
                    type="number"
                    value={titleSize}
                    onChange={(e) => setTitleSize(e.target.value)}
                    className="w-24 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-dark/90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    标题颜色
                  </label>
                  <input
                    type="color"
                    value={titleColor}
                    onChange={(e) => setTitleColor(e.target.value)}
                    className="w-20 h-10 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-dark/90"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                副标题
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-dark/90"
              />
            </div>
            <button
              onClick={saveHomeSettings}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              保存主界面设置
            </button>
          </div>
        )}

        {activeTab === 'color' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              主题颜色
            </label>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {colorOptions.slice(0, 8).map((item) => (
                <button
                  key={item.id}
                  onClick={() => applyColor(item.id)}
                  className={`px-4 py-2 rounded-md border-2 ${color === item.id ? 'border-primary' : 'border-gray-300 dark:border-gray-700'} text-white`}
                  style={{ backgroundColor: item.value }}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => applyColor('custom')}
                className={`px-4 py-2 rounded-md border-2 w-80 ${color === 'custom' ? 'border-primary' : 'border-gray-300 dark:border-gray-700'} text-white`}
                style={{ backgroundColor: customColor }}
              >
                自定义
              </button>
              {color === 'custom' && (
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    window.localStorage.setItem('vexgoCustomColor', e.target.value);
                    document.documentElement.style.setProperty('--color-primary-rgb', hexToRgb(e.target.value));
                  }}
                  className="w-12 h-10 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-dark/90"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;