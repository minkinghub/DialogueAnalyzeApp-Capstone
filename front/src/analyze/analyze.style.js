import {StyleSheet} from 'react-native';
import {darkTheme, lightTheme} from '../myPage/theme/theme.styles';

const styles = (isDarkMode) =>{ 
    
    const theme= isDarkMode ? darkTheme : lightTheme;
    console.log('styles: ', isDarkMode);
    return( StyleSheet.create({
        //분석 결과 헤더 스타일
        container:{
            flex: 1,
            backgroundColor: theme.backgroundColor,
        },
        headerStyle:{
            backgroundColor: theme.backgroundColor,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
            justifyContent: 'center',
            height: 70,
            alignItems: 'center',
            padding: 15,
        },
        //분석 결과 헤더 텍스트 스타일
        headerTextStyle:{
            fontSize: 30,
            color: theme.textColor,
        },
        //타입타이틀 스타일
        typeStyle:{
            borderVerticalWidth: 2,
            paddingVertical: 10,
            marginTop: 20,
            justifyContent: 'center',
            
            alignSelf: 'center',
        },
        //타입타이틀 텍스트 스타일
        typeTextStyle:{
            fontSize: 20,
            color: theme.textColor,
            textAlign: 'center',
            fontWeight: 'bold',
            padding: 15,
        },
        //이미지 스타일
        imageViewStyle:{
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 30,
            borderRadius: 10,
        },
        //구분선 스타일 
        lineStyle:{
            borderBottomWidth: 10,
            borderColor: theme.borderColor,
            width: '85%',
            borderRadius: 10,
            margin: 21,
            alignSelf: 'center',
            justifyContent: 'center',  
        },
        //코멘트 박스 스타일
        commentBox:{
            padding: 20,
            borderWidth : 1,
            borderBottomWidth: 2,
            borderRightWidth:2, 
            borderColor: theme.borderColor,
            backgroundColor: theme.backgroundColor,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            width: '80%',
        },
        commentTextStyle:{
            fontSize: 20,
            color: theme.textColor,
            textAlign: 'center',
            fontWeight: 'bold',
            padding: 15,
        },

        ////////////////////////예절분석///////////////////////////
        //drawTable 스타일
        //예절분석 테이블 스타일
        standardTableView:{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            borderBottomWidth: 2,
            borderBottomColor: theme.borderColor,
            backgroundColor: theme.backgroundColor,
        },
        standardItemView:{
            flex: 1,
        },
        //item 스타일
        standardItemText:{
            fontSize: 18,
            color: theme.textColor,
            textAlign: 'center',
            fontWeight: 'bold',
            padding: 3,
        },
        //item, score 라인 스타일
        standardHeightLine:{
            borderColor: theme.borderColor,
            borderRadius: 6,
            borderWidth: 3,
            height: '100%',
            margin: 12,
            alignSelf: 'center',
            justifyContent: 'center',
        },
        standardScoreView:{
            width: '65%',
        },
        //score 스타일
        standardScoreText:{
            fontSize: 20,
            color: theme.textColor,
            fontWeight: 'bold',
            padding: 15,
        },

        //standardDetail 스타일
        standardCommentView:{
            margin: 10, 
            alignSelf: 'center',
            justifyContent: 'space-between',
            flex:6, 
        },
        standardcommentTextView:{
            borderWidth: 1,
            padding: 3,
            backgroundColor: theme.backgroundColor,

        },
        standardCommentText:{
            fontSize: 18,
            color: theme.textColor,
        },
        standardWidthLine:{
            borderBottomWidth: 3,
            borderColor: theme.borderColor,
            width: '100%',
            margin: 12,
            alignSelf: 'center',
            justifyContent: 'center',
        },

    })
)}
export default styles;