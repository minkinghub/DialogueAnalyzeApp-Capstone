import AsyncStorage from '@react-native-async-storage/async-storage';

const checkLoginStatus = async () => {
    try {
      const storedId = await AsyncStorage.getItem('userId');
      const isLoginKept = await AsyncStorage.getItem('loginKeep');
      if (storedId !== null && isLoginKept === 'true') {
        // 로그인 상태 유지가 선택된 경우, 자동 로그인 로직 구현
        
        console.log(storedId, isLoginKept);
      }
    } catch (error) {
      // 오류 처리
      console.error(error);
    }
};

export default checkLoginStatus;