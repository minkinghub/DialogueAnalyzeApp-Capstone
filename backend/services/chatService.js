const { textPoliteModelSave } = require('../models')

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

const analyzeTextService = async (userId, opAge_range, content) => {
    console.log("내용 해체 시작")
    console.log(userId)

    const contentArray = content.split("\n"); // 줄바꿈을 기준으로 내용 자르기
    
    let count = 1; // 대화 순서
    let nowDate = null // 대화 시간
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
            const { isPolite, isMorality, isGrammar, isPositive} = { isPolite: true, isMorality: 0, isGrammar: true, isPositive: true }; 
            // 위에 모델 이용 분석 함수 들어가면 됨
            const chatDetail = {
                count: count,
                speaker: preText.speaker,
                chatTime: time,
                chatType: result.type,
                chatContent: result.text,
                isPolite: isPolite,
                isMorality: isMorality,
                isGrammar: isGrammar,
                isPositive: isPositive
            }
            saveArray.push(chatDetail)
            count++
        } else {
            preText = result
            const time = new Date(nowDate.year, nowDate.month, nowDate.day, result.hour, result.minute)
            const { isPolite, isMorality, isGrammar, isPositive} = { isPolite: true, isMorality: 0, isGrammar: true, isPositive: true };
            const chatDetail = {
                count: count,
                spearker: result.speaker,
                chatTime: time,
                chatType: result.type,
                chatContent: result.text,
                isPolite: isPolite,
                isMorality: isMorality,
                isGrammar: isGrammar,
                isPositive: isPositive
            }
            saveArray.push(chatDetail)
            count++
        }
    }

    const saveChatData = {
        userId: userId,
        opAge: opAge_range,
        dataType: true, // 채팅 데이터와 음성 데이터 구분
        analysisType: true, // 예절 분석과 타입 분석 구분
        chatList: saveArray
    }

    const saveData = await textPoliteModelSave(saveChatData)
    return saveData
};

module.exports = {
    analyzeTextService
}