import {View, Text, Image, ActivityIndicator} from 'react-native';
import analyzeStyle from './analyze.style';
import {useTheme} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import loadData from './loadData';
import SpeakerPicker from './speakerPicker';
// 타입 분석
const Category = () => {
  const {isDarkMode, historyKey} = useTheme();
  const styles = analyzeStyle(isDarkMode);
  const [detailList, setDetailList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [speaker, setSpeaker] = useState([]);
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
  const [type, setType] = useState('');
  const [imageUrl, setImageUrl] = useState();
  const {selpeaker, renderSpeakerPicker} = SpeakerPicker(speaker);
  console.log('selpeaker:', selpeaker);

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadData();
      setDetailList(data);
      setSpeakerList(data);
      const type = typeExract(data);
      setType(type);
      setImageUrl(typeEn[type]);
      setIsLoading(false);
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
  }, [historyKey]);
  const typeExract = data => {
    if (data) {
      const scoreList = [];
      data[selpeaker].detailInfo.map(item => {
        scoreList.push(item.detailScore);
      });
      const highScore = () => {
        let max = 0;
        let index = 0;
        const arr = [];
        for (i = 0; i < 2; i++) {
          max = Math.max(...scoreList);
          index = scoreList.indexOf(max);
          arr.push(index);
          scoreList.splice(index, 1, 0);
        }
        return arr.sort();
      };
      //타입 뽑기
      const arr = highScore();
      let sumList = scoreList.reduce((a, b) => a + b, 0);
      if (sumList >= 80) {
        return 6;
      } else if (arr[0] === 0 && arr[1] === 1) {
        return 0;
      } else if (arr[0] === 0 && arr[1] === 2) {
        return 1;
      } else if (arr[0] === 0 && arr[1] === 3) {
        return 2;
      } else if (arr[0] === 1 && arr[1] === 2) {
        return 3;
      } else if (arr[0] === 1 && arr[1] === 3) {
        return 4;
      } else if (arr[0] === 2 && arr[1] === 3) {
        return 5;
      } else if (
        scoreList[0] <= 5 &&
        scoreList[1] <= 5 &&
        scoreList[2] <= 5 &&
        scoreList[3] <= 5
      ) {
        return 7;
      }
    }
  };

  return isLoading ? (
    <ActivityIndicator size="large" color="#0000ff" />
  ) : (
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
            당신은 {typeKr[type]} 형입니다.
          </Text>
        </View>

        <View style={styles.lineStyle} />
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
            COMMENT @@@@@ 2@@@@@@@@ @@@@@@
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Category;
