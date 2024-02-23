import React, { useState } from 'react';
import { Platform } from 'react-native';
import { View, Text, StyleSheet, TextInput, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const Board = () => {
  const [title, setTitle] = useState('');
  const [selectedValue, setSelectedValue] = useState('recent');
  const [posts, setPosts] = useState([
    { id: '1', title: '첫 번째 게시글', content: '조회수 0     추천 0' },
    { id: '2', title: '두 번째 게시글', content: '조회수 0     추천 0' },
    { id: '3', title: '세 번째 게시글', content: '조회수 0     추천 0' },
  ]);

  const renderPost = ({ item }) => (
    <TouchableOpacity  style={styles.postContainer}>
      <Text style={{fontSize: 16, fontWeight: 'bold',}}>{item.title}</Text>
      <Text style={{fontSize: 10}}>{item.content}</Text>
    </TouchableOpacity >
  );

  if (Platform.OS === 'web'){
    // 웹 컴포넌트
  } else {

    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff',}}>
          <View style={{backgroundColor: '#90EE90', height: 35}}> 
              <Text style={{fontSize: 24, fontWeight: 'bold'}}> Calendar Recipe</Text>
          </View> 
          <View style={styles.container}>
              
              <View style={styles.searchBox}>
                  <Text>사용자 게시판</Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TextInput
                          style={styles.input}
                          placeholder="검색어를 입력하세요"
                          value={title}
                          onChangeText={setTitle}
                      />
                      <TouchableOpacity >
                          <Text style={{fontSize: 18, padding: 10}}>검색</Text>
                      </TouchableOpacity>
                  </View>
              </View>
  
              {/* 콤보박스 */}
              <Picker
                  selectedValue={selectedValue}
                  style={{height: 50, width: 150}}
                  onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
              >
                  <Picker.Item label="최신순" value="recent" />
                  <Picker.Item label="조회순" value="check" />
                  <Picker.Item label="추천순" value="suggestion" />
                  <Picker.Item label="댓글순" value="comment" />
              </Picker>

              <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={item => item.id}
              />
          </View>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    backgroundColor: '#f2f2f2', // 회색 배경 추가
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '80%',
    padding: 10,
    backgroundColor: 'white',
    height: 40,
    marginRight: 10,
  },
  postContainer: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default Board;