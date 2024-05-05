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

export {getDetail, getHistory};
