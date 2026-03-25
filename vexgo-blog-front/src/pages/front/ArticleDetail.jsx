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
        setArticle(res.data);
      } catch (error) {
        console.error('获取文章详情失败：', error);
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
      <div className="text-gray-500 dark:text-gray-400 mb-8">
        发布时间：{formatDate(article.createTime)}
      </div>
      <div className="prose dark:prose-invert max-w-none prose-lg">
        <MarkdownRenderer content={article.content} />
      </div>
    </motion.div>
  );
};

export default ArticleDetail;
