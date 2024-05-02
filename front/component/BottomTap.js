import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../mainPage/Home'; // 홈 화면 컴포넌트 경로
import Analyze from '../analyzePage/Analyze';
import MyPage from '../MyPage';

const Tab = createBottomTabNavigator();

function BottomTap() {
  return (
    <Tab.Navigator screenOptions={{
      tabBarActiveTintColor: '#0D3DB2', 
      tabBarInactiveTintColor: 'black', 
      tabBarLabelStyle: { fontSize: 14 }, 
      tabBarStyle: { 
        backgroundColor: '#f2cd79', 
        height: 60, 
        borderTopColor: 'darkgrey', 
        borderTopWidth: 1, 
        borderTopStyle: 'solid', 
      },
    }}>
      <Tab.Screen name="Home" component={Home} options={{tabBarLabel: '홈'}}/>
      <Tab.Screen name="Analyze" component={Analyze} options={{tabBarLabel: '채팅 분석', headerTitle: 'Chat Analysis'}}/>
      <Tab.Screen name="MyPage" component={MyPage} options={{tabBarLabel: '마이 페이지'}}/>
    </Tab.Navigator>
  );
}

export default BottomTap;