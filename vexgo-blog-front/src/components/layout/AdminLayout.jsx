import { Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

// 后台布局（侧边栏+内容）- 基础骨架
const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // 退出登录
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex bg-gray-50 dark:bg-dark"
    >
      {/* 侧边栏 */}
      <aside className="w-64 bg-white dark:bg-dark/80 border-r border-gray-200 dark:border-gray-800 h-screen sticky top-0">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-primary">博客管理后台</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <a 
                href="/admin/articles" 
                className="block p-2 rounded hover:bg-primary/10 text-primary transition-colors"
              >
                文章管理
              </a>
            </li>
            <li>
              <a 
                href="/admin/profile" 
                className="block p-2 rounded hover:bg-primary/10 text-primary transition-colors"
              >
                个人设置
              </a>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Button variant="outline" onClick={handleLogout} className="w-full">
            退出登录
          </Button>
        </div>
      </aside>

      {/* 后台内容（路由出口） */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </motion.div>
  );
};

export default AdminLayout;
