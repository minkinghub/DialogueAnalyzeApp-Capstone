import React from 'react';
import { TouchableOpacity, Text, Alert, Image } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

const FileChoice = ( {onFileSelected} ) => {

    const fileChoice = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            onFileSelected(res);
            //파일 검사
            const isTxtFile = res[0].type === 'text/plain' || res[0].name.endsWith('.txt');

            if (isTxtFile) {
                onFileSelected(res);
            } else {
                Alert.alert("안내", "텍스트 파일만 선택해주세요.");
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                //파일 선택 취소
            } else {
                Alert.alert('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
    };

    return (
        <TouchableOpacity
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                width: '80%',
                height: '90%',
                borderRadius: 15,
                borderWidth: 1.5,
            }}
            onPress={fileChoice}
        >
            <Text>텍스트 파일 선택</Text>
            <Image style={{height: 70, width: 70}} source={require('../../assets/images/plus_icon.jpg')}/>
        </TouchableOpacity>
    );
};

export default FileChoice;