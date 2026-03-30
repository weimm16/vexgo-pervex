import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createArticle, getArticleDetail, updateArticle, uploadFile } from '../../api/articleApi';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';

const ArticleEdit = () => {
  const { id } = useParams(); // 编辑时存在id，新增时无
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id); // 编辑时先加载文章详情
  const [submitLoading, setSubmitLoading] = useState(false);
  const [coverImage, setCoverImage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const contentRef = useRef(null);

  // 表单配置
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      content: '',
      summary: '',
      category: '',
      tags: [],
      status: 'draft',
      coverImage: '',
    },
  });

  const contentRegister = register('content', { required: '内容不能为空' });

  // 加载文章详情（编辑模式）
  useEffect(() => {
    if (id) {
      const fetchArticle = async () => {
        try {
          const res = await getArticleDetail(id);
          // 后端返回的是 {"post": post} 结构
          const article = res.data?.post || res.data;
          const { title, content, excerpt, category, tags, status } = article;
          setValue('title', title || '');
          setValue('content', content || '');
          setValue('summary', excerpt || ''); // 注意：后端返回的是 excerpt，前端用 summary
          setValue('category', category || '');
          setValue('tags', tags ? tags.map(tag => tag.name || tag) : []);
          setValue('coverImage', article.coverImage || '');
          setCoverImage(article.coverImage || '');
          // 同时设置标签输入框的显示值
          const tagsString = tags ? tags.map(tag => tag.name || tag).join(', ') : '';
          // 这里需要手动设置输入框的值，因为 register 不会自动更新显示
          setTimeout(() => {
            const tagsInput = document.querySelector('input[name="tags"]');
            if (tagsInput) {
              tagsInput.value = tagsString;
            }
          }, 0);
          setValue('status', status || 'draft');
          console.log('加载文章详情:', article);
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

  // 处理封面上传
  const handleCoverUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      return alert('封面图片不能超过10MB');
    }

    try {
      setUploadProgress(0);
      const res = await uploadFile(file, (progress) => setUploadProgress(progress));
      const url = res.data?.file?.url;
      if (!url) throw new Error('上传失败，未返回 URL');
      setCoverImage(url);
      setValue('coverImage', url);
      alert('封面上传成功');
    } catch (error) {
      console.error('封面上传失败：', error);
      alert('封面上传失败，请重试');
    } finally {
      setUploadProgress(0);
    }
  };

  // 插入行内图片
  const handleInsertImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('图片不能超过10MB');
      return;
    }

    try {
      const res = await uploadFile(file);
      const url = res.data?.file?.url;
      if (!url) throw new Error('上传失败');
      const currentContent = watch('content') || '';
      const textarea = contentRef.current;
      const start = textarea?.selectionStart ?? currentContent.length;
      const end = textarea?.selectionEnd ?? currentContent.length;
      const insertMarkdown = `\n![插图](${url})\n`;
      const newContent = `${currentContent.slice(0, start)}${insertMarkdown}${currentContent.slice(end)}`;
      setValue('content', newContent);
      setTimeout(() => {
        if (textarea) {
          textarea.focus();
          textarea.selectionStart = textarea.selectionEnd = start + insertMarkdown.length;
        }
      }, 0);
      alert('图片插入成功');
    } catch (error) {
      console.error('插入图片失败：', error);
      alert('插入图片失败，请重试');
    }
  };

  // 提交表单
  const onSubmit = async (data) => {
    try {
      setSubmitLoading(true);
      // 转换字段名以匹配后端期望
      // 确保 tags 是数组格式
      let tagsArray = [];
      if (Array.isArray(data.tags)) {
        tagsArray = data.tags;
      } else if (typeof data.tags === 'string' && data.tags.trim()) {
        tagsArray = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }
      
      const payload = {
        title: data.title,
        content: data.content,
        category: data.category || 'uncategorized',
        excerpt: data.summary,
        coverImage: coverImage || data.coverImage || '',
        tags: tagsArray,
        status: data.status || 'draft',
      };
      console.log('提交数据:', payload);

      if (id) {
        // 编辑
        await updateArticle(id, payload);
        alert('文章编辑成功！');
        navigate('/admin/articles');
      } else {
        // 新增
        await createArticle(payload);
        const continueCreate = window.confirm('文章发布成功！是否继续创作新文章？');
        if (continueCreate) {
          // 保持在创作页，重置表单
          setValue('title', '');
          setValue('content', '');
          setValue('summary', '');
          setValue('category', '');
          setValue('tags', []);
          setValue('status', 'draft');
        } else {
          navigate('/admin/articles');
        }
      }
    } catch (error) {
      console.error('提交失败，错误详情：', error);
      console.error('响应状态码:', error.response?.status);
      console.error('响应数据:', error.response?.data);
      alert('提交失败：' + (error.response?.data?.message || error.response?.data?.error || error.message || '未知错误'));
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

        {/* 分类 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            文章分类 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register('category', { required: '分类不能为空' })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-dark/80"
            placeholder="请输入分类名称，如：技术、生活等"
          />
          {errors.category && (
            <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
          )}
        </div>

        {/* 封面图片 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            封面图片
          </label>
          <div className="flex flex-col md:flex-row gap-3 items-start">
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-white dark:bg-dark/80"
            />
            {coverImage && (
              <img src={coverImage} alt="封面预览" className="h-24 w-36 object-cover rounded-md border border-gray-200 dark:border-gray-700" />
            )}
          </div>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-2 text-sm text-gray-500">上传进度：{uploadProgress}%</div>
          )}
        </div>

        {/* 标签 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            文章标签
          </label>
          <input
            type="text"
            {...register('tags')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 dark:bg-dark/80"
            placeholder="请输入标签，用逗号分隔，如：React,JavaScript,前端"
            onChange={(e) => {
              // 将逗号分隔的字符串转换为数组
              const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
              setValue('tags', tagsArray);
            }}
            onBlur={(e) => {
              // 确保失去焦点时也是数组格式
              const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
              setValue('tags', tagsArray);
            }}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">多个标签请用逗号分隔</p>
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
          <div className="flex items-center gap-2 mb-2">
            <button
              type="button"
              onClick={() => document.getElementById('insertImageInput')?.click()}
              className="px-3 py-1 bg-primary text-white rounded-md hover:bg-primary/90"
            >插入图片</button>
            <span className="text-xs text-gray-500">会插入 Markdown 语法到当前光标位置</span>
          </div>
          <input
            id="insertImageInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInsertImage}
          />
          <textarea
            {...contentRegister}
            rows={15}
            ref={(e) => {
              contentRegister.ref(e);
              contentRef.current = e;
            }}
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
