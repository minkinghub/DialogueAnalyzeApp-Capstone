import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import RNFS from 'react-native-fs';
import axios from 'axios';
import { GetToken } from '../../tokenData/GetToken'; //토큰 불러오기

const MannerAnalysis = ( {selectedFile, opAge_range} ) => {
    const [tokens, setTokens] = useState(''); //토큰 불러오기
    const analysisType = true;

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

    const handleMannerAnalysis = async () => {
        if (selectedFile === undefined) {
            Alert.alert(
                "안내",
                "파일이 선택되지 않았습니다.",
            );
        }
        else {

            //formData 객체 생성
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('opAge_range', opAge_range);
            formData.append('analysisType ', analysisType);

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
                console.error('Error status:', error.response.status);
                console.error('Error data:', error.response.data);
            });
        }
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
                backgroundColor: '#DDA0DD',
                alignItems: 'center',
                padding: 10,
                width: '80%',
                margin: 10,
                borderRadius: 10,
                borderWidth: 1,
            }} onPress={handleMannerAnalysis}>
            <Text style={{color: 'white', fontSize: 20,}}>예절 분석</Text>
        </TouchableOpacity>
    );
};

export default MannerAnalysis;