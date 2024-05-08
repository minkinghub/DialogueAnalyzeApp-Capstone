import React, {useRef, useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import analyzeStyle from './analyze.style';
import {useTheme} from '../ThemeContext';
import {Picker} from '@react-native-picker/picker';
import {loadDatail} from './loadData';
import History from '../myPage/history';

const Etiquette = () => {
  const scrollViewRef = useRef(null);
  const {isDarkMode, historykey} = useTheme();
  const styles = analyzeStyle(isDarkMode);
  const [CommentHeight, setCommentHeight] = useState(0); //ScrollToItem을 위한 변수, 값을 계산하기 위해 사용, 동적인 높이를 위해 사용
  const [detailList, setDetailList] = useState([]);
  const [selectedSpeaker, setSelectedSpeaker] = useState(0);
  const [speaker, setSpeaker] = useState([]); //speaker 목록을 저장하기 위한 변수, Picker에 사용
  const [isLoading, setIsLoading] = useState(true);
  let a = 0;
  useEffect(() => {
    console.log('speaker:', speaker);
  }, [speaker]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await loadDatail();
      console.log('data:', data);
      setDetailList(data);
      setIsLoading(false);
      setSpeakerList(data);
    };
    const setSpeakerList = data => {
      const speakerList = [];
      data.map(item => {
        speakerList.push(item.speaker);
      });
      console.log('speakerList:', speakerList);
      setSpeaker(speakerList);
    };
    fetchData();
  }, [historykey]);

  const SpeakerPicker = () => {
    let key = 3111;
    if (speaker && speaker.length > 0) {
      return (
        <Picker
          selectedValue={selectedSpeaker}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedSpeaker(itemIndex)
          }
          style={styles.pickerStyle}>
          {speaker.map((item, index) => (
            <Picker.Item label={item} value={index} key={toString(key++)} />
          ))}
        </Picker>
      );
    } else {
      // speaker가 비어있거나 정의되지 않은 경우, null 또는 로딩 표시 등을 반환
      return null;
    }
  };

  const DrawTable = ({scrollViewRef}) => {
    //해당 standard의 comment를 이동하기 위한 함수
    const scrollToItem = index => {
      // scrollTo 위치 계산
      scrollViewRef.current.scrollTo({
        y: index * CommentHeight,
        animated: true,
      });
    };
    return (
      <View style={styles.tableView}>
        <View style={{flex: 5}}>
          {detailList[selectedSpeaker].detailInfo.map((item, index) => (
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
              {index !== detailList[selectedSpeaker].detailInfo.length - 1 ? (
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
              {detailList[selectedSpeaker].totalScore}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  //Standard Comment의 세로 길이를 계산하기 위한 함수
  const handleLayout = (index, event) => {
    const {width, height} = event.nativeEvent.layout;
    setCommentHeight(height);
    // console.log(index, '컴포넌트의 세로 길이:', height);
  };
  return isLoading ? (
    <ActivityIndicator size="large" color="#0000ff" />
  ) : (
    <View key="3000" style={styles.container}>
      <View key="3100" style={styles.headerStyle}>
        <Text style={styles.headerTextStyle}>예절 분석 결과</Text>
        <View key="3110" style={{flex: 1}}>
          <SpeakerPicker />
        </View>
      </View>
      {/* standard | score 테이블 그리기 */}
      <DrawTable scrollViewRef={scrollViewRef} />
      <View style={styles.widthLine} />

      <ScrollView key="3300" ref={scrollViewRef} style={{flex: 5}}>
        {detailList[selectedSpeaker].detailInfo.map((item, labelIndex) => {
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

              {labelIndex !==
              detailList[selectedSpeaker].detailInfo.length - 1 ? (
                <View style={styles.widthLine} />
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Etiquette;
