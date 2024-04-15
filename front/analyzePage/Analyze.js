import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import FileChoice from '../component/analyze/FileChoice';
import MannerAnalysis from '../component/analyze/MannerAnalysis';
import GeneralAnalysis from '../component/analyze/GeneralAnalysis';

const Analyze = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    //파일 선택
    const fileSelected = (file) => {
        setSelectedFile(file[0]);
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff',}}>
            <View style={{justifyContent: 'center', alignItems: 'center',}}>
                <View style={{
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '10%', 
                    width: '90%', 
                    borderRadius: 10,
                    borderWidth: 1, 
                }}>
                    <Text>{selectedFile ? "선택한 파일 : " + selectedFile.name : "선택한 파일 없음"}</Text>
                </View>

                <View style={{
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '70%', 
                    width: '100%',
                }}>
                    <FileChoice onFileSelected={fileSelected} />
                </View>

                <View style={{
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '20%', width: 
                    '100%',
                }}>
                    <MannerAnalysis selectedFile={selectedFile && selectedFile ? selectedFile : undefined} />
                    <GeneralAnalysis selectedFile={selectedFile && selectedFile ? selectedFile : undefined} />
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Analyze;