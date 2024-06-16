import {StyleSheet} from 'react-native';
import {darkTheme, lightTheme} from './theme.styles';

const myPageStyle = isDarkMode => {
  const theme = isDarkMode ? darkTheme : lightTheme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    headerStyle: {
      backgroundColor: theme.backgroundColor,
      borderColor: theme.borderColor,
      borderBottomWidth: 3,
      height: 70,
      padding: 7,
      paddingHorizontal: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTextStyle: {
      fontSize: 25,
      color: theme.textColor,
    },
    historyBtn: {
      padding: 10,
      backgroundColor: theme.subColor1,
      borderRadius: 10,
      alignItems: 'center',
      margin: 10,
    },
    historyBtnText: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.highlightTextColor,
    },
  });
};
export default myPageStyle;
