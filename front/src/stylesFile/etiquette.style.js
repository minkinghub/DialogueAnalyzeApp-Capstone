import {StyleSheet} from 'react-native';
import {darkTheme, lightTheme} from './theme.styles';

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
    HighlightStyle: {
      backgroundColor: theme.highlightColor,
    },
    HighlightTextStyle: {
      color: theme.highlightTextColor,
    },
    tableView: {
      backgroundColor: theme.subColor1,
      // alignItems: 'center',
      padding: 10,
      marginHorizontal: 10,
      marginVertical: 5,
      borderRadius: 10,
    },
    tableTitleView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '94%',
      paddingHorizontal: 25,
    },
    tableTitle: {
      fontSize: 20,
      color: theme.highlightTextColor,
      fontWeight: '700',
    },
    tableComment: {
      color: theme.highlightTextColor,
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'center',
      padding: 5,
    },
    //라벨별 스타일
    labelView: {
      justifyContent: 'space-between',
      alignItems: 'center',
      // padding: 10,
      borderRadius: 10,
      backgroundColor: theme.backgroundColor,
      width: '94%',
      margin: 5,
    },
    labelTextView: {},
    labelText: {
      fontSize: 16,
      color: theme.textColor,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    lableScoreTextView: {
      width: '90%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    lableScoreText: {
      fontSize: 14,
      color: theme.textColor,
      marginHorizontal: 5,
      width: '11%',
    },

    scrollViewContainer: {
      flex: 10,
      backgroundColor: theme.subColor1,
      margin: 10,
      borderRadius: 10,
      padding: 10,
    },
    scoreBar: {
      flex: 1,
      height: 15,
      backgroundColor: theme.backgroundColor,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    scoreBarNotWaring: {
      backgroundColor: theme.backgroundColor,
      height: 15,
      flex: 1,
    },
    scoreBarWaring: {
      backgroundColor: theme.warningColor,
      flexDirection: 'row',
      height: 15,
      flex: 1,
    },
    scoreBarGood: {
      backgroundColor: theme.goodColor,
      height: 15,
      flex: 1,
    },

    //테이블 스크롤뷰 스타일

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
      fontSize: 15,
      color: theme.textColor,
      textAlign: 'center',
      fontWeight: '700',
    },
    commentExView: {
      width: '85%',
      padding: 5,
    },
    commentExCount: {
      fontSize: 14,
      color: theme.warningColor,
    },
    exTopView: {
      borderTopWidth: 0.5,
      borderLeftWidth: 0.5,
      borderRightWidth: 2,
      borderBottomWidth: 2,
      margin: 3,
      borderRadius: 10,
      padding: 5,
      justifyContent: 'center',
      borderColor: theme.borderColor,
    },
    exSubView: {
      flexDirection: 'row',
      justifyContent: 'space-around',

      width: '100%',
    },
    exSubTitleText: {
      borderBottomWidth: 1,
      fontSize: 13,
      paddingVertical: 5,
      color: theme.textColor,
      borderColor: theme.borderColor,
    },
    exSubCountText: {
      margin: 3,
      fontSize: 11,
      color: theme.textColor,
    },
    commentExTextView: {
      flexDirection: 'row',
      margin: 3,
    },
    commentExText: {
      fontSize: 11,
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
    anyThingTextView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    anyThingText: {
      fontSize: 16,
      color: theme.textColor,
      textAlign: 'center',
      fontWeight: '700',
    },
  });
};
export default etiquetteStyles;
