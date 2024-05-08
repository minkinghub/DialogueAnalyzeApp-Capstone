import {useEffect, useState} from 'react';
import {getDetail} from '../../API';
import {useTheme} from '../ThemeContext';

// const historyKey = '66377d64879a1a77270b4e76';

const loadDatail = async () => {
  const {historyKey} = useTheme();
  try {
    const result = await getDetail(historyKey);
    return result.detailList;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
const loadList = async () => {
  //   const {historyKey} = useTheme();
  try {
    const result = await getHistory();
    return result;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export {loadDatail, loadList};
