import React, { useState, useEffect } from 'react';
import {useNavigation} from '@react-navigation/native';
import {uploadFile} from '../../../API';

const FileSendServer = ({ selectedFile, opAge_range, analysisType, onCompleted }) => {
    const navigation = useNavigation(); //네비게이션 객체

    //formData 객체 생성
    // const formData = new FormData();
    // formData.append('file', selectedFile);
    // formData.append('opAge_range', opAge_range);
    // formData.append('analysisType ', analysisType);

    // 서버로 파일 전송
    // uploadFile(formData)
    // .then(res => {
    //   console.log('File upload server response:', res.data);

    //   if (analysisType === true) {
    //     navigation.navigate('Etiquette', {historyKey: res.data.historyKey});
    //     onCompleted();
    // }
    //   else {
    //     navigation.navigate('Category', {historyKey: res.data.historyKey});
    //     onCompleted();
    //   }
    // })
    // .catch(error => {
    //     if (error.response) {
    //         console.error('Error status:', error.response.status);
    //         console.error('Error data:', error.response.data);
    //     } else if (error.message) {
    //     console.error('Error message:', error.message);
    //     } else {
    //     console.error('Error info:', error);
    //     }
    //     onCompleted();
    // });

    useEffect(() => {
      const sendFile = async () => {
          // formData 객체 생성
          const formData = new FormData();
          formData.append('file', selectedFile);
          formData.append('opAge_range', opAge_range);
          formData.append('analysisType', analysisType);

          try {
              const res = await uploadFile(formData);
              console.log('File upload server response:', res.data);

              if (analysisType === true) {
                  navigation.navigate('Etiquette', { historyKey: res.data.historyKey });
              } else {
                  navigation.navigate('Category', { historyKey: res.data.historyKey });
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
              onCompleted();
          }
      };

      sendFile();
    }, []);

    return null;
}

export default FileSendServer;