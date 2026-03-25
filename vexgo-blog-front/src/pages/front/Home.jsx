import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getArticleList } from '../../api/articleApi';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import Button from '../../components/ui/Button';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 获取文章列表
  const fetchArticles = async (currentPage) => {
    try {
      setLoading(true);
      const res = await getArticleList({ page: currentPage, size: 8 });
      
      // 确保数据结构正确，避免 undefined 错误
      const data = res?.data || {};
      const posts = Array.isArray(data.posts) ? data.posts : [];
      const total = data.pagination?.total || 0;
      
      if (currentPage === 1) {
        setArticles(posts);
      } else {
        setArticles(prev => [...prev, ...posts]);
      }
      setHasMore(currentPage * 8 < total);
    } catch (error) {
      console.error('获取文章失败：', error);
      // 确保 articles 始终是数组
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(page);
  }, [page]);

  // 加载更多
  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 首页头部 */}
      <motion.div
        className="text-center mb-12"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          我的个人博客
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          记录生活，分享技术，保持热爱，奔赴山海
        </p>
      </motion.div>

      {/* 文章列表 */}
      {loading && page === 1 ? (
        <div className="flex justify-center py-12">
          <Loading />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(articles) && articles.map(article => (
              <Card key={article.id} article={article} />
            ))}
          </div>

          {/* 加载更多按钮 */}
          {hasMore && (
            <div className="mt-8 text-center">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? '加载中...' : '加载更多'}
              </Button>
            </div>
          )}

          {/* 无更多数据 */}
          {!hasMore && articles.length > 0 && (
            <div className="mt-8 text-center text-gray-500">
              没有更多文章了 📚
            </div>
          )}

          {/* 无文章 */}
          {articles.length === 0 && !loading && (
            <div className="mt-8 text-center text-gray-500">
              暂无文章，快去后台发布吧 ✍️
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default Home;