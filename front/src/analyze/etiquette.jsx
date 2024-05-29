import React, {useRef, useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import analyzeStyle from './analyze.style';
import {useTheme} from '../ThemeContext';
import {loadDatail} from './loadData';
import useSpeakerPicker from './speakerPicker';
import ActivityIndicatorLoading from './ActivityIndicatorLoading';

const Etiquette = ({route}) => {
  const scrollViewRef = useRef(null);
  const {isDarkMode} = useTheme();
  const styles = analyzeStyle(isDarkMode);
  const [CommentHeight, setCommentHeight] = useState(0); //ScrollToItem을 위한 변수, 값을 계산하기 위해 사용, 동적인 높이를 위해 사용
  const [detailList, setDetailList] = useState(undefined);
  const [speaker, setSpeaker] = useState([]); //speaker 목록을 저장하기 위한 변수, Picker에 사용

  const {selpeaker, renderSpeakerPicker} = useSpeakerPicker(speaker);

  useEffect(() => {
    const fetchData = async () => {
      // console.log('historykey1:', route.params.historyKey);
      const data = await loadDatail(route.params.historyKey);
      // console.log('data:', data);
      setDetailList(data);
      setSpeakerList(data);
    };
    //새로 함수를 안만들고 진행시 비동기 문제 발생 해결하기 위해 data가 들어오면 실행시키기 위함
    const setSpeakerList = data => {
      const speakerList = [];
      data.map(item => {
        speakerList.push(item.speaker);
      });
      // console.log('speakerList:', speakerList);
      setSpeaker(speakerList);
    };
    fetchData();
  }, [route.params.historyKey]);

  const DrawTable = ({scrollViewRef}) => {
    //해당 standard의 comment를 이동하기 위한 함수
    const scrollToItem = index => {
      // scrollTo 위치 계산
      scrollViewRef.current.scrollTo({
        y: index * CommentHeight,
        animated: true,
      });
    };
    return detailList ? (
      <View style={styles.tableView}>
        <View style={{flex: 5}}>
          {detailList[selpeaker]?.detailInfo.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                alignItems: 'center',
              }}
              //해당 standard의 comment로 이동
              onPress={() => {
                scrollToItem(index);
              }}>
              <View style={styles.standardView}>
                <View style={styles.tablelabelTextView}>
                  <Text style={styles.tablelabelText}>{item.label}</Text>
                </View>
                <View style={styles.heightLine} />
                <View style={styles.tableScoreTextView}>
                  <Text style={styles.tableScoreText}>
                    {item.detailScore} 점입니다.
                  </Text>
                </View>
              </View>
              {index !== detailList[selpeaker].detailInfo.length - 1 ? (
                <View style={styles.widthLine} />
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.heightLine} />
        <View key="3210" style={styles.tableTotalScoreView}>
          <View style={styles.tableTotalScoreTitleTextView}>
            <Text style={styles.tableTotalScoreTitleText}> 총 점수 </Text>
          </View>
          <View style={styles.widthLine} />
          <View style={styles.tableTotalScoreTextView}>
            <Text style={styles.tableTotalScoreText}>
              {detailList[selpeaker].totalScore}
            </Text>
          </View>
        </View>
      </View>
    ) : null;
  };
  //Standard Comment의 세로 길이를 계산하기 위한 함수
  const handleLayout = (index, event) => {
    const {width, height} = event.nativeEvent.layout;
    setCommentHeight(height);
    // console.log(index, '컴포넌트의 세로 길이:', height);
  };
  return detailList ? (
    <View key="3000" style={styles.container}>
      <View key="3100" style={styles.headerStyle}>
        <Text style={styles.headerTextStyle}>예절 분석 결과</Text>
        <View key="3110" style={{flex: 1}}>
          {/* <SpeakerPicker /> */}
          {renderSpeakerPicker()}
        </View>
      </View>
      {/* standard | score 테이블 그리기 */}
      <DrawTable scrollViewRef={scrollViewRef} />
      <View style={styles.widthLine} />

      <ScrollView key="3300" ref={scrollViewRef} style={{flex: 5}}>
        {detailList[selpeaker].detailInfo.map((item, labelIndex) => {
          const infoKey = item.label + labelIndex.toString();
          return (
            <View key={infoKey}>
              <View
                style={styles.standardView}
                onLayout={event => handleLayout(labelIndex, event)}>
                <View style={styles.tablelabelTextView}>
                  <Text style={styles.tablelabelText}>{item.label}</Text>
                </View>
                <View style={styles.heightLine} />
                <View style={styles.standardCommentView}>
                  {item.exampleText.map((item, index) => {
                    const key = infoKey + index.toString();
                    return (
                      <View key={key} style={styles.standardcommentTextView}>
                        <Text style={styles.standardCommentText}>
                          {item.chatContent}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {labelIndex !== detailList[selpeaker].detailInfo.length - 1 ? (
                <View style={styles.widthLine} />
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </View>
  ) : (
    <ActivityIndicatorLoading />
  );
};

export default Etiquette;
