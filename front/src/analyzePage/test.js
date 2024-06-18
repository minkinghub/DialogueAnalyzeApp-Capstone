import {useRef} from 'react';
import {ScrollView, View} from 'react-native';
const test = () => {
  const scrollViewRef = useRef(null);
  const arr = [
    {
      label: '1',
      detailScroe: 82,
      standardCount: [{0: 1}, {1: 2}],
      exampleText: [],
    },
    {
      label: '2',
      detailScroe: 82,
      standardCount: [{0: 1}, {1: 2}],
      exampleText: [],
    },
    {
      label: '3',
      detailScroe: 82,
      standardCount: [{0: 1}, {1: 2}],
      exampleText: [],
    },
    {
      label: '4',
      detailScroe: 82,
      standardCount: [{0: 1}, {1: 2}],
      exampleText: [],
    },
  ];
  const DrawTable = ({scrollViewRef}) => {
    // 해당 standard의 comment를 이동하기 위한 함수
    const scrollToItem = index => {
      // scrollTo 위치 계산
      let nowHeight = 5;
      for (let i = 0; i < index; i++) {
        nowHeight += CommentHeight[i] || 0;
      }
      scrollViewRef.current.scrollTo({
        y: nowHeight,
        animated: false,
      });
    };

    return <View></View>;
  };
  const handleScroll = event => {
    const yOffset = event.nativeEvent.contentOffset.y;
    let nowHeight = 0;
    for (let i = 0; i < CommentHeight.length; i++) {
      nowHeight += CommentHeight[i] || 0;

      if (yOffset < nowHeight) {
        setCurrentLabelIndex(i);
        break;
      }
    }
  };
  return (
    <View>
      <DrawTable scrollViewRef={scrollViewRef} />
      <ScrollView
        key="3300"
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={0}></ScrollView>
    </View>
  );
};
