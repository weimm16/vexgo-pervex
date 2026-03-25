import { motion } from 'framer-motion';

// 个人设置页 - 基础骨架（简化版）
const Profile = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6 bg-white dark:bg-dark/80 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold text-primary mb-6">个人设置</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            邮箱
          </label>
          <input
            type="email"
            defaultValue="admin@example.com"
            disabled
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-100 dark:bg-dark/90 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            新密码
          </label>
          <input
            type="password"
            placeholder="请输入新密码（留空则不修改）"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-dark/90"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            确认新密码
          </label>
          <input
            type="password"
            placeholder="再次输入新密码"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-dark/90"
          />
        </div>
        <button
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          保存修改
        </button>
      </div>
    </motion.div>
  );
};

export default Profile;
