import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {uploadFile} from '../../../API';

const FileSendServer = ({ selectedFile, opAge_range, analysisType, onCompleted, resetFile}) => {
    const navigation = useNavigation(); //네비게이션 객체
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태

    useEffect(() => {
      const sendFile = async () => {
          // formData 객체 생성
          const formData = new FormData();
          formData.append('file', selectedFile);
          formData.append('opAge_range', opAge_range);
          formData.append('analysisType', analysisType);

          try {
            setIsLoading(true); // 로딩 시작
            console.log("분석시작");
            const res = await uploadFile(formData);
            console.log('File upload server response:', res.data);

            if (analysisType === true) {
              navigation.navigate('Etiquette', { historyKey: res.data.historyKey });
              resetFile();
            } else {
              navigation.navigate('Category', { historyKey: res.data.historyKey });
              resetFile();
            }
          } catch (error) {
              if (error.response) {
                console.error('Error status:', error.response.status);
                console.error('Error data:', error.response.data);
              } else if (error.message) {
                console.error('Error message:', error.message);
              } else {
                console.error('Error info:', error);
              }
          } finally {
            setIsLoading(false); // 로딩 끝
            onCompleted();
          }
      };

      sendFile();
    }, []);

    return (
      <View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경을 반투명하게 설정
        zIndex: 9999, // 다른 컴포넌트 위에 오도록 설정
      }}>
          {isLoading && (
            <View style={{justifyContent: 'center', alignItems: 'center',}}>
              <ActivityIndicator size="large" color="#ff0000" />
              <Text style={{color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginTop: 10,}}>분석 중입니다...</Text>
            </View>
          )}
      </View>
    )
}

export default FileSendServer;