import {StyleSheet} from 'react-native';
import {darkTheme, lightTheme} from '../../myPage/theme/theme.styles';

const speakerPickerStyles = isDarkMode => {
  const theme = isDarkMode ? darkTheme : lightTheme;
  return StyleSheet.create({
    pickerStyle: {
      backgroundColor: theme.backgroundColor,
      color: theme.textColor,
      borderColor: theme.borderColor,
      borderWidth: 2,
    },
    itempickerStyle: {
      color: theme.textColor,
      fontSize: 20,
      textAlign: 'center',
    },
  });
};
export default speakerPickerStyles;
