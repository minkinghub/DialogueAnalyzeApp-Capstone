import React from 'react';
import {Text, View, SafeAreaView, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ThemeSwitch from './theme/themeSwitch';
import {useTheme} from '../ThemeContext';
import myPageStyle from './stylesFile/MyPage.style';

const MyPage = () => {
  const navigation = useNavigation();
  const {isDarkMode} = useTheme();
  const styles = myPageStyle(isDarkMode);

  return (
    <View style={styles.container}>
      <View style={styles.Switch}>
        <ThemeSwitch />
      </View>
      <TouchableOpacity
        style={{backgroundColor: 'gray', padding: 10}}
        onPress={() => navigation.navigate('history')}>
        <Text>기록보기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyPage;
