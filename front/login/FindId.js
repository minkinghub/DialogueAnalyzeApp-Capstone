import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';
import FindIdAPI from '../component/API/FindIdAPI';
import EmailCheckAPI from '../component/API/EmailCheckAPI';

const FindId = () => {
  const [name, setName] = useState(''); //이름
  const [birthDate, setBirthDate] = useState(''); //생년월일
  const [email, setEmail] = useState(''); //이메일
  const [secureNumber, setSecureNumber] = useState('');

  const [findIdAttempted, setFindIdAttempted] = useState(false); //id찾기 버튼 클릭여부
  const [emailCheckAttempted,setEmailCheckAttempted] = useState(false); //email인증 버튼 클릭여부

  //아이디 찾기 버튼
  const handleFindId = () => {
    setFindIdAttempted(true);
  };
  //아이디 찾기 결과
  const onFindIdResult = (resultData, id) => {
    if (resultData === true) {
      Alert.alert(' ',`아이디 : ${id}`);
    } else Alert.alert(' ',`입력하신 정보에 해당하는 아이디가 존재하지 않습니다.`);

    setFindIdAttempted(false);
  };

  //email인증 결과
  const onEmailCheckResult = (resultData) => {
    console.log(resultData);
    setEmailCheckAttempted(false);
  };
  //이메일 인증버튼
  const handleEmailCheck = () => {
    setEmailCheckAttempted(true);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff',}}>
      <ScrollView>
        <View style={styles.container}>
              <Text style={{fontSize: 20, marginBottom: 50}}>아이디 찾기</Text>

              <TextInput
                  style={styles.input}
                  placeholder="이름 입력"
                  value={name}
                  onChangeText={setName}
              />
              
              <View style={{width: '100%'}}>
                  <TextInput
                      style={{width: '100%',
                      borderWidth: 1,
                      borderColor: '#cccccc',
                      padding: 10,
                      borderRadius: 10}}
                      placeholder="생년월일 입력"
                      value={birthDate}
                      onChangeText={setBirthDate}
                  />
                  <Text style={{marginBottom: 10}}> 생년월일 8자리 입력 ex)20000825</Text>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TextInput
                  style={styles.emailInput}
                  placeholder="등록된 이메일 입력"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  />
                  <TouchableOpacity style={styles.citationButton} onPress={handleEmailCheck}>
                      <Text style={{color: 'white', fontSize: 10}}>인증번호 발송</Text>
                  </TouchableOpacity>
              </View>

              <TextInput
                  style={styles.input}
                  placeholder="인증번호 입력"
                  value={secureNumber}
                  onChangeText={setSecureNumber}
              />
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center', padding: 20,}}>
            <TouchableOpacity style={styles.findIdButton} onPress={handleFindId}>
                <Text style={{color: 'white', fontSize: 20}}>아이디 찾기</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    
    {findIdAttempted &&
      <FindIdAPI
      name={name}
      birthDate={birthDate}
      email={email}
      onFindIdResult={onFindIdResult}
      />
    }

    {emailCheckAttempted &&
      <EmailCheckAPI
      email={email}
      onEmailCheckResult={onEmailCheckResult}
      />
    }
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 10,
    borderRadius: 10,
  },
  emailInput: {
    width: '75%',
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 10,
    borderRadius: 10,
  },
  findIdButton: {
    backgroundColor: 'blue',
    alignItems: 'center',
    padding: 10,
    width: '60%',
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 30,
  },
  citationButton: {
    backgroundColor: 'orange',
    alignItems: 'center',
    padding: 10,
    margin: 10,
    borderRadius: 10,
    borderWidth: 0.5,
  },
});

export default FindId;