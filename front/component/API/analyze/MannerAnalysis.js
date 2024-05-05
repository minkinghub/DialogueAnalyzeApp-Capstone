import { TouchableOpacity, Text, Alert } from 'react-native';
import { uploadFile } from '../../../API';


const MannerAnalysis = ( {selectedFile, opAge_range} ) => {
    const analysisType = true;

    //formData 객체 생성
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('opAge_range', opAge_range);
    formData.append('analysisType ', analysisType);

    const handleMannerAnalysis = async () => {
        if (selectedFile === undefined) {
            Alert.alert(
                "안내",
                "파일이 선택되지 않았습니다.",
            );
        }
        else {

            // 서버로 파일 전송
            // axios.post('http://35.216.126.98:8080/api/upload/analyze/text', formData, {
            // headers: {
            //     'Content-Type': 'multipart/form-data',
            //     'Authorization': `Bearer ${tokens.access_token}`
            // }
            // })
            // .then(response => {
            //     console.log('Success:', response);
            // })
            // .catch(error => {
            //     console.error('Error:', error);
            //     if (error.response) {
            //         console.error('Error status:', error.response.status);
            //         console.error('Error data:', error.response.data);
            //     } else {
            //         console.error('Error information is not available.');
            //     }
            // });
            uploadFile(formData).then(res => {
                console.log('File upload server response:', res.data);
            }).catch(error => {
                console.error('Error during upload:', error);
            });
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