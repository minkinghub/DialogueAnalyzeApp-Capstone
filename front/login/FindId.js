import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, SafeAreaView, ScrollView } from 'react-native';

const FindId = () => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [certifNum,setCertifNum] = useState('');


  const handleFindId = () => {
    // TODO: 아이디 찾기 로직 구현
    // 예를 들어, 입력된 이메일로 사용자 아이디 조회 후 결과를 알림으로 표시
    // 이 부분은 백엔드와의 통신 로직으로 대체될 수 있습니다.
    Alert.alert('아이디 찾기 요청', `입력된 닉네임: ${id}\n입력된 이메일: ${email}`);
  };

  const handlecitation = () => {
    // 이메일 인증번호 발송
    Alert.alert('인증번호 발송', `입력된 이메일: ${email}`);
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
                  <TouchableOpacity style={styles.citationButton} onPress={handlecitation}>
                      <Text style={{color: 'white', fontSize: 10}}>인증번호 발송</Text>
                  </TouchableOpacity>
              </View>

              <TextInput
                  style={styles.input}
                  placeholder="인증번호 입력"
                  value={certifNum}
                  onChangeText={setCertifNum}
              />
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center', padding: 20,}}>
            <TouchableOpacity style={styles.findIdButton} onPress={handleFindId}>
                <Text style={{color: 'white', fontSize: 20}}>아이디 찾기</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
        
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