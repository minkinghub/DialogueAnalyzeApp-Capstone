import {StyleSheet} from 'react-native';
import {darkTheme, lightTheme} from '../theme/theme.styles';

const historyStyle = isDarkMode => {
  const theme = isDarkMode ? darkTheme : lightTheme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
      padding: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.textColor,
    },
    errorView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.backgroundColor,
      padding: 10,
    },
    errorTextTitle: {
      fontSize: 40,
      fontWeight: 'bold',
      color: theme.textColor,
    },
    errorText: {
      fontSize: 30,
      fontWeight: 'bold',

      color: theme.textColor,
    },
    item: {
      padding: 10,
      marginVertical: 5,
      backgroundColor: theme.backgroundColor,
      borderColor: theme.borderColor,
      borderWidth: 1,
      borderRadius: 5,
    },
    itemTitle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontSize: 16,
      color: theme.textColor,
      alignItems: 'center',
    },
    itemTitleName: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.textColor,
    },
    itemTitleTypeView: {
      backgroundColor: theme.backgroundColor,
      borderColor: theme.borderColor,
      borderWidth: 2,
      borderRadius: 5,
      padding: 5,
    },
    itemTitleType: {
      fontSize: 16,
      color: theme.textColor,
    },
    itemTime: {
      justifyContent: 'flex-end',
      //   borderWidth: 1,
      alignSelf: 'flex-end',
    },
    itemTimeText: {
      color: theme.textColor,
      fontSize: 12,
    },
  });
};

export default historyStyle;
