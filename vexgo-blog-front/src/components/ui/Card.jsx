import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import formatDate from '../../utils/formatDate';

const Card = ({ article }) => {
  // 确保 article 对象存在，避免 undefined 错误
  if (!article) {
    return (
      <div className="bg-white dark:bg-dark/80 rounded-lg shadow-md p-6">
        <div className="text-gray-500 dark:text-gray-400">文章数据加载中...</div>
      </div>
    );
  }
  
  const { id, title, summary, createTime } = article;

  return (
    <motion.div
      className="bg-white dark:bg-dark/80 rounded-lg shadow-md hover:shadow-lg overflow-hidden transition-shadow duration-300"
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Link to={`/article/${id}`} className="block p-6">
        <h3 className="text-xl font-bold mb-2 text-primary dark:text-primary/90 hover:text-primary/80 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {summary || '无摘要'}
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(createTime)}
        </div>
      </Link>
    </motion.div>
  );
};

export default Card;