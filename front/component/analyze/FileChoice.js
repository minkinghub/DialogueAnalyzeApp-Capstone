import React, {useState, useEffect} from 'react';
import { TouchableOpacity, Text, Alert, ScrollView } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {useContext} from 'react';
import ThemeContext from '../../src/ThemeContext';
import { darkTheme, lightTheme } from '../../src/myPage/theme/theme.styles';


const FileChoice = ( {onFileSelected} ) => {
    const DarkMode = useContext(ThemeContext);
    const isDarkMode = DarkMode.isDarkMode;
    const theme = isDarkMode ? darkTheme : lightTheme;
    const [selectedFile, setSelectedFile] = useState('');

    const fileChoice = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            setSelectedFile(res);

            //파일 검사
            const isTxtFile = res[0].type === 'text/plain' || res[0].name.endsWith('.txt');
            const isAudioFile = res[0].type.startsWith('audio/') || res[0].name.endsWith('.mp3') || res[0].name.endsWith('.wav');

            if (isTxtFile) {
                // 텍스트 파일이 선택 되었을 경우
                res[1] = true; //dataType = true
                onFileSelected(res);
            } else if (isAudioFile) {
                // 음성 파일이 선택 되었을 경우
                res[1] = false; //dataType = false
                onFileSelected(res);
            } else {
                Alert.alert("안내", "텍스트 또는 음성 파일만 선택해주세요.");
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
            height: '10%',
            width: '90%',
            marginTop: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: theme.borderColor,
            padding: 10,
            }} onPress={fileChoice}
        >
            <ScrollView
                horizontal
                contentContainerStyle={{ alignItems: 'center' }}
                showsHorizontalScrollIndicator={true}
            >
                <Text style={{color: theme.textColor, fontSize: 17}}>
                {selectedFile
                    ? '선택한 파일 : ' + selectedFile[0].name
                    : '선택한 파일 없음'}
                </Text>
            </ScrollView>
        </TouchableOpacity>
    );
};

export default FileChoice;