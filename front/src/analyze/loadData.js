import {getDetail, getHistory} from '../../API';

const loadDatail = async historyKey => {
  try {
    const result = await getDetail(historyKey);
    console.log('loadDetail:', result);
    return result;
  } catch (error) {
    console.error('Error getDetail data:', error);
  }
};
const loadList = async () => {
  try {
    const result = await getHistory();
    return result;
  } catch (error) {
    console.error('Error load data:', error);
  }
};

export {loadDatail, loadList};
