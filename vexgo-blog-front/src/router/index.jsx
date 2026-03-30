import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import ErrorBoundary from '../components/ErrorBoundary';
import FrontLayout from '../components/layout/FrontLayout';
import AdminLayout from '../components/layout/AdminLayout';

// 前台页面
import Home from '../pages/front/Home';
import ArticleDetail from '../pages/front/ArticleDetail';
import About from '../pages/front/About';

// 后台页面
import Login from '../pages/admin/Login';
import ArticleList from '../pages/admin/ArticleList';
import ArticleEdit from '../pages/admin/ArticleEdit';
import Profile from '../pages/admin/Profile';

// 后台路由守卫
const AdminGuard = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center h-screen">加载中...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  return children;
};

// 总路由
const router = createBrowserRouter([
  // 前台路由
  {
    path: '/',
    element: <FrontLayout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'article/:id', element: <ArticleDetail /> },
      { path: 'about', element: <About /> },
    ],
  },
  // 后台路由
  {
    path: '/admin/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: (
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    ),
    children: [
      { path: '', element: <Navigate to="/admin/articles" replace /> },
      { path: 'articles', element: <ErrorBoundary><ArticleList /></ErrorBoundary> },
      { path: 'articles/edit/:id?', element: <ErrorBoundary><ArticleEdit /></ErrorBoundary> },
      { path: 'profile', element: <ErrorBoundary><Profile /></ErrorBoundary> },
    ],
  },
  // 404
  { path: '*', element: <Navigate to="/" replace /> },
]);

// 路由入口（包裹AuthProvider）
const AppRouter = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default AppRouter;
