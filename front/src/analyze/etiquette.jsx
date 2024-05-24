//보고있는 기준 테두리 표시
//총점수 표시
import React, {useRef, useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {useTheme} from '../ThemeContext';
import {loadDatail} from './loadData';
import useSpeakerPicker from './speakerPicker';
import ActivityIndicatorLoading from './ActivityIndicatorLoading';
import etiquetteStyles from './stylesFile/etiquette.style';

const Etiquette = ({route}) => {
  const scrollViewRef = useRef(null);
  const historyKey = route.params.historyKey;
  const [CommentHeight, setCommentHeight] = useState([]); //ScrollToItem을 위한 변수, 값을 계산하기 위해 사용, 동적인 높이를 위해 사용
  const [detailList, setDetailList] = useState(undefined);
  const [speaker, setSpeaker] = useState([]); //speaker 목록을 저장하기 위한 변수, Picker에 사용
  const {selpeaker, renderSpeakerPicker} = useSpeakerPicker(speaker);

  const {isDarkMode} = useTheme();
  const styles = etiquetteStyles(isDarkMode);

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadDatail(historyKey);
      console.log('data.detailList:', data.detailList);
      setDetailList(data.detailList);
      setSpeakerList(data.detailList);
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
  }, [historyKey]);
  const labelKr = item => {
    if (item === 'polite') {
      return '존댓말';
    } else if (item === 'moral') {
      return '불쾌발언';
    } else if (item === 'grammar') {
      return '맞춤법';
    } else if (item === 'positive') {
      return '감정';
    }
  };
  const DrawTable = ({scrollViewRef}) => {
    //해당 standard의 comment를 이동하기 위한 함수
    const scrollToItem = index => {
      // scrollTo 위치 계산
      let nowHeight = 0;
      for (let i = 0; i < index; i++) {
        nowHeight += CommentHeight[i];
      }
      scrollViewRef.current.scrollTo({
        y: nowHeight,
        animated: true,
      });
    };
    return detailList ? (
      <View style={styles.tableView}>
        <Text style={styles.tableComment}>기준 클릭시 상세 내용으로 이동</Text>
        {detailList[selpeaker]?.detailInfo.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.labelView}
            //해당 standard의 comment로 이동
            onPress={() => {
              scrollToItem(index);
            }}>
            <View style={styles.labelTextView}>
              <Text style={styles.labelText}>{labelKr(item.label)}</Text>
            </View>
            <View style={styles.lableScoreTextView}>
              <Text style={styles.lableScoreText}>
                {item.detailScore} 점입니다.
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    ) : null;
  };
  //Standard Comment의 세로 길이를 계산하기 위한 함수

  const handleLayout = (index, event) => {
    const height = event.nativeEvent.layout.height;
    // console.log('height:', height);
    setCommentHeight([...CommentHeight, height]);
  };
  return detailList ? (
    <View key="3000" style={styles.container}>
      <View key="3100" style={styles.headerStyle}>
        <Text style={styles.headerTextStyle}>예절 분석 결과</Text>
        <View key="3110" style={{width: '32%'}}>
          {/* <SpeakerPicker /> */}
          {renderSpeakerPicker()}
        </View>
      </View>

      <DrawTable scrollViewRef={scrollViewRef} />

      <ScrollView key="3300" ref={scrollViewRef} style={styles.scrollView}>
        {detailList[selpeaker].detailInfo.map((item, labelIndex) => {
          // console.log(item.label, ': ', item);
          const infoKey = item.label + labelIndex.toString();
          return (
            <View
              key={infoKey}
              style={styles.commentView}
              onLayout={event => handleLayout(labelIndex, event)}>
              <View style={styles.commentLabelTextView}>
                <Text style={styles.commentLabelText}>
                  {labelKr(item.label)}
                </Text>
              </View>
              <View style={styles.commentExView}>
                {item.exampleText.map((item, index) => {
                  const key = infoKey + index.toString();
                  // console.log('item:', item);
                  return (
                    <View key={key} style={{margin: 5}}>
                      <View style={styles.commentExTextView}>
                        <View style={styles.commentTitleTextView}>
                          <Text
                            style={[styles.commentTitleText, {fontSize: 16}]}>
                            대화내용
                          </Text>
                        </View>
                        <Text style={styles.commentExText}>
                          {item.chatContent}
                        </Text>
                      </View>
                      <View style={styles.commentExTextView}>
                        <View style={styles.commentTitleTextView}>
                          <Text
                            style={[styles.commentTitleText, {fontSize: 12}]}>
                            감지된 표현
                          </Text>
                        </View>
                        <Text style={styles.commentExText}>
                          {item.isStandard}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
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
