import {axiosAuthApi} from './instance';
import {useState} from 'react';

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
    console.log('response.data:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error getDetail data:', error);
  }
};

const getHistory = async () => {
  const response = await axiosAuthApi.post('user/history', {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  console.log('response.data:', response.data);
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
