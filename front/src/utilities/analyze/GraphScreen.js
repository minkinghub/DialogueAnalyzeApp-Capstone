// GraphScreen.js
import React, {useEffect, useState} from 'react';
import {StyleSheet, SafeAreaView, Dimensions} from 'react-native';
import {RadarChart} from '@salmonco/react-native-radar-chart';
import {commentType} from './utilities';
import {useTheme} from '../Theme/ThemeContext';
import {darkTheme, lightTheme} from '../../stylesFile/theme.styles';

const windowWidth = Dimensions.get('window').width; //윈도우 화면 크기 가져오기

const GraphScreen = ({data, label, total}) => {
  const {isDarkMode} = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [characterData, setCharacterData] = useState([]);
  useEffect(() => {
    const fecthData = () => {
      const result = [];
      data.map((item, index) => {
        if (index > 0 && total !== 0) {
          result.push({
            label: commentType(label, index),
            value: (item / total) * 100,
          });
        }
      });

      setCharacterData(result);
    };
    fecthData();
  }, [data, label]);

  return (
    <SafeAreaView style={styles.container}>
      <RadarChart
        data={characterData}
        size={windowWidth * 0.33}
        labelSize={13}
        gradientColor={{
          startColor: theme.startColor,
          endColor: theme.endColor,
          count: 5,
        }}
        stroke={theme.stroke}
        strokeWidth={[0.5, 0.5, 0.5, 0.5, 1]}
        strokeOpacity={[1, 1, 1, 1, 0.13]}
        labelColor={theme.labelColor}
        dataFillColor={theme.dataFillColor}
        dataFillOpacity={0.6} // 데이터 영역의 투명도
        dataStroke={theme.dataStroke}
        dataStrokeWidth={2}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GraphScreen;
