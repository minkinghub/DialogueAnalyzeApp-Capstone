import React from 'react';
import { TouchableOpacity, Text, Alert, Image } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {useContext} from 'react';
import ThemeContext from '../../src/ThemeContext';
import { darkTheme, lightTheme } from '../../src/myPage/theme/theme.styles';


const FileChoice = ( {onFileSelected} ) => {
    const DarkMode = useContext(ThemeContext);
    const isDarkMode = DarkMode.isDarkMode;
    const theme = isDarkMode ? darkTheme : lightTheme;

    const fileChoice = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            onFileSelected(res);

            //파일 검사
            const isTxtFile = res[0].type === 'text/plain' || res[0].name.endsWith('.txt');

            if (isTxtFile) {
                //파일이 선택 되었을 경우 반환
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
                backgroundColor: theme.backgroundColor,
                width: '80%',
                height: '90%',
                borderRadius: 15,
                borderWidth: 1.5,
                borderColor: theme.borderColor
            }}
            onPress={fileChoice}
        >
            <Text style={{color: theme.textColor, fontSize: 15}}>터치 하여</Text>
            <Text style={{color: theme.textColor, fontSize: 15}}>텍스트 파일 선택</Text>
        </TouchableOpacity>
    );
};

export default FileChoice;