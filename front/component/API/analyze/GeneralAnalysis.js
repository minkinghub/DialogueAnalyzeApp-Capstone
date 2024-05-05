import { TouchableOpacity, Text, Alert } from 'react-native';
import { uploadFile } from '../../../API';
import { Etiquette } from '../../../src/analyze';

const GeneralAnalysis = ( {selectedFile, opAge_range} ) => {
    const analysisType = false;

    //formData 객체 생성
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('opAge_range', opAge_range);
    formData.append('analysisType ', analysisType);

    const handleGeneralAnalysis = async() => {
        if (selectedFile === undefined) {
            Alert.alert(
                "안내",
                "파일이 선택되지 않았습니다.",
            );
        }
        else {
            // 서버로 파일 전송
            uploadFile(formData).then(res => {
                console.log('File upload server response:', res.data);
                Etiquette(res.data);
            }).catch(error => {
                console.error('Error during upload:', error);
            });
            
        };
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
            }} onPress={handleGeneralAnalysis}>
            <Text style={{color: 'white', fontSize: 20,}}>타입 분석</Text>
        </TouchableOpacity>
    );
};

export default GeneralAnalysis;