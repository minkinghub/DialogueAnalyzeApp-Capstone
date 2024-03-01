import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginAPI from '../component/API/LoginAPI'; //로그인API 컴포넌트
import checkLoginStatus from '../component/login/CheckLoginStatus '; //로그인유지 확인 컴포넌트

const Login = () => {
  const navigation = useNavigation(); // 네비게이션 객체
  const [id, setId] = useState(''); //아이디
  const [password, setPassword] = useState(''); //비밀번호
  const [loginAttempted, setLoginAttempted] = useState(false); //로그인 버튼 클릭
  const [loginKeep, setLoginKeep] = useState(false); //로그인상태 유지 체크상태

  // 컴포넌트 마운트 시 로그인유지 상태 확인
  useEffect(() => {
    checkLoginStatus();
  }, []);

  //로그인 성공
  const onLoginSuccess = async () => {
    //로그인 유지 체크여부
    if (loginKeep === true) {
        try {
          await AsyncStorage.setItem('userId', id);
          await AsyncStorage.setItem('loginKeep', 'true');
        } catch (error) {
          // 오류 처리
          console.log(error);
        }
    } else if (loginKeep === false) {
        try {
            await AsyncStorage.setItem('userId', id);
            await AsyncStorage.setItem('loginKeep', 'false');
        } catch (error) {
            // 오류 처리
            console.log(error);
        }
    }
    Alert.alert("로그인 성공!!", "You have successfully logged in.");
    setLoginAttempted(false);
  };
  //로그인 실패
  const onLoginFailure = () => {
    Alert.alert("Login Failure", "failure");
    setLoginAttempted(false);
  };
  // 로그인 버튼
  const handleLogin = () => {
    if (id && password !== null) {
        setLoginAttempted(true);
    }
    else Alert.alert(" ", "아이디 및 비밀번호를 입력해주세요.");
  };



  const handleFindId = () => {
    navigation.navigate('FindId');
  };

  const handleFindPassword = () => {
    navigation.navigate('FindPw');
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff',}}>
            
            <View style={styles.container}>
                
                <Text>ID</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setId}
                    value={id}
                    placeholder="아이디"
                />
                <Text>Password</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="비밀번호"
                    secureTextEntry
                />

                <View style={{width: '80%'}}>
                    <BouncyCheckbox
                        size={25}
                        fillColor="blue"
                        unfillColor="#FFFFFF"
                        text="로그인 상태 유지"
                        iconStyle={{ borderColor: "red"}}
                        onPress={(isChecked) => {setLoginKeep(isChecked);}}
                    />
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={{color: 'white', fontSize: 20,}}>Login</Text>
                </TouchableOpacity>
                
                <View style={styles.subContainer}>
                    <TouchableOpacity style={styles.Button} onPress={handleFindId}>
                        <Text>아이디 찾기</Text>
                    </TouchableOpacity>
                    <Text>|</Text>
                    <TouchableOpacity style={styles.Button} onPress={handleFindPassword}>
                        <Text>비밀번호 찾기</Text>
                    </TouchableOpacity>
                    <Text>|</Text>
                    <TouchableOpacity style={styles.Button} onPress={handleSignUp}>
                        <Text>회원가입</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {loginAttempted &&
            <LoginAPI
            id={id}
            password={password}
            onLoginSuccess={onLoginSuccess}
            onLoginFailure={onLoginFailure}
            />
      }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-around',
        width: '80%',
        marginTop: 20,
    },
    input: {
        width: '80%',
        margin: 10,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
    },
    loginButton: {
        backgroundColor: 'blue',
        alignItems: 'center',
        padding: 10,
        width: '60%',
        margin: 10,
        borderRadius: 10,
        borderWidth: 1,
    },
    Button: {
        backgroundColor: 'white',
    },
});

export default Login;