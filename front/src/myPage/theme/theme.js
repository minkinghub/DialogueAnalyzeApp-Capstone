import React, { useState } from 'react';
import {
  Switch,
  Text,
  View,
} from 'react-native';
import {darkTheme, lightTheme} from './theme.styles';

const Theme = () => {
  const [isTheme, setTheme] = useState('light');
  
  const toggleTheme = () => {
      setTheme(isTheme === 'light' ? 'dark' : 'light');
  };
  const isDarkMode = isTheme === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? darkTheme.backgroundColor : lightTheme.backgroundColor,
  };

  return (
    <View 
      style={[backgroundStyle,{flexDirection:'row', alignSelf:'flex-end',borderWidth: 3, }]}>
      <Text style={{color: lightTheme.backgroundColor}}>lightTheme</Text>
      <Switch
        value={isDarkMode}
        onValueChange={toggleTheme}
      />
      <Text style={{color:darkTheme.backgroundColor}}>darkTheme</Text>
    </View>
  );
};

export default Theme;
