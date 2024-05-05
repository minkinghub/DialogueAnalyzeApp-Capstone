import axios from "axios";
import { useState, useEffect } from "react";
import { GetToken } from "../../component/tokenData/GetToken";

const loadData = (historyKey) => {
    const [tokens, setTokens] = useState(''); //토큰 저장
    const isHistoryKey = '663634701e6c5c47cf4b5368'
    //토큰 불러오기
    const fetchDataFromAPI = async () => {
        try {

            const response = await axios.post(
                'http://35.216.126.98:8080/api/user/history/detail',
                isHistoryKey,
                {
                    headers: {
                        Authorization: `Bearer ${tokens}`
                    }
                }
            );

            setResponseData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
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
    }, []);

}
export default loadData;