import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import formatDate from '../../utils/formatDate';
import MarkdownRenderer from './MarkdownRenderer';

const Card = ({ article }) => {
  // 确保 article 对象存在，避免 undefined 错误
  if (!article) {
    return (
      <div className="bg-white dark:bg-dark/80 rounded-lg shadow-md p-6">
        <div className="text-gray-500 dark:text-gray-400">文章数据加载中...</div>
      </div>
    );
  }
  
  const { id, title, summary, excerpt, content, coverImage, createTime, createdAt } = article;
  // 优先使用 excerpt（后端返回字段），其次使用 summary（兼容字段），再 fallback 到完整 content
  const displayExcerpt = excerpt || summary || content || '无摘要';

  return (
    <motion.div
      className="bg-white dark:bg-dark/80 rounded-lg shadow-md hover:shadow-lg overflow-hidden transition-shadow duration-300"
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Link to={`/article/${id}`} className="block">
        {coverImage && (
          <div className="relative h-44 w-full overflow-hidden">
            <img
              src={coverImage}
              alt={title}
              className="object-cover w-full h-full"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}
        <div className={coverImage ? 'p-6' : 'p-4'}>
          <h3 className="text-xl font-bold mb-2 text-primary dark:text-primary/90 hover:text-primary/80 transition-colors">
            {title}
          </h3>
          <div className="mb-4 line-clamp-2 overflow-hidden">
            <div className="text-gray-600 dark:text-gray-300 break-words">
              <MarkdownRenderer content={displayExcerpt} isExcerpt />
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(createdAt || createTime)}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default Card;