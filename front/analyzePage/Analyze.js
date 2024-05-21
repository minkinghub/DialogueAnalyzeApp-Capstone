import React, {useState, useEffect} from 'react';
import {View, Text, SafeAreaView, TouchableOpacity, Alert, Modal, TextInput, ScrollView} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { GetToken } from '../component/tokenData/GetToken'; //전역관리 토큰 호출
import GenDateToServer from '../component/API/GenDateToServer'; //성별, 생년월일 서버연동
import {useContext} from 'react';
import ThemeContext from '../src/ThemeContext';
import FileChoice from '../component/analyze/FileChoice'; //파일 선택 컴포넌트 경로
import {darkTheme, lightTheme} from '../src/myPage/theme/theme.styles'; //테마 변경
import FileSendServer from '../component/API/analyze/FileSendServer';

const Analyze = () => {
  const [modalVisible, setModalVisible] = useState(false); //modal 표시여부
  const [isFirst, setIsFirst] = useState(''); //토큰 저장
  const [gender, setGender] = useState('true'); //성별
  const [birthYear, setBirthYear] = useState(''); //생년
  const [birthMonth, setBirthMonth] = useState(''); //생월
  const [birthDay, setBirthDay] = useState(''); //생일

  const [selectedFile, setSelectedFile] = useState(null); //선택 파일
  const [mannerFileSend, setMannerFileSend] = useState(false); //예절분석 동작
  const [generalFileSend, setGeneralFileSend] = useState(false); //타입분석 동작
  const [opAge_range, setOpAge_range] = useState('20'); //상대방 나이 지정
  const DarkMode = useContext(ThemeContext);
  const isDarkMode = DarkMode.isDarkMode; //테마 설정
  const theme = isDarkMode ? darkTheme : lightTheme;

  //isFirst 호출
  useEffect(() => {
    const checkIsFirst = async () => {
        const loadedTokens = await GetToken();
        if (loadedTokens) {
            setIsFirst(loadedTokens);
        } else {
            console.log('No tokens were loaded');
        }
    };

    checkIsFirst();
  }, []);

  //isFIrst: ture일 경우 모달 출력
  useEffect(() => {
    if(isFirst.isFirst === "true"){
      setModalVisible(true);
    }
  }, [isFirst.isFirst]);

  //성별, 생년월일 입력 모달
  const handleComplete = () => {
        
    if(birthYear && birthMonth && birthDay !== ''){
        console.log("Selected Gender: ", gender); 
        setModalVisible(!modalVisible);
        const formattedDate = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;
        
        GenDateToServer(gender, formattedDate, isFirst.access_token);
    }
    else Alert.alert("안내", "생년월일을 입력해 주세요.");
  };

  //선택 파일, 분석 동작 초기화
  const resetMannerFileSend = () => {
    setMannerFileSend(false);
    setSelectedFile(null);
  }
  const resetGeneralFileSend = () => {
    setGeneralFileSend(false);
    setSelectedFile(null);
  }

  //선택 파일 저장
  const fileSelected = file => {
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

      <Modal
          transparent={true} // 배경을 투명하게 할 것인지
          visible={modalVisible} // 모달의 표시 여부
      >
          <View style={{
                  margin: 20,
                  backgroundColor: theme.backgroundColor,
                  borderRadius: 20,
                  padding: 30,
                  alignItems: "center",
                  justifyContent: 'center',
                  elevation: 10
              }}>

              <Text style={{marginBottom: 10, textAlign: "center", fontSize: 20, color: theme.textColor}}>처음이신가요?</Text>
              <Text style={{textAlign: "center", color: theme.textColor}}>정확한 분석을 위해 당신의 성별과</Text>
              <Text style={{marginBottom: 15, textAlign: "center", color: theme.textColor}}>생년월일을 입력해 주세요.</Text>

              <View style={{flexDirection: 'row', marginBottom: 20,}}>
                  <TouchableOpacity
                      style={{marginHorizontal: 10, alignItems: 'center'}}
                      onPress={() => setGender('true')}
                  >
                      <Text style={{fontSize: 16, color: theme.textColor}}>
                          {gender === 'true' ? '🔘 남성' : '⚪ 남성'}
                      </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={{marginHorizontal: 10, alignItems: 'center'}}
                      onPress={() => setGender('false')}
                  >
                      <Text style={{fontSize: 16, color: theme.textColor}}>
                          {gender === 'false' ? '🔘 여성' : '⚪ 여성'}
                      </Text>
                  </TouchableOpacity>
              </View>
              
              <View style={{ flexDirection: 'row', marginBottom: 20,justifyContent: 'center', alignItems: 'center' }}>
                  <TextInput
                      style={{
                          height: 40,
                          borderColor: 'gray',
                          borderWidth: 1,
                          borderRadius: 5,
                          width: '30%',
                          textAlign: 'center',
                      }}
                      placeholder="YYYY"
                      placeholderTextColor="gray"
                      keyboardType="numeric"
                      value={birthYear}
                      onChangeText={setBirthYear}
                  />
                  <Text style={{fontSize: 15, color: theme.textColor}}>년</Text>
                  <TextInput
                      style={{
                          height: 40,
                          borderColor: 'gray',
                          borderWidth: 1,
                          borderRadius: 5,
                          width: '25%',
                          textAlign: 'center',
                          marginHorizontal: 5,
                      }}
                      placeholder="MM"
                      placeholderTextColor="gray"
                      keyboardType="numeric"
                      value={birthMonth}
                      onChangeText={setBirthMonth}
                  />
                  <Text style={{fontSize: 15, color: theme.textColor}}>월</Text>
                  <TextInput
                      style={{
                          height: 40,
                          borderColor: 'gray',
                          borderWidth: 1,
                          borderRadius: 5,
                          width: '25%',
                          textAlign: 'center',
                      }}
                      placeholder="DD"
                      placeholderTextColor="gray"
                      keyboardType="numeric"
                      value={birthDay}
                      onChangeText={setBirthDay}
                  />
                  <Text style={{fontSize: 15, color: theme.textColor}}>일</Text>
              </View>

              <TouchableOpacity 
                  style={{
                      backgroundColor: '#f2cd79',
                      alignItems: 'center',
                      padding: 10,
                      width: '80%',
                      borderRadius: 10,
                  }} onPress={handleComplete}>
                  <Text style={{color: '#0d3286', fontSize: 15,}}>완료</Text>
              </TouchableOpacity>
          </View>
      </Modal>

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
            marginTop: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.borderColor,
            padding: 10,
          }}>
            <ScrollView
              horizontal
              contentContainerStyle={{ alignItems: 'center' }}
              showsHorizontalScrollIndicator={true}
            >
              <Text style={{color: theme.textColor, fontSize: 17}}>
                {selectedFile
                  ? '선택한 파일 : ' + selectedFile.name
                  : '선택한 파일 없음'}
              </Text>
            </ScrollView>
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
            height: '60%',
            width: '100%',
          }}>
          <FileChoice onFileSelected={fileSelected} />
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '25%',
            width: '100%',
          }}>

          <TouchableOpacity
            style={{
              backgroundColor: '#DDA0DD',
              alignItems: 'center',
              padding: 10,
              width: '80%',
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
