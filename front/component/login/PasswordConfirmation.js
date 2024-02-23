import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';

const PasswordConfirmation = ({ password, confirmPassword, onpasswordSame }) => {
    const [PasswordMessage, setPasswordMessage] = useState('');

    //비밀번호 일치 확인
    useEffect(() => {
        // 비밀번호 또는 비밀번호 확인 입력이 변경될 때마다 실행
        if (!password && !confirmPassword) {
            setPasswordMessage('비밀번호를 입력해주세요.');
            onpasswordSame(false);
        } else if (password && confirmPassword && password !== confirmPassword) {
            setPasswordMessage('비밀번호가 일치하지 않습니다.');
            onpasswordSame(false);
        } else if (password && confirmPassword && password === confirmPassword) {
            setPasswordMessage('비밀번호가 일치합니다.');
            onpasswordSame(true);
        } else {
            setPasswordMessage('비밀번호를 다시 입력해주세요.'); // 초기 상태 또는 기타 조건에 대한 처리
            onpasswordSame(false);
        }
      }, [password, confirmPassword]);

  return (
    <Text style={{color: 'red', marginLeft: 5}}>{PasswordMessage}</Text>
  );
};

export default PasswordConfirmation;