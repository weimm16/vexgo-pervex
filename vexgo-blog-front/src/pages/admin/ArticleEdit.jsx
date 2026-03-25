import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createArticle, getArticleDetail, updateArticle } from '../../api/articleApi';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';

const ArticleEdit = () => {
  const { id } = useParams(); // 编辑时存在id，新增时无
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id); // 编辑时先加载文章详情
  const [submitLoading, setSubmitLoading] = useState(false);

  // 表单配置
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      content: '',
      summary: '',
    },
  });

  // 加载文章详情（编辑模式）
  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        try {
          const res = await getArticleDetail(id);
          const { title, content, summary } = res.data;
          setValue('title', title);
          setValue('content', content);
          setValue('summary', summary);
        } catch (error) {
          console.error('加载文章失败：', error);
          alert('加载文章失败，将返回列表');
          navigate('/admin/articles');
        } finally {
          setLoading(false);
        }
      };
      fetchArticle();
    } else {
      setLoading(false);
    }
  }, [id, setValue, navigate]);

  // 提交表单
  const onSubmit = async (data) => {
    try {
      setSubmitLoading(true);
      if (id) {
        // 编辑
        await updateArticle(id, data);
        alert('文章编辑成功！');
      } else {
        // 新增
        await createArticle(data);
        alert('文章发布成功！');
      }
      navigate('/admin/articles');
    } catch (error) {
      console.error('提交失败：', error);
      alert('提交失败：' + (error.response?.data?.message || '未知错误'));
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold text-primary mb-6">
        {id ? '编辑文章' : '新增文章'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 标题 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            文章标题 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('title', { required: '标题不能为空' })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-dark/80"
            placeholder="请输入文章标题"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        {/* 摘要 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            文章摘要
          </label>
          <textarea
            {...register('summary')}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-dark/80"
            placeholder="请输入文章摘要（选填）"
          ></textarea>
        </div>

        {/* 内容（Markdown） */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            文章内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('content', { required: '内容不能为空' })}
            rows={15}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-dark/80 font-mono text-sm"
            placeholder="请输入Markdown格式的文章内容"
          ></textarea>
          {errors.content && (
            <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex space-x-4">
          <Button 
            type="submit" 
            variant="primary"
            disabled={submitLoading}
          >
            {submitLoading ? '提交中...' : (id ? '保存修改' : '发布文章')}
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/admin/articles')}
            disabled={submitLoading}
          >
            返回列表
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ArticleEdit;
