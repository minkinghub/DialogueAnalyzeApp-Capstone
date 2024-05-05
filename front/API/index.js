import {axiosAuthApi} from './instance';

const getDetail = async historyKey => {
  const response = await axiosAuthApi.post(
    'user/history/detail',
    historyKey,
    {},
  );
  return response.data;
};

const getHistory = async () => {
  const response = await axiosAuthApi.get('user/history', {});
  return response.data;
};

const uploadFile = async formData => {
  const response = await axiosAuthApi.post('upload/analyze/text', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

export {getDetail, getHistory, uploadFile};
