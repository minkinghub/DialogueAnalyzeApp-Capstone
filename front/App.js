import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './login/Login'; // 로그인 페이지 경로
import BottomTap from './component/BottomTap';
import Analyze from './analyzePage/Analyze';

const Stack = createNativeStackNavigator();

function App() {
  return (
    
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerTitle: '로그인' }}/>
        <Stack.Screen name="Analyze" component={Analyze} options={{ headerShown: false }}/>
        <Stack.Screen name="BottomTap" component={BottomTap} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}

export default App;