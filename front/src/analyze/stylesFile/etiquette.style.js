import {StyleSheet} from 'react-native';
import {darkTheme, lightTheme} from '../../myPage/theme/theme.styles';

const etiquetteStyles = isDarkMode => {
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
    //테이블 스타일
    tableView: {
      backgroundColor: theme.subColor1,
      alignItems: 'center',
      padding: 10,
      marginHorizontal: 10,
      marginVertical: 5,
      borderRadius: 10,
    },
    //라벨별 스타일
    labelView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      borderRadius: 10,
      backgroundColor: theme.backgroundColor,
      width: '94%',
      margin: 5,
    },
    labelTextView: {
      width: '30%',
      borderColor: theme.borderColor,
      borderRightWidth: 1,
    },
    labelText: {
      fontSize: 18,
      color: theme.textColor,
      textAlign: 'center',
      fontWeight: 'bold',
      padding: 3,
    },
    lableScoreTextView: {
      width: '65%',
      paddingLeft: 10,
      justifyContent: 'center',
    },
    lableScoreText: {
      fontSize: 16,
      color: theme.textColor,
    },

    tableComment: {
      color: theme.subTextColor,
      fontSize: 14,
      fontWeight: '500',
    },
    //테이블 스크롤뷰 스타일
    scrollView: {
      flex: 5,
      backgroundColor: theme.subColor1,
      margin: 10,
      borderRadius: 10,
      padding: 10,
    },
    commentView: {
      // backgroundColor: theme.subColor2,
      padding: 10,
      margin: 10,
      borderRadius: 10,
      borderWidth: 1,
      flexDirection: 'row',
      backgroundColor: theme.backgroundColor,
    },
    commentLabelTextView: {
      width: '10%',
      borderColor: theme.borderColor,
      borderRightWidth: 1,
      padding: 5,
    },
    commentLabelText: {
      fontSize: 27,
      color: theme.textColor,
      textAlign: 'center',
      fontWeight: '700',
    },
    commentExView: {
      width: '85%',
      marginLeft: 5,
      padding: 5,
      // borderRadius: 10,
      // borderWidth: 1,
    },
    commentExTextView: {
      flexDirection: 'row',
      margin: 3,
    },
    commentExText: {
      fontSize: 14,
      color: theme.textColor,
      width: '68%',
    },
    commentTitleTextView: {
      width: '28%',
      paddingRight: 5,
      // marginRight: 7,
    },
    commentTitleText: {
      color: theme.textColor,
      fontWeight: '400',
      borderRightWidth: 1,
      borderColor: theme.borderColor,
    },
  });
};
export default etiquetteStyles;
