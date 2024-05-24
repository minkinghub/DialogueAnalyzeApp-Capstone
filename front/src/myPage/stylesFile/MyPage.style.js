import {StyleSheet} from 'react-native';
import {darkTheme, lightTheme} from '../theme/theme.styles';

const myPageStyle = isDarkMode => {
  const theme = isDarkMode ? darkTheme : lightTheme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
      padding: 10,
    },
    Switch: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      padding: 10,
    },
  });
};
export default myPageStyle;
