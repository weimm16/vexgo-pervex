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
  const [deleteLoading, setDeleteLoading] = useState(null); // 记录删除中的文章ID

  // 获取文章列表
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await getArticleList({ page: 1, size: 100 }); // 个人博客默认加载全部
      setArticles(res.data.list);
    } catch (error) {
      console.error('获取文章失败：', error);
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
        <Button as={Link} to="/admin/articles/edit" variant="primary">
          新增文章
        </Button>
      </div>

      {/* 文章列表 */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loading />
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white dark:bg-dark/80 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">暂无文章，点击「新增文章」开始创作吧 ✍️</p>
          <Button as={Link} to="/admin/articles/edit" variant="primary">
            立即创作
          </Button>
        </div>
      ) : (
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      to={`/article/${article.id}`}
                      target="_blank"
                      className="text-primary hover:text-primary/80 font-medium"
                    >
                      {article.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(article.createTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <Button 
                        as={Link} 
                        to={`/admin/articles/edit/${article.id}`}
                        variant="outline" 
                        size="sm"
                      >
                        编辑
                      </Button>
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
      )}
    </motion.div>
  );
};

export default ArticleList;
