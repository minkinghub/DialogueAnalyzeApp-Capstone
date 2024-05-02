const { textModelSave } = require('../models')
const { fullTextModelSave } = require('../models')

const textTypeClassificationKakao = (line) => { // 문자열 형식에 따라 타입 분류 (카카오톡)
    const generalPattern = /\[(.*?)\] \[(오후|오전) (\d{1,2}:\d{2})\] (.*)/; // 일반 대화 시작
    const filePattern = "파일 :" // 일반 대화에서 파일 구분
    const picturePattern = "사진"
    const emotePattern = "이모티콘"
    const datePattern = /^-{15}\s+(\d{4})년\s+(\d{1,2})월\s+(\d{1,2})일\s+(\S)요일\s+-{15}\r$/ // 날짜 변경 

    let type = 0
    let result
    let text

    if (line.match(datePattern)) { // 날짜 변경
        type = 1
        const match = line.match(datePattern);

        const year = parseInt(match[1], 10) // 연도
        const month = parseInt(match[2], 10) - 1 // 월
        const day = parseInt(match[3], 10); // 일

        result = {type: type, year: year, month: month, day: day}
    
    } else if (line.match(generalPattern)) { // 일반 대화 시작
        const match = line.match(generalPattern);
        if(match[4].startsWith(filePattern)) { // 파일인 경우
            type = 2
            text = match[4].substring(text.indexOf(filePattern) + filePattern.length)
        } else if(match[4] == picturePattern) {
            type = 4
            text = "사진"
        } else if(match[4] == emotePattern) {
            type = 5
            text = "이모티콘"
        } else {
            type = 3
            text = match[4]
        }
        let [hour, minute] = match[3].split(':')
        hour = parseInt(hour)
        minute = parseInt(minute)
        if(match[2] == '오후') {
            hour += 12
        }
        result = {type: type, speaker: match[1], hour: hour, minute: minute, text: text}

    } else { // 일반 대화 지속
        type = 0
        result = {type: type, text: line}
    }
    
    return result; // 0 : 대화 지속, 1 : 날짜 변경, 2 : 파일, 3: 일반 대화 시작, 4: 사진, 5: 이모티콘
}

const extractExampleNumber = (numberRange) => { // 틀린 텍스트 범위 안에서 난수 뽑기 함수
    let firstNumber = Math.floor(Math.random() * numberRange);
    let secondNumber = Math.floor(Math.random() * numberRange);

    // 숫자 안겹치게 함
    while (firstNumber === secondNumber) {
        secondNumber = Math.floor(Math.random() * numberRange);
    }

    return { firstNumber, secondNumber }
}

const requestAnalyzeText = async (saveArray) => { // 분석 요청, 얘를 여따 써야하는지 모르겠네, 음성도 여기에 쓰긴 할텐데

    for(text of saveArray) { // 일단 임시로 내가 랜덤으로 넣음
        const Rnumber = Math.floor(Math.random() * 6);
        let isPolite, isGrammar, isPositive
        let isMoral = Rnumber

        if(Rnumber < 3) {
            isPolite = true
            isGrammar = true
            isPositive = true
        } else {
            isPolite = false
            isGrammar = false
            isPositive = false
        }

        text.isPolite = isPolite
        text.isMoral = isMoral
        text.isGrammar = isGrammar
        text.isPositive = isPositive
    }

    return
}

const calculateScore = (saveArray) => { // 점수 계산 함수
    const totalText = saveArray.length
    const standardArray = ["polite", "moral", "grammar", "positive"]
    const notTextCount = [[], [], [], []] // 인덱스만 저장해서 효율을 높이려고 함, 지금 배열 하나 하나 객체가 너무 큼
    const detailInfo = [] // 반환 배열

    let textCount = 0;
    for(text of saveArray) { // 전체 채팅 리스트를 반복
        if(!text.isPolite) { // 존댓말
            notTextCount[0].push(textCount)
        } 
        if(text.isMoral != 0) { // 문제 없음 제외
            notTextCount[1].push(textCount)
        }
        if(!text.isGrammar) { // 문법
            notTextCount[2].push(textCount)
        }
        if(!text.isPositive) { // 긍부정
            notTextCount[3].push(textCount)
        }
        textCount++;
    }

    let count = 0;
    let totalScore = 0;
    while(count < 4) {
        let detailScore = 0
        console.log(notTextCount[count].length)
        if(totalText != 0) { // 0으로 나누면 안됨
            detailScore = Math.floor(((totalText - notTextCount[count].length) / totalText) * 25)
        }

        exampleText = null
        if(detailScore < 25 && notTextCount[count].length > 2) { // 2개 이하면 무한 반복임
            exampleText = []
            const { firstNumber, secondNumber } = extractExampleNumber(notTextCount[count].length)
            if(count == 0) { // 존댓말, 나도 이렇게 나누기 싫다... 왜 배열로 안했을까
                exampleText.push({
                    isStandard: saveArray[notTextCount[count][firstNumber]].isPolite,
                })
                exampleText.push({
                    isStandard: saveArray[notTextCount[count][secondNumber]].isPolite,
                })
            } else if (count == 1) { // 도덕성, 이게 만악의 근원인듯
                exampleText.push({
                    isStandard: saveArray[notTextCount[count][firstNumber]].isMoral,
                })
                exampleText.push({
                    isStandard: saveArray[notTextCount[count][secondNumber]].isMoral,
                })
            } else if (count == 2) { // 문법
                exampleText.push({
                    isStandard: saveArray[notTextCount[count][firstNumber]].isGrammar,
                })
                exampleText.push({
                    isStandard: saveArray[notTextCount[count][secondNumber]].isGrammar,
                })
            } else if (count == 3) { // 긍부정
                exampleText.push({
                    isStandard: saveArray[notTextCount[count][firstNumber]].isPositive,
                })
                exampleText.push({
                    isStandard: saveArray[notTextCount[count][secondNumber]].isPositive,
                })
            }

            exampleText[0].chatContent = saveArray[notTextCount[count][firstNumber]].chatContent
            exampleText[1].chatContent = saveArray[notTextCount[count][secondNumber]].chatContent
        }

        const detail = {
            label: standardArray[0], // 기준 명
            detailScore: detailScore, // 기준에 따른 점수
            exampleText: exampleText // 예시 배열
        }
        totalScore += detailScore
        detailInfo.push(detail)
        count++
    }

    return { totalScore, detailInfo }
}

const classficationConversataionType = () => { // 타입 분류 함수

    const conversationType = 1

    return conversationType
}

const stringToBoolean = (str) => {
    return str.toLowerCase() === 'true';
}

const analyzeTextService = async (userId, analysisType, opAge_range, content) => {
    console.log("내용 해체 시작")
    console.log(userId)

    const contentArray = content.split("\n"); // 줄바꿈을 기준으로 내용 자르기
    
    let count = 1; // 대화 순서
    let nowDate = { // 대화 날짜
        year: 2000,
        month: 0,
        day: 1
    } 
    let preText = null // 이전 대화

    const saveArray = []

    for(const line of contentArray) {
        let result = textTypeClassificationKakao(line)
        if(result.type == 1) {
            nowDate = {
                year: result.year,
                month: result.month,
                day: result.day
            }
        } else if (result.type == 0) {
            if(nowDate == null || preText == null) {
                continue
            }
            const time = new Date(nowDate.year, nowDate.month, nowDate.day, preText.hour, preText.minute)
            // 위에 모델 이용 분석 함수 들어가면 됨
            const chatDetail = {
                count: count,
                speaker: preText.speaker,
                chatTime: time,
                chatType: result.type,
                chatContent: result.text,
            }
            saveArray.push(chatDetail)
            count++
        } else {
            preText = result
            const time = new Date(nowDate.year, nowDate.month, nowDate.day, result.hour, result.minute)
            const chatDetail = {
                count: count,
                spearker: result.speaker,
                chatTime: time,
                chatType: result.type,
                chatContent: result.text,
            }
            saveArray.push(chatDetail)
            count++
        }
    }
    // try-catch 써야하냐? 이거 래핑되어있지 않나
    await requestAnalyzeText(saveArray)

    const saveChatData = {
        userId: userId,
        opAge: opAge_range,
        dataType: true, // 채팅 데이터와 음성 데이터 구분, 여기는 채팅 데이터 api임
        analysisType: analysisType, // 예절 분석과 타입 분석 구분, ture - 예절 / false - 타입
    }

    analysisType = stringToBoolean(analysisType)
    if(analysisType) { // 타입 분석
        saveChatData.conversationType = classficationConversataionType() // 대화 타입
        saveChatData.totalScore = null // 일부러 null 값 넣음, 보기 편하라고
        saveChatData.detailInfo = null
    } else { // 예절 분석
        saveChatData.conversationType = null // 마찬가지
        const { totalScore, detailInfo } = calculateScore(saveArray)
        saveChatData.totalScore = totalScore
        saveChatData.detailInfo = detailInfo // 점수 및 예시
    }

    const saveFullData = await fullTextModelSave({chatList: saveArray})
    saveChatData.fullChatId = saveFullData
    const saveLiteData = await textModelSave(saveChatData)
    return saveLiteData
}

module.exports = {
    analyzeTextService
}