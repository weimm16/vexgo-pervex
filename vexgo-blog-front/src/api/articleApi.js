import axiosInstance from './axios';

// 文章列表（前台/后台）
export const getArticleList = (params = { page: 1, size: 10 }) => {
  return axiosInstance.get('/posts', { params });
};

// 文章详情
export const getArticleDetail = (id) => {
  return axiosInstance.get(`/posts/${id}`);
};

// 新增文章
export const createArticle = (data) => {
  return axiosInstance.post('/posts', data);
};

// 编辑文章
export const updateArticle = (id, data) => {
  return axiosInstance.put(`/posts/${id}`, data);
};

// 删除文章
export const deleteArticle = (id) => {
  return axiosInstance.delete(`/posts/${id}`);
};

// 上传封面/内容图片
export const uploadFile = (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  return axiosInstance.post('/upload/file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
      }
    },
  });
};

// 登录（获取JWT）
export const login = (data) => {
  return axiosInstance.post('/auth/login', data);
};