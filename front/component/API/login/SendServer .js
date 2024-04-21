import React from 'react';

const SendServer = async ( userInfo, accessToken ) => {

    console.log("success", userInfo.nickname, accessToken );
    
    // try {
    // const response = await fetch('http://localhost:3000/api/auth/login/kakao', {
    //     method: 'POST',
    //     headers: {
    //     'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         access_token: accessToken,
    //         profile_nickname: nickname,
    //     }),
    // });
    // const jsonResponse = await response.json();
    // console.log('Server response:', jsonResponse);
    // } catch (error) {
    // console.error('Failed to send data to server:', error);
    // }
};

export default SendServer;