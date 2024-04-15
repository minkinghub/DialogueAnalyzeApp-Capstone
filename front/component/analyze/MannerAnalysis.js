import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';

const MannerAnalysis = ( {selectedFile} ) => {

    const handleMannerAnalysis = () => {
        if (selectedFile === undefined) {
            Alert.alert(
                "안내",
                "파일이 선택되지 않았습니다.",
            );
        }
        else console.log(selectedFile);
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
            }} onPress={handleMannerAnalysis}>
            <Text style={{color: 'white', fontSize: 20,}}>예절 분석</Text>
        </TouchableOpacity>
    );
};

export default MannerAnalysis;