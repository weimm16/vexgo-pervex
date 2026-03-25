import { motion } from 'framer-motion';

// 关于页 - 基础骨架
const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12 max-w-2xl"
    >
      <h1 className="text-3xl font-bold mb-8 text-primary">关于我</h1>
      <div className="bg-white dark:bg-dark/80 rounded-lg shadow-md p-8">
        <p className="text-lg mb-4">
          你好！我是这个博客的作者，专注于分享技术心得、生活感悟。
        </p>
        <p className="text-lg mb-4">
          本博客基于 VexGo（React + Go）构建，轻量化、易部署，只为记录和分享。
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          建站时间：{new Date().getFullYear()} 年
        </p>
      </div>
    </motion.div>
  );
};

export default About;
