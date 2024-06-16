import {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {loadList} from '../utilities/API/loadData';
import {ActivityIndicatorLoading} from '../utilities/analyze/utilities';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../utilities/Theme/ThemeContext';
import historyStyle from '../stylesFile/history.style';

const History = () => {
  const navigation = useNavigation(); // 네비게이션 객체
  const [historyList, setHistoryList] = useState(null);
  const {isDarkMode} = useTheme();
  const styles = historyStyle(isDarkMode);

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadList();
      const sortedData = data.sort(
        (a, b) => new Date(b.uploadTime) - new Date(a.uploadTime),
      );
      setHistoryList(sortedData);

      // console.log('data:', data);
    };
    fetchData();
  }, []);

  const handlePress = item => {
    const analyzeType = item.analysisType ? 'Etiquette' : 'Category';
    navigation.push('Etiquette', {
      historyKey: item._id,
    });
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
      .format(date)
      .replace(/\. /g, '-')
      .replace(/ /g, ' / ')
      .replace(':', ' ');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>분석 결과</Text>
      {historyList === null ? (
        <ActivityIndicatorLoading />
      ) : historyList.length === 0 ? (
        <View style={styles.errorView}>
          <Text style={styles.errorTextTitle}>데이터가 없습니다. </Text>
          <Text style={styles.errorText}>
            {'\n'}대화 분석 페이지에서{'\n'} 분석을 진행해주세요.
          </Text>
        </View>
      ) : (
        <ScrollView>
          {historyList.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.item}
              onPress={() => handlePress(item)}>
              <View style={styles.itemTitle}>
                <Text style={styles.itemTitleName}>{item.chatName}</Text>

                <View style={styles.itemTime}>
                  <Text style={styles.itemTimeText}>
                    {formatDate(item.uploadTime)}
                  </Text>
                  {/* {console.log('item:', item.uploadTime)} */}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};
export default History;
