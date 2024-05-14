import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Alert} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useContext} from 'react';
import ThemeContext from '../src/ThemeContext';
import FileChoice from '../component/analyze/FileChoice'; //파일 선택 컴포넌트 경로
import {darkTheme, lightTheme} from '../src/myPage/theme/theme.styles'; //테마 변경
import FileSendServer from '../component/API/analyze/FileSendServer';

const Analyze = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [mannerFileSend, setMannerFileSend] = useState(false);
  const [generalFileSend, setGeneralFileSend] = useState(false);
  const [opAge_range, setOpAge_range] = useState('20');
  const DarkMode = useContext(ThemeContext);
  const isDarkMode = DarkMode.isDarkMode;
  const theme = isDarkMode ? darkTheme : lightTheme;

  const resetMannerFileSend = () => setMannerFileSend(false);
  const resetGeneralFileSend = () => setGeneralFileSend(false);

  //파일 선택
  const fileSelected = file => {
    setMannerFileSend(false);
    setSelectedFile(file[0]);
  };

  //예절분석 버튼
  const handleMannerAnalysis = (selectedFile, opAge_range) => {
    if (selectedFile === null) {
      Alert.alert('안내', '파일이 선택되지 않았습니다.');
    } else {
      setMannerFileSend(true);
    }
  };

  //타입분석 버튼
  const handleGeneralAnalysis = (selectedFile, opAge_range) => {
    if (selectedFile === null) {
      Alert.alert('안내', '파일이 선택되지 않았습니다.');
    } else {
      setGeneralFileSend(true);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {mannerFileSend && <FileSendServer selectedFile={selectedFile} opAge_range={opAge_range} analysisType={true} onCompleted={resetMannerFileSend}/>}
      {generalFileSend && <FileSendServer selectedFile={selectedFile} opAge_range={opAge_range} analysisType={false} onCompleted={resetGeneralFileSend}/>}

      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.backgroundColor,
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '10%',
            width: '90%',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.borderColor,
          }}>
          <Text style={{color: theme.textColor}}>
            {selectedFile
              ? '선택한 파일 : ' + selectedFile.name
              : '선택한 파일 없음'}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: '5%',
            width: '90%',
          }}>
          <Text style={{fontSize: 15, color: theme.textColor}}>
            상대방 연령 선택{' '}
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 5,
              borderColor: theme.borderColor,
              height: 30,
              width: 120,
              justifyContent: 'center',
            }}>
            <Picker
              selectedValue={opAge_range}
              onValueChange={(itemValue, itemIndex) =>
                setOpAge_range(itemValue)
              }
              style={{
                height: '100%',
                width: '100%',
                color: theme.textColor,
              }}>
              <Picker.Item label="20대" value="20" />
              <Picker.Item label="30대" value="30" />
              <Picker.Item label="40대" value="40" />
              <Picker.Item label="50대 이상" value="50" />
            </Picker>
          </View>
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '65%',
            width: '100%',
          }}>
          <FileChoice onFileSelected={fileSelected} />
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '20%',
            width: '100%',
          }}>

          <TouchableOpacity
            style={{
              backgroundColor: '#DDA0DD',
              alignItems: 'center',
              padding: 10,
              width: '80%',
              margin: 10,
              borderRadius: 10,
              borderWidth: 1,
            }}
            onPress={() => handleMannerAnalysis(selectedFile, opAge_range)}>
            <Text style={{color: 'white', fontSize: 20}}>예절 분석</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: '#DDA0DD',
              alignItems: 'center',
              padding: 10,
              width: '80%',
              margin: 10,
              borderRadius: 10,
              borderWidth: 1,
            }}
            onPress={() => handleGeneralAnalysis(selectedFile, opAge_range)}>
            <Text style={{color: 'white', fontSize: 20}}>타입 분석</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Analyze;
