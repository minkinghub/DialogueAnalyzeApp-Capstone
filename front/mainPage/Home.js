import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';

const Home = () => {
    const [records, setRecords] = useState([]); //대화 성향 분석 데이터

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