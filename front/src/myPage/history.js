import {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {loadList} from '../analyze/loadData';
import ActivityIndicatorLoading from '../analyze/ActivityIndicatorLoading';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

const History = () => {
  const navigation = useNavigation(); // 네비게이션 객체
  const [historyList, setHistoryList] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadList();
      const sortedData = data.sort(
        (a, b) => new Date(b.uploadTime) - new Date(a.uploadTime),
      );
      setHistoryList(sortedData);

      console.log('data:', data);
    };
    fetchData();
  }, []);

  const handlePress = item => {
    const type = item.dataType ? 'Category' : 'Etiquette';
    navigation.push(type, {
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
        <Text>데이터가 없습니다.</Text>
      ) : (
        <ScrollView>
          {historyList.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.item}
              onPress={() => handlePress(item)}>
              <Text>{item.chatName}</Text>
              <Text>{formatDate(item.uploadTime)}</Text>
              {/* <Text>{item.dataType ? '예절분석' : '타입분석'}</Text> */}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  chatName: {
    fontSize: 16,
  },
  uploadTime: {
    fontSize: 14,
    color: '#888',
  },
  dataType: {
    fontSize: 14,
    color: '#444',
  },
});

export default History;
