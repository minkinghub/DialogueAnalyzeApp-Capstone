import {View, Text, Image} from 'react-native';
import analyzeStyle from './analyze.style';
import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {loadDatail} from './loadData';
import useSpeakerPicker from './speakerPicker';
import ActivityIndicatorLoading from './ActivityIndicatorLoading';
import categoryComment from './categoryComment';

const Category = ({route}) => {
  const [detailList, setDetailList] = useState([]);
  const [speaker, setSpeaker] = useState([]);
  const [type, setType] = useState('');
  const [imageUrl, setImageUrl] = useState();
  const {selpeaker, renderSpeakerPicker} = useSpeakerPicker(speaker);

  const {isDarkMode} = useTheme();
  const styles = analyzeStyle(isDarkMode);

  const typeKr = [
    '존불',
    '존맞',
    '존감',
    '불맞',
    '불감',
    '맞감',
    '화가',
    '비화가',
  ];
  const imageMap = {
    pm: require('../../assets/images/type/pm.png'),
    pg: require('../../assets/images/type/pg.png'),
    pe: require('../../assets/images/type/pe.png'),
    mg: require('../../assets/images/type/mg.png'),
    me: require('../../assets/images/type/me.png'),
    ge: require('../../assets/images/type/ge.png'),
    top: require('../../assets/images/type/top.png'),
    bottom: require('../../assets/images/type/bottom.png'),
  };
  const typeEn = ['pm', 'pg', 'pe', 'mg', 'me', 'ge', 'top', 'bottom'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadDatail(route.params.historyKey);
        setDetailList(data);
        setSpeakerList(data);
      } catch (error) {
        console.error(error);
      }
    };

    const setSpeakerList = data => {
      const speakerList = data.map(item => item.speaker);
      setSpeaker(speakerList);
    };

    fetchData();
  }, [route.params.historyKey]);

  useEffect(() => {
    if (detailList.length > 0) {
      const type = typeExtract(detailList);
      setType(type);
      setImageUrl(typeEn[type]);
    }
  }, [detailList, selpeaker]);

  const typeExtract = data => {
    if (data && data[selpeaker]) {
      const scoreList = data[selpeaker].detailInfo.map(
        item => item.detailScore,
      );
      const highScoreIndexes = getHighScoreIndexes(scoreList);

      const allScoresBelowFive = scoreList.every(score => score < 5); // 모든 점수가 5점 미만일 때
      if (allScoresBelowFive) return 7; // 비화가

      const sumList = scoreList.reduce((a, b) => a + b, 0); // 점수 합계
      if (sumList >= 80) return 6; // 합계 80점 이상일 때 화가

      const typeMap = {
        '0,1': 0,
        '0,2': 1,
        '0,3': 2,
        '1,2': 3,
        '1,3': 4,
        '2,3': 5,
      };

      return typeMap[highScoreIndexes.join(',')] ?? 7;
    }
  };

  const getHighScoreIndexes = scoreList => {
    const indexes = [];
    for (let i = 0; i < 2; i++) {
      const max = Math.max(...scoreList);
      const index = scoreList.indexOf(max);
      indexes.push(index);
      scoreList[index] = 0;
    }
    return indexes.sort();
  };

  return detailList ? (
    <View style={styles.container}>
      <View key="2100" style={styles.headerStyle}>
        <Text style={styles.headerTextStyle}>유형 분석 결과</Text>
        <View key="2110" style={{flex: 1}}>
          {renderSpeakerPicker()}
        </View>
      </View>

      <View>
        <View style={styles.typeStyle}>
          <Text style={styles.typeTextStyle}>
            {speaker[selpeaker]}님은 {typeKr[type]}형입니다.
          </Text>
        </View>

        <View style={styles.widthLine} />
        <View style={styles.imageViewStyle}>
          <Text style={styles.typeTextStyle}>당신의 유형에 맞는 이미지</Text>
          <Image
            source={imageMap[imageUrl]}
            style={{width: 248, height: 248}}
          />
        </View>
        <View style={styles.lineStyle} />
        <View style={styles.commentBox}>
          <Text style={styles.commentTextStyle}>
            {categoryComment[typeEn[type]]}
          </Text>
        </View>
      </View>
    </View>
  ) : (
    <ActivityIndicatorLoading />
  );
};

export default Category;
