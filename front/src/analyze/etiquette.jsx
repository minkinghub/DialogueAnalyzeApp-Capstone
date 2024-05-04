import React,{useRef, useContext} from "react";
import {View, Text, TouchableOpacity, ScrollView} from "react-native";
import analyzeStyle from "./analyze.style";
import ThemeContext from "../ThemeContext";

// 예절 분석
//서버에서 가져올때 기준 배열
const standard=["grammar", "emotion", "moral", "politely"]
//한글로 바꾼 기준 배열
const standardKr=["문법", "감정", "불쾌 발언", "존댓말"]
const standardScore=[12, 24, 25, 19]
//ScrollToItem을 위한 변수
//y값을 계산하기 위해 사용
//동적인 높이를 위해 사용
let CommentHeight = 0;
// standard | score 테이블 그리기

const DrawTable = (scrollViewRef, styles) => {

    //해당 standard의 comment를 이동하기 위한 함수
    const scrollToItem = (index) => {
        // scrollTo 위치 계산
        scrollViewRef.current.scrollTo({ y: index * CommentHeight, animated: true }); // 예시로 100픽셀씩 이동
        console.log(CommentHeight);
    };
    return(
        <View>
            {/*기준 | 점수 */}
        {standardKr.map((item, index) => (
            <TouchableOpacity key = {index}
                //해당 standard의 comment로 이동
                onPress = {() => {scrollToItem(index)}}> 
                <View style = {styles.standardTableView}>
                    <View style = {styles.standardItemView}>
                        <Text style = {styles.standardItemText}>
                            {item}
                        </Text>
                    </View>
                    {/* standard | score 구분선 */}
                    <View style = {styles.standardHeightLine}/>
                    <View style = {styles.standardScoreView}>
                        <Text style = {styles.standardScoreText}>
                            당신은 {standardScore[index]} 점입니다.
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        ))}
        </View>
    )
}
const Etiquette = () => {
    const scrollViewRef = useRef(null);

    const DarkMode = useContext(ThemeContext);
    const isDarkMode = DarkMode.isDarkMode;
    const styles = analyzeStyle(isDarkMode);
    console.log('Category: ',isDarkMode);
    isDarkMode ? console.log('DarkMode') : console.log('LightMode');

    //Standard Comment의 세로 길이를 계산하기 위한 함수
    const handleLayout = (index, event) => {
        const { width, height } = event.nativeEvent.layout;
        CommentHeight= height;
        console.log(index, "컴포넌트의 세로 길이:", height);
    };
    const totalScore = standardScore.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    
    
    return(
        <View style= {styles.container}>
            <View style = {styles.headerStyle}>
                <Text style = {styles.headerTextStyle}>예절 분석 결과</Text>
            </View>
            {/* standard | score 테이블 그리기 */}
            {/* {drawTable(scrollViewRef, styles)} */}
            <DrawTable scrollViewRef={scrollViewRef} styles={styles}/>

            <View>
                <Text style = {styles.totalScoreView}>총 {totalScore} 점입니다.</Text>
            </View>
            <ScrollView ref={scrollViewRef}>
                {standard.map((item, index) => (
                    <View key = {index}
                    style= {styles.standardTableView}
                    onLayout={(event) => handleLayout(index, event)}
                    >
                        <View style = {styles.standardItemView}>
                            <Text style = {styles.standardItemText}>
                                {standardKr[index]}
                            </Text>
                        </View>
                        <View style = {styles.standardHeightLine}/>
                        {/* 코멘트를 받아야함
                        server.key.comment.map((item, index) => (
                            <View style = {styles.standardCommentView}>
                                <View style = {styles.standardcommentTextView}>
                                    <Text style = {styles.standardCommentText}>
                                        commentaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</Text>
                                </View>
                                <View style = {styles.standardWidthLine}/>
                                <View style = {styles.standardcommentTextView}>
                                    <Text style = {styles.standardCommentText}>
                                    1111111</Text>
                                </View>
                            </View>
                        ))}
                        */}
                        <View style = {styles.standardCommentView}>
                            <View style = {styles.standardcommentTextView}>
                                <Text style = {styles.standardCommentText}>
                                    commentaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</Text>
                            </View>
                            <View style = {styles.standardWidthLine}/>
                            <View style = {styles.standardcommentTextView}>
                                <Text style = {styles.standardCommentText}>
                                1111111</Text>
                            </View>
                        </View>
                    </View>
                
                ))}
            </ScrollView>
            

        </View>
    )
}

export default Etiquette;