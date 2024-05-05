import axios from 'axios';
import {useState, useEffect} from 'react';
import {GetToken} from '../../component/tokenData/GetToken';
import {getHistory, getDetail} from '../../API';
const loadData = () => {
  const [tokens, setTokens] = useState(''); //토큰 저장
  const [responseData, setResponseData] = useState([]); //API로 받아온 데이터 저장
  const isHistoryKey = '663634701e6c5c47cf4b5368';
  //토큰 불러오기
  const getData = {
    //detialList[] 0: 나 1: 상대방
    //detailInfo[] 0: polite 1: moral 2: grammar 3: positive
    //exmpleText[] 0~1
    // const Score[0] = responseData.detailList[].detailInfo[].detailScore;
    // const Label[0] = responseData.detailList[화자].detailInfo[].label;
    // const ChatContent[0] = responseData.detailList[화자].detailInfo[].exmpleText[].chatContent;
  };

  const fetchDataFromAPI = async () => {
    try {
      setResponseData(getDetail(tokens, isHistoryKey));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  console.log(responseData);

  useEffect(() => {
    try {
      const loadTokens = async () => {
        const loadedTokens = await GetToken();
        if (loadedTokens) {
          setTokens(loadedTokens);
        } else {
          console.log('No tokens were loaded'); // 토큰이 없는 경우 메시지 출력
        }
      };

      loadTokens();
      // 컴포넌트가 마운트될 때 API 요청을 보냄
      fetchDataFromAPI();
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    // const loadTokens = async () => {
    //   const loadedTokens = await GetToken();
    //   if (loadedTokens) {
    //     setTokens(loadedTokens);
    //   } else {
    //     console.log('No tokens were loaded'); // 토큰이 없는 경우 메시지 출력
    //   }
    // };

    // loadTokens();
    // // 컴포넌트가 마운트될 때 API 요청을 보냄
    // fetchDataFromAPI();
  }, []);
};
export default loadData;
