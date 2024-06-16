import {ActivityIndicator, View} from 'react-native';

const labelKr = item => {
  if (item === 'polite') {
    return '반말';
  } else if (item === 'moral') {
    return '불쾌한 발언';
  } else if (item === 'grammar') {
    return '틀린 맞춤법';
  } else if (item === 'positive') {
    return '감정';
  } else if (item === 'useDisfluency') {
    return '말 더듬기';
  }
};

const commentType = (label, type) => {
  // console.log('utill', label, type);
  // 불쾌 발언은 0 보통, 1 차별, 2 학대, 3 폭력, 4 혐오, 5 비난
  //감정은 0 무감정, 1 두려움, 2 놀람, 3 화남, 4 슬픔, 5 역겨움, 6 행복함,
  if (label === 'moral') {
    // (type === 0) {
    //   return '보통';
    // } else if
    if (type === 1) {
      return '차별';
    } else if (type === 2) {
      return '학대';
    } else if (type === 3) {
      return '폭력';
    } else if (type === 4) {
      return '혐오';
    } else if (type === 5) {
      return '비난';
    }
    //감정은 0 무감정, 1 두려움, 2 놀람, 3 화남, 4 슬픔, 5 역겨움, 6 행복함,
  } else if (label === 'positive') {
    // (type === 0) {
    //   return '무감정';
    // } else if
    if (type === 1) {
      return '두려움';
    } else if (type === 2) {
      return '놀람';
    } else if (type === 3) {
      return '화남';
    } else if (type === 4) {
      return '슬픔';
    } else if (type === 5) {
      return '역겨움';
    } else if (type === 6) {
      return '행복함';
    }
  }
};
const ActivityIndicatorLoading = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};
export {labelKr, commentType, ActivityIndicatorLoading};
