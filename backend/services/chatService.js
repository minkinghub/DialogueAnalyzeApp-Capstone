const { testModelSave } = require('../models')

const textTypeClassificationKakao = (count, line) => { // 문자열 형식에 따라 타입 분류 (카카오톡)
    const generalPattern = /\[(.*?)\] \[(오후|오전) (\d{1,2}:\d{2})\] (.*)/; // 일반 대화 시작
    const filePattern = "파일 :" // 일반 대화에서 파일 구분
    const datePattern = /^-{15} \d{2}년 \d{2}월 \d{1,2}일 -{15}$/ // 날짜 변경
    
    let type = 0
    let result
    let text

    if (line.match(datePattern)) { // 날짜 변경
        type = 1
        const match = text.match(datePattern);

        const year = parseInt(match[1], 10) + 2000;  // 연도
        const month = parseInt(match[2], 10) - 1;    // 월
        const day = parseInt(match[3], 10);          // 일

        result = {type: type, year: year, month: month, day: day}
    
    } else if (line.match(generalPattern)) { // 일반 대화 시작
        const match = line.match(generalPattern);
        if(match[3].startsWith(filePattern)) { // 파일인 경우
            type = 2
            text = match[4].substring(text.indexOf(filePattern) + filePattern.length)
        } else {
            type = 3
            text = match[4]
        }
        result = {count: count, type: type, name: match[1], period: match[2], time: match[3], text: text}

    } else { // 일반 대화 지속
        type = 0
        result = {count: count, type: type, text: line}
    }
    
    return result; // 0 : 대화 지속, 1 : 날짜 변경, 2 : 파일, 3: 일반 대화 시작
}

const analyzeTextService = async (content) => {
    console.log("내용 해체 시작")

    const contentArray = content.split("\n"); // 줄바꿈을 기준으로 내용 자르기
    
    let count = 1; // 대화 순서
    let nowDate // 대화 시간
    let preText // 이전 문자열

    const saveArray = []
    
    for(const line of contentArray) {
        let result = textTypeClassificationKakao(count, line)
        if(result.type != 1) {
            count++
        } else {

        }        
        saveArray.push(result)
        console.log(saveArray)
    }

};

module.exports = {
    analyzeTextService
}