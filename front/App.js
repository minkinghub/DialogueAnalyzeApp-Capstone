import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './login/Login'; // 로그인 페이지 경로
import SignUp from './login/SignUp'; //회원가입 페이지 경로
import FindId from './login/FindId'; //아이디찾기 페이지 경로
import FindPw from './login/FindPw'; //비번찾기 페이지 경로

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerTitle: '로그인' }}/>
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerTitle: '회원가입' }}/>
        <Stack.Screen name="FindId" component={FindId} options={{ headerTitle: '' }}/>
        <Stack.Screen name="FindPw" component={FindPw} options={{ headerTitle: '' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;