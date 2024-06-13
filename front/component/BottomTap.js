import React from 'react';
import { Image } from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {useContext} from 'react';
import {darkTheme, lightTheme} from '../src/myPage/theme/theme.styles'; //테마 변경

// import Home from '../mainPage/Home'; // 홈 화면 컴포넌트 경로
import Analyze from '../analyzePage/Analyze';
import MyPage from '../src/myPage';
import History from '../src/myPage/history';
import {Category, Etiquette} from '../src/analyze';
import ThemeContext from '../src/ThemeContext';

import myPageIcon from '../assets/images/TapbarIcons/user_light.png'
import myPageIconActive from '../assets/images/TapbarIcons/user_black.png'
import analyzeIcon from '../assets/images/TapbarIcons/analytics_light.png'
import analyzeIconActive from '../assets/images/TapbarIcons/analytics_black.png'

const Tab = createBottomTabNavigator();

function BottomTap() {
  const DarkMode = useContext(ThemeContext);
  const isDarkMode = DarkMode.isDarkMode; //테마 설정
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#006400',
        tabBarInactiveTintColor: 'black',
        tabBarLabelStyle: {fontSize: 14},
        tabBarStyle: {
          backgroundColor: '#FFFDD0',
          height: 60,
          borderTopColor: 'darkgrey',
          borderTopWidth: 1,
          borderTopStyle: 'solid',
        },
      }}
      initialRouteName="Analyze">
      {/* <Tab.Screen name="Home" component={Home} options={{tabBarLabel: '홈'}} /> */}
      <Tab.Screen
        name="Analyze"
        component={Analyze}
        options={{
          tabBarLabel: '대화 분석', 
          headerTitle: 'Conversation Analysis', 
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? analyzeIconActive : analyzeIcon}
              style={{ width: 35, height: 35 }}
            />
          ),
          headerStyle: {
            backgroundColor: theme.backgroundColor,
            borderBottomColor: theme.borderColor,
            borderBottomWidth: 1,
          },
          headerTintColor: theme.textColor,
        }}
      />
      <Tab.Screen
        name="MyPageStack"
        component={MyPageStack}
        options={{
          tabBarLabel: '마이 페이지',
          headerTitle: 'My Page',
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? myPageIconActive : myPageIcon}
              style={{ width: 35, height: 35 }}
            />
          ),
          headerStyle: {
            backgroundColor: theme.backgroundColor,
            borderBottomColor: theme.borderColor,
            borderBottomWidth: 1,
          },
          headerTintColor: theme.textColor,
        }}
      />
      <Tab.Screen
        name="Etiquette"
        component={Etiquette}
        options={{tabBarLabel: '에티켓', headerShown: false}}
      />
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
