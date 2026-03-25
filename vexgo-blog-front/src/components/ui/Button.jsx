import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  className = '',
  disabled = false
}) => {
  // 样式映射
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-secondary text-white hover:bg-secondary/90',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    outline: 'border border-primary text-primary hover:bg-primary/10',
  };

  const sizeStyles = {
    sm: 'px-3 py-1 text-sm rounded',
    md: 'px-4 py-2 text-base rounded-md',
    lg: 'px-6 py-3 text-lg rounded-lg',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variantStyles[variant]} ${sizeStyles[size]} ${className} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;
