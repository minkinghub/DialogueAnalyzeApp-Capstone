import {Picker} from '@react-native-picker/picker';
import analyzeStyle from './analyze.style';
import {useTheme} from '../ThemeContext';
import {useState} from 'react';

const useSpeakerPicker = speaker => {
  const [selpeaker, setSelpeaker] = useState(0);
  const {isDarkMode} = useTheme();
  const styles = analyzeStyle(isDarkMode);

  const renderSpeakerPicker = () => {
    let key = 2111;
    if (speaker && speaker.length > 0) {
      return (
        <Picker
          selectedValue={selpeaker}
          onValueChange={(itemValue, itemIndex) => setSelpeaker(itemIndex)}
          style={styles.pickerStyle}
          itemStyle={styles.itempickerStyle}>
          {speaker.map((item, index) => (
            <Picker.Item label={item} value={index} key={toString(key++)} />
          ))}
        </Picker>
      );
    } else {
      // speaker가 비어있거나 정의되지 않은 경우, null 또는 로딩 표시 등을 반환
      return null;
    }
  };

  return {selpeaker, renderSpeakerPicker};
};

export default useSpeakerPicker;
