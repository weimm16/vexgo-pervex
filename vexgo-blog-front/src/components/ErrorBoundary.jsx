import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('应用错误：', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">😵</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              页面出错了
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              抱歉，页面加载时出现了问题。这可能是暂时的，请尝试刷新页面。
            </p>
            <div className="space-y-3">
              <button 
                onClick={this.handleRetry}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
              >
                刷新页面
              </button>
              <button 
                onClick={() => window.history.back()}
                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                返回上一页
              </button>
            </div>
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400">
                错误详情（开发者可见）
              </summary>
              <pre className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs rounded overflow-auto max-h-32">
                {this.state.error?.toString() || '未知错误'}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;