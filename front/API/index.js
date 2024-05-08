import {useEffect} from 'react';
import {axiosAuthApi} from './instance';
const API = () => {
  const [historyKey, sethistoryKey] = useState('');

  useEffect(() => {
    const fetchData = async () => {};
    fetchData();
  }, []);

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
    if (historyKey) {
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
    sethistoryKey(response.data.historyKey);
    return response;
  };
};
export {getDetail, getHistory, uploadFile};
