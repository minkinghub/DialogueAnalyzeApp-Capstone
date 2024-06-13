import React, {useRef, useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {useTheme} from '../ThemeContext';
import {loadDatail} from './loadData';
import useSpeakerPicker from './speakerPicker';
import ActivityIndicatorLoading from './ActivityIndicatorLoading';
import etiquetteStyles from './stylesFile/etiquette.style';
import {labelKr, commentType} from './utilities';

const Etiquette = ({route}) => {
  const scrollViewRef = useRef(null);
  const historyKey = route.params.historyKey;
  const [CommentHeight, setCommentHeight] = useState([]); // ScrollToItem을 위한 변수, 값을 계산하기 위해 사용, 동적인 높이를 위해 사용
  const [detailList, setDetailList] = useState(undefined);
  const [speaker, setSpeaker] = useState([]); // speaker 목록을 저장하기 위한 변수, Picker에 사용
  const {selpeaker, renderSpeakerPicker} = useSpeakerPicker(speaker);
  const [currentLabelIndex, setCurrentLabelIndex] = useState(0); // 현재 보고 있는 항목의 인덱스 저장

  const {isDarkMode} = useTheme();
  const styles = etiquetteStyles(isDarkMode);
  const isStandardData = [
    {
      label: 0,
      count: 4,
    },
    {
      label: 1,
      count: 3,
    },
    {
      label: 2,
      count: 1,
    },
    {
      label: 3,
      count: 0,
    },
    {
      label: 4,
      count: 11,
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      const data = await loadDatail(historyKey);
      // console.log('data.detailList:', data.detailList);
      setDetailList(data.detailList);
      setSpeakerList(data.detailList);
    };
    // 새로 함수를 안만들고 진행시 비동기 문제 발생 해결하기 위해 data가 들어오면 실행시키기 위함
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

  const DrawTable = ({scrollViewRef}) => {
    // 해당 standard의 comment를 이동하기 위한 함수
    const scrollToItem = index => {
      // scrollTo 위치 계산
      let nowHeight = 0;
      for (let i = 0; i < index; i++) {
        nowHeight += CommentHeight[i] || 0;
      }
      scrollViewRef.current.scrollTo({
        y: nowHeight,
        animated: true,
      });
    };

    return detailList ? (
      <View style={styles.tableView}>
        <Text style={styles.tableComment}>기준 클릭시 상세 내용으로 이동</Text>
        <View style={styles.tableTitleView}>
          <Text style={styles.tableTitle}>없음</Text>
          <Text style={styles.tableTitle}>사용 빈도 </Text>
          <Text style={styles.tableTitle}>있음</Text>
        </View>
        {detailList[selpeaker]?.detailInfo.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.labelView,
              currentLabelIndex === index && styles.HighlightStyle,
            ]}
            // 해당 standard의 comment로 이동
            onPress={() => {
              scrollToItem(index);
            }}>
            <View style={styles.labelTextView}>
              <Text
                style={[
                  styles.labelText,
                  currentLabelIndex === index && styles.HighlightTextStyle,
                ]}>
                {labelKr(item.label)}
              </Text>
            </View>
            <View style={styles.lableScoreTextView}>
              <Text style={styles.lableScoreText}>
                {100 - item.detailScore}%
              </Text>
              <View style={styles.scoreBar}>
                <View style={styles.scoreBarGood}>
                  <View
                    style={[
                      styles.scoreBarNotWaring,
                      {
                        width: item.detailScore + '%',
                      },
                    ]}
                  />
                </View>

                <View style={styles.scoreBarNotWaring}>
                  <View
                    style={[
                      styles.scoreBarWaring,
                      {
                        width: item.detailScore + '%',
                      },
                    ]}
                  />
                </View>
              </View>
              <Text style={styles.lableScoreText}>{item.detailScore}%</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    ) : null;
  };

  // Standard Comment의 세로 길이를 계산하기 위한 함수
  const handleLayout = (index, event) => {
    const height = event.nativeEvent.layout.height;
    // height 값을 업데이트하기 위해 이전 높이 배열을 복사하여 수정합니다.
    setCommentHeight(prevHeights => {
      const newHeights = [...prevHeights];
      newHeights[index] = height;
      return newHeights;
    });
  };

  // 스크롤 이벤트 핸들러
  const handleScroll = event => {
    const yOffset = event.nativeEvent.contentOffset.y;
    let nowHeight = 0;
    for (let i = 0; i < CommentHeight.length; i++) {
      nowHeight += CommentHeight[i] || 0;
      if (yOffset < nowHeight) {
        setCurrentLabelIndex(i);
        break;
      }
    }
  };

  return detailList ? (
    <View key="3000" style={styles.container}>
      <View key="3100" style={styles.headerStyle}>
        <Text style={styles.headerTextStyle}>분석 결과</Text>
        <View key="3110" style={{width: '32%'}}>
          {renderSpeakerPicker()}
        </View>
      </View>

      <DrawTable scrollViewRef={scrollViewRef} />

      <View style={styles.scrollViewContainer}>
        <ScrollView
          key="3300"
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}>
          {detailList[selpeaker].detailInfo.map((infoItem, labelIndex) => {
            const infoKey = infoItem.label + labelIndex.toString();
            // const info = infoItem.exampleText.length;
            return (
              <View
                key={infoKey}
                style={styles.commentView}
                onLayout={event => handleLayout(labelIndex, event)}>
                <View style={styles.commentLabelTextView}>
                  <Text style={styles.commentLabelText}>
                    {labelKr(infoItem.label)}
                  </Text>
                </View>
                <View style={styles.commentExView}>
                  {infoItem.exampleText ? (
                    <View
                      style={{
                        borderWidth: 1,
                      }}>
                      <Text style={styles.commentExCount}>
                        발견된 표현 갯수: {infoItem.exampleText.length}
                      </Text>
                      {
                        // isStandardData
                        infoItem.label === 'moral' ||
                        infoItem.label === 'positive' ? (
                          <View
                            style={{
                              flexDirection: 'row',
                              margin: 3,
                              paddingVertical: 3,
                              justifyContent: 'space-around',
                            }}>
                            {isStandardData.map(
                              item =>
                                item.count > 0 && (
                                  <View
                                    style={{
                                      // backgroundColor: 'gray',
                                      alignItems: 'center',
                                    }}>
                                    <Text
                                      style={{
                                        borderBottomWidth: 1,
                                        fontSize: 16,
                                        paddingVertical: 5,
                                      }}>
                                      {commentType(infoItem.label, item.label)}
                                    </Text>
                                    <Text style={{margin: 3, fontSize: 14}}>
                                      {item.count}
                                    </Text>
                                  </View>
                                ),
                            )}
                          </View>
                        ) : null
                      }
                    </View>
                  ) : null}
                  {infoItem.exampleText ? (
                    infoItem.exampleText.map((item, index) => {
                      const key = infoKey + index.toString();
                      return (
                        <View key={key} style={{margin: 5}}>
                          <View style={styles.commentExTextView}>
                            <View style={styles.commentTitleTextView}>
                              <Text
                                style={[
                                  styles.commentTitleText,
                                  {fontSize: 16},
                                ]}>
                                대화내용
                              </Text>
                            </View>
                            <Text style={styles.commentExText}>
                              {item.chatContent}
                            </Text>
                          </View>
                          {
                            // 불쾌한 발언, 감정 표현일 경우에만 표시
                            infoItem.label === 'moral' ||
                            infoItem.label === 'positive' ? (
                              <View style={styles.commentExTextView}>
                                <View style={styles.commentTitleTextView}>
                                  <Text
                                    style={[
                                      styles.commentTitleText,
                                      {fontSize: 12},
                                    ]}>
                                    감지된 표현
                                  </Text>
                                </View>
                                <Text style={styles.commentExText}>
                                  {commentType(infoItem.label, item.isStandard)}
                                  이 감지되었습니다.
                                </Text>
                              </View>
                            ) : null
                          }
                        </View>
                      );
                    })
                  ) : (
                    //만점을 맞았을 경우 없음을 표시
                    <View style={styles.anyThingTextView}>
                      <Text style={styles.anyThingText}>
                        감지된 표현이 없습니다.
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  ) : (
    <ActivityIndicatorLoading />
  );
};

export default Etiquette;
