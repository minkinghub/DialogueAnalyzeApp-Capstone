import React, { useState, useEffect } from 'react';
import { Modal, View, Text, SafeAreaView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { GetToken } from '../component/tokenData/GetToken'; //토큰 불러오기

const Home = () => {
    const [modalVisible, setModalVisible] = useState(false); //modal 표시여부
    const [records, setRecords] = useState([]); //대화 성향 분석 데이터
    const [isFirst, setIsFirst] = useState(''); //토큰 저장
    const [gender, setGender] = useState('male');
    const [birthDate, setBirthDate] = useState('');


    useEffect(() => {
        const checkIsFirst = async () => {
            const loadedTokens = await GetToken();
            if (loadedTokens) {
                setIsFirst(loadedTokens);
            } else {
                console.log('No tokens were loaded'); // 토큰이 없는 경우 메시지 출력
            }
        };

        checkIsFirst();
    }, []);

    useEffect(() => {
        if(isFirst.isFirst === "true"){
            setModalVisible(true);
        }
    }, [isFirst.isFirst]);

    const handleComplete = () => {
        console.log("Selected Gender: ", gender); 
        console.log("Entered Birth Date: ", birthDate);
        setModalVisible(!modalVisible); 
    };

    useEffect(() => {
        const fetchData = async () => {
            // 예시 데이터
            const dataFromServer = [
                {
                    "id": 1,
                    "timestamp": "2024-04-14T12:00:00Z",
                    "analysisType": "일반 분석",
                    "results": {
                        "chat_type": "꼰대형",
                    }
                },
                {
                    "id": 2,
                    "timestamp": "2024-04-14T12:00:00Z",
                    "analysisType": "예절 분석",
                    "results": {
                        "total_score": "80",
                    }
                },
            ];
            setRecords(dataFromServer);
        };

        fetchData();
    }, []);

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff',}}>
            
            <View style={{justifyContent: 'center', alignItems: 'center',}}>
                <Modal
                    transparent={true} // 배경을 투명하게 할 것인지
                    visible={modalVisible} // 모달의 표시 여부
                >
                    <View style={{margin: 20,
                            backgroundColor: "white",
                            borderRadius: 20,
                            padding: 30,
                            alignItems: "center",
                            justifyContent: 'center',
                            elevation: 10
                        }}>

                        <Text style={{marginBottom: 10, textAlign: "center", fontSize: 20,}}>처음이신가요?</Text>
                        <Text style={{textAlign: "center"}}>정확한 분석을 위해 당신의 성별과</Text>
                        <Text style={{marginBottom: 15, textAlign: "center"}}>생년월일을 입력해 주세요.</Text>

                        <View style={{flexDirection: 'row', marginBottom: 20,}}>
                            <TouchableOpacity
                                style={{marginHorizontal: 10, alignItems: 'center',}}
                                onPress={() => setGender('male')}
                            >
                                <Text style={{fontSize: 16}}>
                                    {gender === 'male' ? '🔘 남성' : '⚪ 남성'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{marginHorizontal: 10, alignItems: 'center',}}
                                onPress={() => setGender('female')}
                            >
                                <Text style={{fontSize: 16}}>
                                    {gender === 'female' ? '🔘 여성' : '⚪ 여성'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{width: '100%', marginBottom: 20,}}>
                            <TextInput
                                style={{
                                    height: 40,
                                    borderColor: 'gray',
                                    borderWidth: 1,
                                    padding: 10,
                                    borderRadius: 5,
                                    width: '100%',
                                    textAlign: 'center',
                                }}
                                placeholder="생년월일 8자리 입력 ex)000825"
                                value={birthDate}
                                onChangeText={setBirthDate}
                            />
                        </View>

                        <TouchableOpacity 
                            style={{
                                backgroundColor: '#f2cd79',
                                alignItems: 'center',
                                padding: 10,
                                width: '80%',
                                borderRadius: 10,
                            }} onPress={handleComplete}>
                            <Text style={{color: '#0d3286', fontSize: 15,}}>완료</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>


                <Text style={{fontSize: 30, margin: 10}}>나의 최근 분석 내역</Text>

                {records.length > 0 ? (
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        width: '90%',
                        height: '80%',
                        borderRadius: 15,
                        borderWidth: 1,
                    }}>
                        {records.map((record, index) => (
                            <TouchableOpacity key={index} style={{ 
                                marginBottom: 20, 
                                width: '90%', 
                                borderRadius: 15, 
                                padding: 10, 
                                borderWidth: 1, 
                                borderColor: 'gray', 
                            }}>
                                <Text style={{ fontSize: 20 }}>{record.analysisType}</Text>
                                <Text style={{ fontSize: 15 }}>분석 시간: {record.timestamp}</Text>
                                {record.analysisType === "일반 분석" ? (
                                    <>
                                        <Text style={{ fontSize: 15 }}>대화 유형: {record.results.chat_type}</Text>
                                    </>
                                ) : (
                                    <>
                                        <Text style={{ fontSize: 15 }}>점수 : {record.results.total_score}</Text>
                                    </>
                                )}
                                <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 10,}}>
                                    <Text>상세보기 터치</Text>
                                </View>
                                
                            </TouchableOpacity>
                        ))}
                    </View>
                ) : (
                    <View style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        width: '90%',
                        height: '80%',
                        borderRadius: 15,
                        borderWidth: 1,
                    }}>
                        <Text style={{ fontSize: 20 }}>최근 분석 기록 없음</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

export default Home;