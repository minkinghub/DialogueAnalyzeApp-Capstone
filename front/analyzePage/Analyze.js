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
  const [dataType, setDataType] = useState(''); //데이터 타입 true/false

  const [selectedFile, setSelectedFile] = useState(null); //선택 파일
  const [mannerFileSend, setMannerFileSend] = useState(false); //예절분석 동작
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

  const resetFile = () => {
    setSelectedFile(null);
    setDataType('');
  }

  //선택 파일, 분석 동작 초기화
  const resetMannerFileSend = () => {
    setMannerFileSend(false);
  }

  //선택 파일 저장
  const fileSelected = res => {
    setSelectedFile(res[0]);
    setDataType(res[1]);
  };

  //대화분석 버튼
  const handleMannerAnalysis = (selectedFile) => {
    if (selectedFile === null) {
      Alert.alert('안내', '파일이 선택되지 않았습니다.');
    } else {
      setMannerFileSend(true);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {mannerFileSend && <FileSendServer selectedFile={selectedFile} onCompleted={resetMannerFileSend} resetFile={resetFile}/>}

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
          
        <FileChoice onFileSelected={fileSelected} />

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '70%',
            width: '100%',
          }}>
          <View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.backgroundColor,
                width: '80%',
                height: '90%',
                borderRadius: 15,
                borderWidth: 2,
                borderColor: theme.borderColor
            }}
        >
            <Text style={{color: theme.textColor, fontSize: 15}}>내용 미리보기</Text>
          </View>
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
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
              height: '50%',
              width: '80%',
              borderRadius: 10,
              borderWidth: 1,
            }}
            onPress={() => handleMannerAnalysis(selectedFile)}>
            <Text style={{color: 'white', fontSize: 22}}>대화 분석</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Analyze;
