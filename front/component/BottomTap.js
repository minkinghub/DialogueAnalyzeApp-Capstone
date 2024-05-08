import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../mainPage/Home'; // 홈 화면 컴포넌트 경로
import Analyze from '../analyzePage/Analyze';
import MyPage from '../src/myPage';
import History from '../src/myPage/history';
import {Category} from '../src/analyze';

const Tab = createBottomTabNavigator();

function BottomTap() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#0D3DB2',
        tabBarInactiveTintColor: 'black',
        tabBarLabelStyle: {fontSize: 14},
        tabBarStyle: {
          backgroundColor: '#f2cd79',
          height: 60,
          borderTopColor: 'darkgrey',
          borderTopWidth: 1,
          borderTopStyle: 'solid',
        },
      }}
      initialRouteName="Home">
      <Tab.Screen name="Home" component={Home} options={{tabBarLabel: '홈'}} />
      <Tab.Screen
        name="Analyze"
        component={Analyze}
        options={{tabBarLabel: '채팅 분석', headerTitle: 'Chat Analysis'}}
      />
      <Tab.Screen
        name="MyPageStack"
        component={MyPageStack}
        options={{tabBarLabel: '마이 페이지'}}
      />
      {/* <Tab.Screen
        name="Etiquette"
        component={Etiquette}
        options={{tabBarLabel: '에티켓', headerShown: false}}
      /> */}
      <Tab.Screen
        name="Category"
        component={Category}
        options={{tabBarLabel: '카테고리', headerShown: false}}
      />
    </Tab.Navigator>
  );
}

const MyPageStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // 모든 화면에서 헤더 숨기기
      }}>
      <Stack.Screen name="MyPage" component={MyPage} />
      <Stack.Screen name="history" component={History} />
    </Stack.Navigator>
  );
};

export default BottomTap;
