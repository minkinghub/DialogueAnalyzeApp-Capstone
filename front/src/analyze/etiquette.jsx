import React, {useRef, useContext, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import analyzeStyle from './analyze.style';
import {getDetail} from '../../API';

//지금 자체 정적 데이터를 사용하고 있음
//token확인하고 되는 이후 수정 필요
import data from '../data';
import {useTheme} from '../ThemeContext';

// 예절 분석

const Etiquette = () => {
  const scrollViewRef = useRef(null);
  const {isDarkMode, historyKey} = useTheme();
  console.log('historyKey:', historyKey);
  const styles = analyzeStyle(isDarkMode);

  //historyKey를 업로드페이지로부터 받아옴
  // const loadData = () => {
  // const isHistoryKey = '663634701e6c5c47cf4b5368';
  // const detailList = data.detailList;
  console.log(123123);
  const loadData = () => {
    const detailList = getDetail(historyKey)?.detailList;
    console.log('detailList:', detailList);
    const score = [];
    const label = [];
    const chatContent = [];
    let totalScore = 0;

    detailList?.map((item, Listindex) => {
      item.detailInfo.map((item, Infoindex) => {
        score.push(item.detailScore);
        label.push(item.label);
        console.log('label:', item.label);
        console.log('score:', item.detailScore);
        console.log('chatContent:', item.exampleText);
        const pushitem = item.exampleText.map(example => example.chatContent);
        chatContent.push(pushitem);
      });
      totalScore = item.totalScore;
    });
    console.log('score:', score);
    console.log('label:', label);
    console.log('chatContent:', chatContent);
    console.log('totalScore:', totalScore);
    return {score, label, chatContent, totalScore};
  };
  const {score, label, chatContent, totalScore} = loadData();
  //한글로 바꾼 기준 배열
  const standardKr = ['존댓말', '도덕', '문법', '불쾌 발언'];
  //ScrollToItem을 위한 변수
  //y값을 계산하기 위해 사용
  //동적인 높이를 위해 사용
  let CommentHeight = 0;

  const DrawTable = ({scrollViewRef, styles}) => {
    //해당 standard의 comment를 이동하기 위한 함수
    const scrollToItem = index => {
      // scrollTo 위치 계산
      scrollViewRef.current.scrollTo({
        y: index * CommentHeight,
        animated: true,
      }); // 예시로 100픽셀씩 이동
      // console.log(CommentHeight);
    };
    return (
      <View>
        {/*기준 | 점수 */}
        {standardKr.map((item, index) => (
          <TouchableOpacity
            key={index}
            //해당 standard의 comment로 이동
            onPress={() => {
              scrollToItem(index);
            }}>
            <View style={styles.standardTableView}>
              <View style={styles.standardItemView}>
                <Text style={styles.standardItemText}>{item}</Text>
              </View>
              {/* standard | score 구분선 */}
              <View style={styles.standardHeightLine} />
              <View style={styles.standardScoreView}>
                <Text style={styles.standardScoreText}>
                  당신은 {score[index]} 점입니다.
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  //Standard Comment의 세로 길이를 계산하기 위한 함수
  const handleLayout = (index, event) => {
    const {width, height} = event.nativeEvent.layout;
    CommentHeight = height;
    // console.log(index, '컴포넌트의 세로 길이:', height);
  };
  loadData(historyKey);
  return (
    <View style={styles.container}>
      <View style={styles.headerStyle}>
        <Text style={styles.headerTextStyle}>예절 분석 결과</Text>
      </View>
      {/* standard | score 테이블 그리기 */}
      {/* {drawTable(scrollViewRef, styles)} */}
      <DrawTable scrollViewRef={scrollViewRef} styles={styles} />

      <View>
        <Text style={styles.totalScoreView}>총 {totalScore} 점입니다.</Text>
      </View>
      <ScrollView ref={scrollViewRef}>
        {label.map((item, labelIndex) => (
          <View
            key={labelIndex}
            style={styles.standardTableView}
            onLayout={event => handleLayout(labelIndex, event)}>
            <View style={styles.standardItemView}>
              <Text style={styles.standardItemText}>
                {standardKr[labelIndex]}
              </Text>
            </View>
            <View style={styles.standardHeightLine} />
            <View style={styles.standardCommentView}>
              {chatContent[labelIndex].map((item, index) => (
                <View style={styles.standardcommentTextView}>
                  <Text style={styles.standardCommentText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Etiquette;
