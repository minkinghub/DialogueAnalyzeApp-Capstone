import React from 'react';
import {Text, View} from 'react-native';
import ThemeSwitch from '../utilities/Theme/themeSwitch';
import {useTheme} from '../utilities/Theme/ThemeContext';
import myPageStyle from '../stylesFile/MyPage.style';
import History from './history';
const MyPage = () => {
  const {isDarkMode} = useTheme();
  const styles = myPageStyle(isDarkMode);

  return (
    <View style={styles.container}>
      <View style={styles.headerStyle}>
        <Text style={styles.headerTextStyle}>마이 페이지</Text>
        <ThemeSwitch />
      </View>
      <History />
      {/* 
      <TouchableOpacity
        style={styles.historyBtn}
        onPress={() => navigation.navigate('history')}>
        <Text style={styles.historyBtnText}>기록보기</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default MyPage;
