import { View, Text, Image } from "react-native";
import analyzeStyle from "./analyze.style";
import { useContext, } from "react";
import ThemeContext, { useTheme } from "../ThemeContext";

// 타입 분석
const Category = () => {
    // const {isDarkMode} = useTheme();
    const DarkMode = useContext(ThemeContext);
    const isDarkMode = DarkMode.isDarkMode;
    const styles = analyzeStyle(isDarkMode);
    console.log('Category: ',isDarkMode);
    isDarkMode ? console.log('DarkMode') : console.log('LightMode');
    
    return (
        <View style = {styles.container}>
            <View style = {styles.headerStyle}>
                <Text style = {styles.headerTextStyle}>유형 분석 결과</Text>
            </View>
            <View>
                <View style = {styles.typeStyle}>
                    <Text style = {styles.typeTextStyle}>
                        당신은 {/*서버에서 넘겨 받을 유형 값*/ }asd 형입니다.</Text> 
                </View>
                
                    <View style = {styles.lineStyle}/>
                    <View style = {styles.imageViewStyle}>
                        <Text style = {styles.typeTextStyle}>당신의 유형에 맞는 이미지</Text>
                        <Image source={require('./03.png')} style={{width: 248, height: 248}}/>
                    </View>
                    <View style = {styles.lineStyle}/>
                
                <View style = {styles.commentBox}>
                    {/*적절한 설명 추가 */}
                    <Text style = {styles.commentTextStyle}>COMMENT @@@@@
                    2@@@@@@@@
                    @@@@@@</Text>
                    {/* <Text>{Server.comment}</Text> */}
                </View>
            </View>
        </View>
    );
};

export default Category;