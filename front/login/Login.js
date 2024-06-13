import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as KakaoLogin from '@react-native-seoul/kakao-login'; //카카오 로그인 라이브러리

import getUserInfo from '../component/API/login/GetUserInfo'; //카카오 유저정보 반환 컴포넌트
import SendServer from '../component/API/login/SendServer ' //유저정보 전송 컴포넌트

const Login = () => {
  const navigation = useNavigation(); //네비게이션 객체

  const handleLogin = () => {
    console.log("Login");
  };

  //카카오 로그인 버튼
  const kakaoLogin = async () => {

    try {
        const result = await KakaoLogin.login();
        // console.log("Login Success", JSON.stringify(result));
        
        // 로그인 성공 후, accessToken을 사용하여 GetUserInfo 함수 호출
        const userInfo = await getUserInfo(result.accessToken);

        //서버로 유저정보 전송
        const isFirst = await SendServer(userInfo, result.accessToken);

        //isFirst 반환 받았을 때, 페이지 이동
        if (isFirst !== null) navigation.navigate('BottomTap');
    } catch (error) {
        if (error.code === 'E_CANCELLED_OPERATION') {
            console.log("Login Cancel", error.message);
        } else {
            console.log(`Login Fail(code:${error.code})`, error.message);
        }
    }
  };
  

  return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff',}}>
        <View style={{justifyContent: 'center', alignItems: 'center', height: '20%', backgroundColor: '#FFFDD0'}}>
          <Text style={{
            fontSize: 30,
            fontWeight: 'bold',
            textAlign: 'center',
            letterSpacing: 2,
          }}>대화성향 분석 앱</Text>
        </View>
        
        <View style={{justifyContent: 'center', alignItems: 'center', height: '80%', backgroundColor: '#FFFDD0'}}>

          <View style={{
            justifyContent: 'center', 
            alignItems: 'center',
            borderWidth: 1,
            height: '90%', 
            width:'90%', 
            backgroundColor: 'white', 
            borderRadius: 20,
          }}>
            <Text>간편 로그인</Text>
            <Text> </Text>
            <TouchableOpacity onPress={kakaoLogin}>
              <Image source={require('../assets/images/kakao_login_medium_wide.png')}/>
            </TouchableOpacity>

            <View style={{flexDirection: 'row', alignItems: 'center', width: '80%', marginVertical: 15, marginTop: 20, marginBottom: 20}}>
              <View style={{flex: 1, height: 1, backgroundColor: '#ccc'}} />
                <View>
                  <Text style={{width: 50, textAlign: 'center'}}>or</Text>
                </View>
              <View style={{flex: 1, height: 1, backgroundColor: '#ccc'}} />
            </View>

            <TouchableOpacity style={{
              flexDirection: 'row',
              justifyContent: 'center', 
              alignItems: 'center',
              height: 43,
              width: 300,
              borderWidth: 1,
              borderRadius: 5,
              borderColor: '#EDEDEF',
              backgroundColor: '#03C75A',
            }} onPress={handleLogin}>
              <View style={{marginLeft: 10, width: '35%'}}>
                <Image style={{height: 35, width: 35}} resizeMode="contain" source={require('../assets/images/naver_iconG.png')}/>
              </View>
              <View style={{width: '65%'}}>
                <Text style={{color: '#FBFEFC', fontWeight: 'bold'}}>   네이버 로그인</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={{
              flexDirection: 'row',
              justifyContent: 'center', 
              alignItems: 'center',
              height: 43,
              width: 300,
              borderWidth: 1,
              borderRadius: 5,
              borderColor: '#B2C8BF',
              backgroundColor: '#FFFFFF',
              marginTop: 10,
            }} onPress={handleLogin}>
              <View style={{marginLeft: 23, width: '35%'}}>
                <Image style={{height: 20, width: 20}} resizeMode="contain" source={require('../assets/images/google_icon.png')}/>
              </View>
              <View style={{width: '65%'}}>
                <Text style={{color: '#000000'}}> Google 로그인</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
  );
};

export default Login;