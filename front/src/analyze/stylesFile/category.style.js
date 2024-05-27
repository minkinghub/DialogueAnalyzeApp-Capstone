import {StyleSheet} from 'react-native';
import {darkTheme, lightTheme} from '../../myPage/theme/theme.styles';

const categoryStyles = isDarkMode => {
  const theme = isDarkMode ? darkTheme : lightTheme;
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    headerStyle: {
      backgroundColor: theme.backgroundColor,
      borderColor: theme.borderColor,
      borderBottomWidth: 5,
      height: 70,
      padding: 7,
      paddingHorizontal: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTextStyle: {
      fontSize: 30,
      color: theme.textColor,
    },
    //타입타이틀 스타일
    typeStyle: {
      backgroundColor: theme.backgroundColor,
      justifyContent: 'center',
      alignSelf: 'center',
      padding: 15,
    },
    //타입타이틀 텍스트 스타일
    typeTextStyle: {
      fontSize: 27,
      color: theme.textColor,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    imageViewStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderRadius: 10,
    },
    imageViewText: {
      fontSize: 22,
      color: theme.textColor,
      fontWeight: 'bold',
      paddingBottom: 10,
    },
    lineStyle: {
      borderWidth: 5,
      borderColor: theme.borderColor,
      width: '87%',
      margin: 15,
      borderRadius: 10,
      alignSelf: 'center',
    },
    //코멘트 박스 스타일
    commentBox: {
      padding: 20,
      borderWidth: 1,
      borderBottomWidth: 2,
      borderRightWidth: 2,
      borderColor: theme.borderColor,
      backgroundColor: theme.backgroundColor,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      width: '80%',
    },
    commentTextStyle: {
      fontSize: 20,
      color: theme.textColor,
      textAlign: 'center',
      fontWeight: 'bold',
      padding: 15,
    },
  });
};
export default categoryStyles;
