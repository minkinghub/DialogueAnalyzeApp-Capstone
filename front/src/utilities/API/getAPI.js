import {axiosAuthApi} from './instance';

const getDetail = async historyKey => {
  try {
    const response = await axiosAuthApi.post(
      'user/history/detail',
      {historyKey: historyKey},
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    // console.log('response.data:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error getDetail data:', error);
  }
  if (historyKey) {
  }
};

const getHistory = async () => {
  const response = await axiosAuthApi.post('user/history/list', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  // console.log('response.data:', response.data);
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
