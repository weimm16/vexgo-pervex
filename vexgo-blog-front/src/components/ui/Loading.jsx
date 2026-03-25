import { motion } from 'framer-motion';

// 加载动画组件
const Loading = () => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full"
    />
  );
};

export default Loading;
