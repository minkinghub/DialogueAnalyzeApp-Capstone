import {getDetail, getHistory} from './getAPI';

const loadDatail = async historyKey => {
  try {
    const result = await getDetail(historyKey);
    // console.log('loadDetail:', result);
    return result;
    //예절분석: result.detailList
    //타입분석: result.conversationType
  } catch (error) {
    console.error('Error getDetail result:', error);
  }
};
const loadList = async () => {
  try {
    const result = await getHistory();
    return result;
  } catch (error) {
    console.error('Error loadList result:', error);
  }
};

export {loadDatail, loadList};
