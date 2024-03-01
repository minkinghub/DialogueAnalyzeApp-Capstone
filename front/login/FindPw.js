import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';
import FindPwAPI from '../component/API/FindPwAPI';
import EmailCheckAPI from '../component/API/EmailCheckAPI';

const FindPw = () => {
  const [id, setId] = useState(''); //아이디
  const [name, setName] = useState(''); //이름
  const [birthDate, setBirthDate] = useState(''); //생년월일
  const [email, setEmail] = useState(''); //이메일
  const [secureNumber, setSecureNumber] = useState(''); //인증번호

  const [findPwAttempted, setFindPwAttempted] = useState(false); //비번찾기 버튼 클릭여부
  const [emailCheckAttempted,setEmailCheckAttempted] = useState(false); //email인증 버튼 클릭여부

  //비밀번호 찾기 버튼
  const handleFindPw = () => {
    setFindPwAttempted(true);
  };
  const onFindIdResult = (resultData, pw) => {
    if (resultData === true) {
      Alert.alert(' ',`비밀번호 : ${pw}`);
    } else Alert.alert(' ',`입력하신 정보에 해당하는 비밀번호가 존재하지 않습니다.`);

    setFindPwAttempted(false);
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
            
          <Text style={{fontSize: 20, marginBottom: 50}}>비밀번호 찾기</Text>
          <TextInput
              style={styles.input}
              placeholder="아이디 입력"
              value={id}
              onChangeText={setId}
          />
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
                  value={id}
                  onChangeText={setBirthDate}
              />
              <Text style={{marginBottom: 10}}> 생년월일 8자리 입력 예20000825</Text>
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

        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20,}}>
          <TouchableOpacity style={styles.findIdButton} onPress={handleFindPw}>
              <Text style={{color: 'white', fontSize: 20}}>비밀번호 찾기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
        
      {findPwAttempted &&
        <FindPwAPI
        id={id}
        name={name}
        birthDate={birthDate}
        email={email}
        onFindPwResult={onFindIdResult}
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
    flex: 1,
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

export default FindPw;