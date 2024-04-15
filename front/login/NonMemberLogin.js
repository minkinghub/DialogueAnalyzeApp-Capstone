// import React, { useState, useEffect } from 'react';
// import { View, Text, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { Picker } from '@react-native-picker/picker';

// const NonMemberLogin = () => {
//     const navigation = useNavigation(); // 네비게이션 객체
//     const [nickname,setNickname] = useState('');
//     const [age, setAge] = useState('10s');
//     const [gender,setGender] = useState('');

//     const handleNonMemberLogin = () => {
//         if(nickname !== '') {
//             if(age !== '') {
//                 if(gender !== '') {
//                     console.log(`non_member login \n${nickname}\n${age}\n${gender}`);
//                     navigation.navigate('Analyze', { is_login: is_login });
//                 } else Alert.alert('안내','성별을 선택해주세요.');
//             } else Alert.alert('안내','연령대을 선택해주세요.');
//         } else Alert.alert('안내','카카오톡 닉네임을 입력해주세요.');
//     };

//     return (
//         <SafeAreaView style={{flex: 1, backgroundColor: '#fff',}}>
//             <View style={{justifyContent: 'center', alignItems: 'center',}}>
//                 <Text style={{margin: 20, fontSize: 30}}>LOGO</Text>
//             </View>

//             <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
//                 <TextInput
//                     style={{
//                         width: '80%',
//                         marginBottom: 10,
//                         borderWidth: 1,
//                         borderColor: '#ffeb01',
//                         padding: 10,
//                         borderRadius: 10,
//                     }}
//                     placeholder="닉네임 입력"
//                     value={nickname}
//                     onChangeText={setNickname}
//                 />

//                 <Picker
//                     selectedValue={age}
//                     style={{height: 50, width: '80%'}}
//                     onValueChange={(itemValue, itemIndex) => setAge(itemValue)}>
//                     <Picker.Item label="10대" value="10s" />
//                     <Picker.Item label="20대" value="20s" />
//                     <Picker.Item label="30대" value="30s" />
//                     <Picker.Item label="40대" value="40s" />
//                     <Picker.Item label="50대 이상" value="50s" />
//                 </Picker>

//                 <View style={{flexDirection: 'row', margin: 10}}>
                    
//                     <TouchableOpacity
//                         style={[styles.genderButton, gender === 'male' && styles.selectedGenderButton]}
//                         onPress={() => setGender('male')}
//                     >
//                         <Text style={{color: gender === 'male' ? '#FFF' : '#000'}}> 남성</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                         style={[styles.genderButton, gender === 'female' && styles.selectedGenderButton]}
//                         onPress={() => setGender('female')}
//                     >
//                         <Text style={{color: gender === 'female' ? '#FFF' : '#000'}}>여성</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>

//             <View style={{justifyContent: 'center', alignItems: 'center', padding: 10}}>
//                 <TouchableOpacity style={{
//                     backgroundColor: 'orange',
//                     alignItems: 'center',
//                     padding: 10,
//                     width: '80%',
//                     margin: 10,
//                     borderRadius: 10,
//                     borderWidth: 0.5
//                 }} onPress={handleNonMemberLogin}>
//                     <Text style={{color: 'white', fontSize: 20}}>입력완료</Text>
//                 </TouchableOpacity>
//             </View>

//         </SafeAreaView>
        
//     );
// }

// const styles = StyleSheet.create({
//     genderButton: {
//         marginHorizontal: 5,
//         paddingHorizontal: 10,
//         paddingVertical: 5,
//         borderWidth: 0.5,
//         borderColor: '#000',
//         borderRadius: 20,
//     },
//     selectedGenderButton: {
//         backgroundColor: '#007bff',
//         borderColor: '#007bff',
//     },
// })
// export default NonMemberLogin;