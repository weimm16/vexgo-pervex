import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

// 后台登录页 - 基础骨架
const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  // 提交登录
  const onSubmit = async (data) => {
    const res = await login({
      email: data.email,
      password: data.password
    });
    if (res.success) {
      navigate('/admin/articles');
    } else {
      alert(res.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark px-4"
    >
      <div className="w-full max-w-md bg-white dark:bg-dark/80 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-primary mb-6">博客管理后台</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* 邮箱 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              邮箱
            </label>
            <input
              type="email"
              {...register('email', { required: '邮箱不能为空' })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-dark/90"
              placeholder="admin@example.com"
              defaultValue="admin@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* 密码 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              密码
            </label>
            <input
              type="password"
              {...register('password', { required: '密码不能为空' })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-dark/90"
              placeholder="password"
              defaultValue="password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* 登录按钮 */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default Login;
