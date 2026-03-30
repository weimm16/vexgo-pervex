import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// 前台布局（导航+内容+页脚）- 基础骨架
const FrontLayout = () => {
  const [blogTitle, setBlogTitle] = useState('我的博客');

  useEffect(() => {
    const storedTitle = window.localStorage.getItem('vexgoTitle') || '我的博客';
    setBlogTitle(storedTitle);

    const handleStorageChange = (event) => {
      if (event.key === 'vexgoTitle') {
        setBlogTitle(event.newValue || '我的博客');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col"
    >
      {/* 导航栏 */}
      <header className="bg-white dark:bg-dark border-b border-gray-200 dark:border-gray-800 py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <a href="/" className="text-xl font-bold text-primary">{blogTitle}</a>
          <nav>
            <ul className="flex space-x-6">
              <li><a href="/" className="hover:text-primary transition-colors">首页</a></li>
              <li><a href="/about" className="hover:text-primary transition-colors">关于</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* 页面内容（路由出口） */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 页脚 */}
      <footer className="bg-gray-50 dark:bg-dark/80 py-6 px-6 text-center text-gray-600 dark:text-gray-400 flex flex-col sm:flex-row justify-center items-center gap-2">
        <span>© {new Date().getFullYear()} 我的个人博客 | 基于 VexGo 构建</span>
        <a
          className="text-black dark:text-white hover:underline"
          href="/admin/login"
        >
          后台登录
        </a>
      </footer>
    </motion.div>
  );
};

export default FrontLayout;