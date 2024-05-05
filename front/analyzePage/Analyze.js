import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {useContext} from 'react';
import ThemeContext from '../src/ThemeContext';
import FileChoice from '../component/analyze/FileChoice';
import MannerAnalysis from '../component/API/analyze/MannerAnalysis';
import GeneralAnalysis from '../component/API/analyze/GeneralAnalysis';
import { darkTheme, lightTheme } from '../src/myPage/theme/theme.styles';

const Analyze = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [opAge_range, setOpAge_range] = useState('20');
    const DarkMode = useContext(ThemeContext);
    const isDarkMode = DarkMode.isDarkMode;
    const theme = isDarkMode ? darkTheme : lightTheme;

    //파일 선택
    const fileSelected = (file) => {
        setSelectedFile(file[0]);
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
            <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: theme.backgroundColor}}>
                <View style={{
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '10%', 
                    width: '90%', 
                    borderRadius: 10,
                    borderWidth: 1, 
                    borderColor: theme.borderColor
                }}>
                    <Text style={{color: theme.textColor}}>{selectedFile ? "선택한 파일 : " + selectedFile.name : "선택한 파일 없음"}</Text>
                </View>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center', 
                    height: '5%', 
                    width: '90%',  
                }}>
                    <Text style={{fontSize: 15,color: theme.textColor}}>상대방 연령 선택  </Text>
                    <View style={{
                        borderWidth: 1, 
                        borderRadius: 5, 
                        borderColor: theme.borderColor,
                        height: 30,
                        width: 120,
                        justifyContent: 'center',
                    }}>
                        <Picker
                            selectedValue={opAge_range}
                            onValueChange={(itemValue, itemIndex) => setOpAge_range(itemValue)}
                            style={{ 
                                height: '100%', 
                                width: '100%',
                                color: theme.textColor
                            }}>
                            <Picker.Item label="20대" value="20" />
                            <Picker.Item label="30대" value="30" />
                            <Picker.Item label="40대" value="40" />
                            <Picker.Item label="50대 이상" value="50" />
                        </Picker>
                    </View>
                </View>

                <View style={{
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '65%', 
                    width: '100%', 
                }}>
                    <FileChoice onFileSelected={fileSelected} />
                </View>

                <View style={{
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '20%', 
                    width: '100%', 
                }}>
                    <MannerAnalysis selectedFile={selectedFile && selectedFile ? selectedFile : undefined} opAge_range={opAge_range} />
                    <GeneralAnalysis selectedFile={selectedFile && selectedFile ? selectedFile : undefined} opAge_range={opAge_range} />
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Analyze;