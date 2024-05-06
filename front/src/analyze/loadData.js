import {useEffect, useState} from 'react';
import {getDetail} from '../../API';
import {useTheme} from '../ThemeContext';

const historyKey = '66377d64879a1a77270b4e76';

const loadData = async () => {
  //   const {historyKey} = useTheme();
  try {
    const result = await getDetail(historyKey);
    return result.detailList;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
export default loadData;
