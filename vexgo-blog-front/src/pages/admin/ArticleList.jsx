import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getArticleList, deleteArticle } from '../../api/articleApi';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import formatDate from '../../utils/formatDate';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null); // 记录删除中的文章ID

  // 获取文章列表
  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getArticleList({ page: 1, size: 100 });
      
      // 确保数据结构正确
      let articleList = [];
      if (res.data?.posts && Array.isArray(res.data.posts)) {
        articleList = res.data.posts;
      } else if (res.data?.list && Array.isArray(res.data.list)) {
        articleList = res.data.list;
      } else if (Array.isArray(res.data)) {
        articleList = res.data;
      }
      
      console.log('获取文章列表成功:', articleList);
      setArticles(articleList || []);
    } catch (error) {
      console.error('获取文章失败：', error);
      console.error('错误响应：', error.response?.data);
      setError(error.response?.data?.message || error.message || '获取文章列表失败');
      setArticles([]); // 确保设置为空数组，绝不是 undefined
    } finally {
      setLoading(false);
    }
  };

  // 删除文章
  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除这篇文章吗？删除后无法恢复！')) return;
    try {
      setDeleteLoading(id);
      await deleteArticle(id);
      setArticles(prev => prev.filter(article => article.id !== id));
    } catch (error) {
      console.error('删除文章失败：', error);
      alert('删除失败：' + (error.response?.data?.message || '未知错误'));
    } finally {
      setDeleteLoading(null);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* 头部操作栏 */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">文章管理</h2>
        <Link to="/admin/articles/edit" className="no-underline">
          <Button variant="primary">
            新增文章
          </Button>
        </Link>
      </div>

      {/* 文章列表 */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loading />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 text-center">
          <p className="text-red-600 dark:text-red-300">获取文章失败：{error}</p>
          <button 
            onClick={fetchArticles}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
          >
            重试
          </button>
        </div>
      ) : Array.isArray(articles) && articles.length > 0 ? (
        <div className="bg-white dark:bg-dark/80 rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-dark/90">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">标题</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">创建时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {articles.map((article) => (
                <tr 
                  key={article.id}
                  className="hover:bg-gray-50 dark:hover:bg-dark/70 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{article.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">作者: {article.author?.username || '未知'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(article.createdAt || article.createTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <Link to={`/admin/articles/edit/${article.id}`} className="no-underline">
                        <Button 
                          variant="outline" 
                          size="sm"
                        >
                          编辑
                        </Button>
                      </Link>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDelete(article.id)}
                        disabled={deleteLoading === article.id}
                      >
                        {deleteLoading === article.id ? '删除中...' : '删除'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white dark:bg-dark/80 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">暂无文章，点击「立即创作」开始创作吧 ✍️</p>
          <Link to="/admin/articles/edit" className="no-underline">
            <Button variant="primary">
              立即创作
            </Button>
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default ArticleList;
