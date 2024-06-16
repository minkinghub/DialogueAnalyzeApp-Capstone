import {StyleSheet, Switch, Text, View} from 'react-native';
import {useTheme} from './ThemeContext';
import {darkTheme, lightTheme} from '../../stylesFile/theme.styles';
const ThemeSwitch = () => {
  //true면 다크, flase면 라이트
  const {isDarkMode, toggleTheme} = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 5,
      backgroundColor: theme.backgroundColor,
      borderColor: theme.borderColor,
    },
    textsty: {
      color: theme.textColor,
      fontSize: 16,
    },
  });
  console.log('switch: ', isDarkMode ? 'dark' : 'light');
  return (
    <View style={styles.container}>
      <Text style={styles.textsty}>Light Theme</Text>
      <Switch value={isDarkMode} onValueChange={toggleTheme} />
      <Text style={styles.textsty}>Dark Theme</Text>
    </View>
  );
};

export default ThemeSwitch;
