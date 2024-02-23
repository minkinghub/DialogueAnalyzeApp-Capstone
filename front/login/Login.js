import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import LoginAPI from '../component/login/API/LoginAPI'; //로그인API 컴포넌트

const Login = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loginAttempted, setLoginAttempted] = useState(false);

  const onLoginSuccess = () => {
    Alert.alert("Login Success", "You have successfully logged in.");
    setLoginAttempted(false);
    // 로그인 성공 후의 로직을 여기에 구현합니다.
  };

  const onLoginFailure = () => {
    Alert.alert("Login Failure", "failure");
    setLoginAttempted(false);
  };

  // 로그인 로직 구현
  const handleLogin = () => {
    setLoginAttempted(true);
  };

  const handleFindId = () => {
    console.log('아이디 찾기 로직 구현');
    console.log(loginAttempted);

    // 아이디 찾기 로직 구현
  };

  const handleFindPassword = () => {
    console.log('비밀번호 찾기 로직 구현');
    // 비밀번호 찾기 로직 구현
  };

  const handleSignUp = () => {
    console.log('회원가입 로직 구현');
    // 회원가입 로직 구현
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
                        onPress={(isChecked) => {console.log(isChecked);}}
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