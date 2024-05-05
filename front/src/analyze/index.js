import Category from './category';
import Etiquette from './etiquette';
import activity from './activity';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {GetToken} from '../../component/tokenData/GetToken';

// 분석 결과가 etiqutte인지 category인지에 따라 다른 페이지로 이동
//historyKey: 분석 결과 문서 키값
const analyze = historyKey => {
  const [isLoading, setLoading] = useState(true); // 로딩중이면 true
  const [isCategory, setCategory] = useState(true); // 타입분석이면 true
  isLoading ? activity() : isCategory ? <Category /> : <Etiquette />;
};
// export default analyze;
export {Category, Etiquette};
