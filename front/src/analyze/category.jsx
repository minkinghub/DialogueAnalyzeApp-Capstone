import {View, Text, Image} from 'react-native';
import {useTheme} from '../ThemeContext';
import {useEffect, useState} from 'react';
import {loadDatail} from './loadData';
import useSpeakerPicker from './speakerPicker';
import ActivityIndicatorLoading from './ActivityIndicatorLoading';
import categoryStyles from './stylesFile/category.style';
import categoryComment from '../../assets/categoryComment';

const Category = ({route}) => {
  const historyKey = route.params.historyKey;

  const [detailList, setDetailList] = useState([]);
  const [speaker, setSpeaker] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const {selpeaker, renderSpeakerPicker} = useSpeakerPicker(speaker);

  const {isDarkMode} = useTheme();
  const styles = categoryStyles(isDarkMode);
  const selpeakerType = detailList[selpeaker]?.type;
  const typeKr = [
    '화가',
    '불감', // EM형 1
    '불맞', // GM형 2
    '불존', // PM형 3
    '맞존', // GP형 4
    '맞감', // EG형 5
    '존감', // EP형 6
    '비화가',
  ];
  const imageMap = {
    top: require('../../assets/images/type/top.png'),
    em: require('../../assets/images/type/em.png'),
    gm: require('../../assets/images/type/gm.png'),
    pm: require('../../assets/images/type/pm.png'),
    gp: require('../../assets/images/type/gp.png'),
    eg: require('../../assets/images/type/eg.png'),
    ep: require('../../assets/images/type/ep.png'),
    bottom: require('../../assets/images/type/bottom.png'),
  };
  const typeEn = ['top', 'em', 'gm', 'pm', 'gp', 'eg', 'ep', 'bottom'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await loadDatail(historyKey);
        console.log('category data:', data.conversationType);
        setDetailList(data.conversationType);
        setSpeakerList(data.conversationType);
      } catch (error) {
        console.error(error);
      }
    };
    //참여한 화자의 데이터 가져오기
    const setSpeakerList = data => {
      const speakerList = [];
      data.map(item => {
        speakerList.push(item.speaker);
      });
      setSpeaker(speakerList);
    };

    fetchData();
  }, [historyKey]);

  useEffect(() => {
    if (detailList.length > 0) {
      setImageUrl(typeEn[selpeakerType]);
      console.log('selpeakerType:', selpeakerType);
    }
  }, [detailList, selpeaker]);

  return detailList && imageUrl ? (
    <View style={styles.container}>
      <View key="2100" style={styles.headerStyle}>
        <Text style={styles.headerTextStyle}>타입 분석 결과</Text>
        <View key="2110" style={{width: '32%'}}>
          {renderSpeakerPicker()}
        </View>
      </View>

      <View style={{flex: 1, padding: 20}}>
        <View style={styles.typeStyle}>
          <Text style={styles.typeTextStyle}>
            {speaker[selpeaker]}님은 {typeKr[selpeakerType]}형입니다.
          </Text>
        </View>

        <View style={styles.lineStyle} />

        <View style={styles.imageViewStyle}>
          <Text style={styles.imageViewText}>당신의 유형에 맞는 이미지</Text>
          <Image
            source={imageMap[imageUrl]}
            style={{width: 248, height: 248}}
          />
        </View>

        <View style={styles.lineStyle} />

        <View style={styles.commentBox}>
          <Text style={styles.commentTextStyle}>
            {categoryComment[typeEn[selpeakerType]]}
          </Text>
        </View>
      </View>
    </View>
  ) : (
    <ActivityIndicatorLoading />
  );
};

export default Category;
