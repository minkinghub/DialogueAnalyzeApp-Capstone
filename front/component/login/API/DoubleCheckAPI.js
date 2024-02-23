import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';

const LoginAPI = ({ velue, onDoubleCheckResult }) => {

    useEffect(() => {
        onDoubleCheckResult(true);
    }, [velue]);
    

    // useEffect(() => {
    //     const login = async () => {
    //       try {
    //         const response = await fetch('https://yourserver.com/api/login', {
    //           method: 'POST',
    //           headers: {
    //             'Content-Type': 'application/json',
    //           },
    //           body: JSON.stringify({
    //             id: id,
    //             password: password,
    //           }),
    //         });
    
    //         const data = await response.json();
    
    //         if (response.ok) {
    //           onLoginSuccess(data); // 로그인 성공 시 콜백 함수 호출
    //         } else {
    //           onLoginFailure(data.message); // 로그인 실패 시 콜백 함수 호출
    //         }
    //       } catch (error) {
    //         onLoginFailure(error.message); // 에러 발생 시 콜백 함수 호출
    //       }
    //     };
    
    //     if (id && password) {
    //       login();
    //     }
    // }, [id, password, onLoginSuccess, onLoginFailure]);

    return null;
};

export default LoginAPI;