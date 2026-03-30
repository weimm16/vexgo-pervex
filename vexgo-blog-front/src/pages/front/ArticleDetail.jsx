import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getArticleDetail } from '../../api/articleApi';
import Loading from '../../components/ui/Loading';
import MarkdownRenderer from '../../components/ui/MarkdownRenderer';
import formatDate from '../../utils/formatDate';

// 文章详情页 - 基础骨架
const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await getArticleDetail(id);
        // 后端返回的是 {"post": post} 结构
        const articleData = res.data?.post || res.data;
        setArticle(articleData);
        console.log('获取文章详情:', articleData);
      } catch (error) {
        console.error('获取文章详情失败：', error);
        console.error('错误响应：', error.response?.data);
        alert('文章不存在或已删除');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center h-[70vh]">
        <Loading />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-12 text-center text-gray-500">
        <h2 className="text-2xl mb-4">文章不存在</h2>
        <a href="/" className="text-primary hover:underline">返回首页</a>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-12 max-w-4xl"
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-primary">{article.title}</h1>
      
      {article.coverImage && (
        <div className="overflow-hidden rounded-lg mb-6">
          <img
            src={article.coverImage}
            alt={article.title}
            className="object-cover w-full h-64"
            loading="lazy"
          />
        </div>
      )}
      <div className="text-gray-500 dark:text-gray-400 mb-8 flex flex-wrap items-center gap-4">
        <span>发布时间：{formatDate(article.createdAt || article.createTime)}</span>
        {article.author && (
          <span>作者：{article.author.username || article.author.name || '未知'}</span>
        )}
        {article.category && (
          <span>分类：{article.category}</span>
        )}
        {article.tags && article.tags.length > 0 && (
          <span>标签：{article.tags.map(tag => tag.name || tag).join(', ')}</span>
        )}
      </div>

      {article.excerpt && (
        <div className="bg-gray-50 dark:bg-dark/50 p-4 rounded-lg mb-8 border-l-4 border-primary">
          <p className="text-gray-700 dark:text-gray-300 italic">{article.excerpt}</p>
        </div>
      )}

      <div className="prose dark:prose-invert max-w-none prose-lg">
        {article.content ? (
          <MarkdownRenderer content={article.content} />
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">暂无内容</p>
        )}
      </div>
    </motion.div>
  );
};

export default ArticleDetail;
