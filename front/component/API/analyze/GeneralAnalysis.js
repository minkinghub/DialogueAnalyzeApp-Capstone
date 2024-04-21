import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import RNFS from 'react-native-fs';

const GeneralAnalysis = ( {selectedFile} ) => {

    const handleGeneralAnalysis = async() => {
        if (selectedFile === undefined) {
            Alert.alert(
                "안내",
                "파일이 선택되지 않았습니다.",
            );
        }
        else {
            // API 로직 구현
            console.log("예절 분석 - ",selectedFile);
            const fileContent = await readFileContent(selectedFile.uri);
            console.log("파일 내용 \n",fileContent);
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