import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import RNFS from 'react-native-fs';
import axios from 'axios';
import { GetToken } from '../../tokenData/GetToken'; //토큰 불러오기

const GeneralAnalysis = ( {selectedFile, opAge_range} ) => {
    const [tokens, setTokens] = useState(''); //토큰 저장
    const analysisType = false;

    //토큰 불러오기
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
    }, []);

    const handleGeneralAnalysis = async() => {
        if (selectedFile === undefined) {
            Alert.alert(
                "안내",
                "파일이 선택되지 않았습니다.",
            );
        }
        else {
            // 파일내용 추출
            // const fileContent = await readFileContent(selectedFile.uri);

            //formData 객체 생성
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('opAge_range', opAge_range);
            formData.append('analysisType ', analysisType);

            console.log('FormData 내용:', tokens.access_token);

            // 서버로 파일 전송
            axios.post('http://35.216.126.98:8080/api/upload/analyze/text', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${tokens.access_token}`
            }
            })
            .then(response => {
                console.log('Success:', response);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        };
    };

    //파일 내용 추출
    const readFileContent = async (uri) => {
        try {
          const fileContent = await RNFS.readFile(uri, 'utf8');
          return fileContent;
        } catch (error) {
          console.error('Error reading file:', error);
        }
    };

    return (
        <TouchableOpacity 
            style={{
                backgroundColor: '#8493A8',
                alignItems: 'center',
                padding: 10,
                width: '80%',
                margin: 10,
                borderRadius: 10,
                borderWidth: 1,
            }} onPress={handleGeneralAnalysis}>
            <Text style={{color: 'white', fontSize: 20,}}>일반 분석</Text>
        </TouchableOpacity>
    );
};

export default GeneralAnalysis;