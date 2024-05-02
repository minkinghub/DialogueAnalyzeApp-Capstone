import {StyleSheet} from 'react-native';

const lightTheme = {
    backgroundColor: 'white',
    textColor: 'black',
    borderColor: '#D3D3D3',
    // 다른 스타일 속성들...
};

const darkTheme = {
    backgroundColor: 'black',
    textColor: 'white',
    borderColor: 'white',
    // 다른 스타일 속성들...
};

const styles = StyleSheet.create({
    //분석 결과 헤더 스타일
    headerStyle:{
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#D3D3D3',
        justifyContent: 'center',
        height: 70,
        alignItems: 'center',
        padding: 15,
    },
    //분석 결과 헤더 텍스트 스타일
    headerTextStyle:{
        fontSize: 30,
        color: 'black',
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
        color: 'black',
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
        borderColor: '#D3D3D3',
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
        borderColor: '#B3B0D0',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: '80%',
    },
    commentTextStyle:{
        fontSize: 20,
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
        padding: 15,
    },
    //예절분석 테이블 스타일
    standardTableView:{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#C0C0C0',
    
    },
    standardItemView:{
        flex: 1,
    },
    //item 스타일
    standardItemText:{
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
        padding: 3,
    },
    //item, score 라인 스타일
    standardHeightLine:{
        borderColor: '#D3D3D3',
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
        color: 'black',
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
    },
    standardCommentText:{
        fontSize: 18,
        color: 'black',
    },
    standardWidthLine:{
        borderBottomWidth: 3,
        borderColor: '#D3D3D3',
        width: '100%',
        margin: 12,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    
});
export default styles;