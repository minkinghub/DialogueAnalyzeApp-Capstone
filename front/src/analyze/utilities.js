const labelKr = item => {
  if (item === 'polite') {
    return '반말';
  } else if (item === 'moral') {
    return '불쾌한 발언';
  } else if (item === 'grammar') {
    return '틀린 맞춤법';
  } else if (item === 'positive') {
    return '감정 여부';
  }
};

//감정은 100 긍정 / 0 - 두려움, 1 - 놀람, 2 - 화남, 3 - 슬픔 , 4 - 무감, 5 - 행복함, 6 - 역겨움
// 불쾌 발언은 100 문제 없음 / 0 - 보통, 1 - 차별/성적인, 2 - 학대, 3- 폭력/범죄, 4 - 혐오, 5 - 검열
const commentType = (label, type) => {
  if (label === 'moral') {
    if (type === 0) {
      return '보통';
    } else if (type === 1) {
      return '차별/성적인';
    } else if (type === 2) {
      return '학대';
    } else if (type === 3) {
      return '폭력/범죄';
    } else if (type === 4) {
      return '혐오';
    } else if (type === 5) {
      return '검열';
    }
  } else if (label === 'positive') {
    if (type === 0) {
      return '두려움';
    } else if (type === 1) {
      return '놀람';
    } else if (type === 2) {
      return '화남';
    } else if (type === 3) {
      return '슬픔';
    } else if (type === 4) {
      return '무감';
    } else if (type === 5) {
      return '행복함';
    } else if (type === 6) {
      return '역겨움';
    }
  }
};
export {labelKr, commentType};
