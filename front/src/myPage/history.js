import {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {loadList} from '../analyze/loadData';
import ActivityIndicatorLoading from '../analyze/ActivityIndicatorLoading';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

/* 분석 결과 보여주는 페이지
타입분석, 예절 분석결과 보여줘야함
.map으로 리스트 출력 
사용자가 원하는 분석 결과를 선택할 수 있게 해야함
analyze폴더에 타입분석, 예절분석에 맞는 페이지로 이동 후 결과 출력
*/

const History = () => {
  const navigation = useNavigation(); // 네비게이션 객체
  const [historyList, setHistoryList] = useState(undefined);
  useEffect(() => {
    const fetchData = async () => {
      const data = await loadList();
      setHistoryList(data);
      console.log('data:', data);
    };
    fetchData();
  }, []);
  const handlePress = item => {
    navigation.push(item.dataType ? 'Category' : 'Etiquette', {
      historyKey: item._id,
    });
  };
  return (
    <View>
      <Text>분석 결과</Text>
      {historyList ? (
        <ScrollView>
          {historyList.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{flexDirection: 'row'}}
              // onPress={handlePress(item)}
            >
              <Text>{item.chatName}</Text>
              <Text>{item.uploadTime}</Text>
              <Text>{item.dataType ? '예절분석' : '타입분석'}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <ActivityIndicatorLoading />
      )}
    </View>
  );
};

export default History;
