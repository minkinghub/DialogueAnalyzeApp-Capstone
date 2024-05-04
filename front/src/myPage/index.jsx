import React from 'react';
import { Button, Text, View, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Theme from './theme/theme';
import ThemeSwitch from './theme/themeSwitch';
const MyPage = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <View>
        
        <Text>MyPage!</Text>
        <ThemeSwitch/>
        <Button
            title="Go to History"
            onPress={() => navigation.navigate('history')}
        />
      </View>
    </SafeAreaView>
  );
}

export default MyPage;