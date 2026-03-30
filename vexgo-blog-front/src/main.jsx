import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './router';
import './styles/globals.css';

console.log('Vexgo Pervex 主题已加载 - 默认色：黑色');

const THEME_KEY = 'vexgoTheme';
const COLOR_KEY = 'vexgoColor';
const TITLE_COLOR_KEY = 'vexgoTitleColor';

const colorOptions = [
  { id: 'red', value: '#ff4d4f' },
  { id: 'orange', value: '#fa8c16' },
  { id: 'yellow', value: '#faad14' },
  { id: 'green', value: '#52c41a' },
  { id: 'cyan', value: '#13c2c2' },
  { id: 'blue', value: '#1890ff' },
  { id: 'purple', value: '#722ed1' },
  { id: 'black', value: '#000000' },
  { id: 'custom', value: '#000000' }, // 默认值
];

const currentTheme = window.localStorage.getItem(THEME_KEY) || 'vexgo-default';
const currentColor = window.localStorage.getItem(COLOR_KEY) || 'black';
const currentTitleColor = window.localStorage.getItem(TITLE_COLOR_KEY) || '#000000';

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
    : '0 0 0'; // Fallback to black
};

const applyColor = (colorId) => {
  const selectedColor = colorId === 'custom' ? window.localStorage.getItem('vexgoCustomColor') || '#000000' : (colorOptions.find(c => c.id === colorId)?.value || '#000000');
  document.documentElement.style.setProperty('--color-primary-rgb', hexToRgb(selectedColor));
};

const applyTitleColor = (color) => {
  document.documentElement.style.setProperty('--color-title', color);
};

applyTheme(currentTheme);
applyColor(currentColor);
applyTitleColor(currentTitleColor);

window.addEventListener('storage', (event) => {
  if (event.key === THEME_KEY && event.newValue) {
    applyTheme(event.newValue);
  }
  if (event.key === COLOR_KEY && event.newValue) {
    applyColor(event.newValue);
  }
  if (event.key === TITLE_COLOR_KEY && event.newValue) {
    applyTitleColor(event.newValue);
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);