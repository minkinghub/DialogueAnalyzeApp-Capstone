const { textModelSave } = require('../models')
const { fullTextModelSave } = require('../models')
const axios = require('axios')
const base64 = require('base-64');

const NGROK_NAME = process.env.NGROK_NAME
const NGROK_PASSWORD = process.env.NGROK_PASSWORD

const analyzeTextService = async (userId, analysisType, opAge_range, content, modelEndpoint) => {

    const checkGPUserver = await GPUServerChecking(modelEndpoint)
    if(checkGPUserver == null) return { status : 1 }

    const contentArray = content.split("\n"); // 줄바꿈을 기준으로 내용 자르기
    
    let count = 1; // 대화 순서
    let nowDate = { // 대화 날짜
        year: 2000,
        month: 0,
        day: 1
    } 
    let preText = null // 이전 대화

    const saveArray = []

    for(let line of contentArray) {
        let result = textTypeClassificationKakao(line)
        let analysisNeed = false
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
            analysisNeed = true
            const time = new Date(nowDate.year, nowDate.month, nowDate.day, preText.hour, preText.minute)
            // 위에 모델 이용 분석 함수 들어가면 됨
            const chatDetail = {
                count: count,
                speaker: preText.speaker,
                chatTime: time,
                analysisNeed: analysisNeed,
                chatType: result.type,
                chatContent: result.text,
            }
            saveArray.push(chatDetail)
            count++
        } else {
            preText = result
            if(result.type == 3) {
                analysisNeed = true
            }
            const time = new Date(nowDate.year, nowDate.month, nowDate.day, result.hour, result.minute)
            const chatDetail = {
                count: count,
                speaker: result.speaker,
                chatTime: time,
                analysisNeed: analysisNeed,
                chatType: result.type,
                chatContent: result.text,
            }
            saveArray.push(chatDetail)
            count++
        }
    }

    const speakerArray = extractSpeakerArray(saveArray)
    if(speakerArray.length != 2) return { status : 2 }

    const splittedList = splitArrayBySpeaker(saveArray, speakerArray);

    const arrayToRequestAnalysis = extractAnalysisNeedText(splittedList)

    const analyzedList = await requestAnalyzeText(arrayToRequestAnalysis, modelEndpoint)
    if(analyzedList == null) return null

    mergeList(splittedList, analyzedList)

    const fullChat = [
        {
            speaker: speakerArray[0],
            chatList: splittedList[0]
        },
        {
            speaker: speakerArray[1],
            chatList: splittedList[1]
        }
    ]

    const saveChatData = {
        userId: userId,
        opAge: opAge_range,
        chatName: defineChatName(speakerArray),
        uploadTime: new Date(),
        speakers: speakerArray,
        dataType: true, // 채팅 데이터와 음성 데이터 구분, 여기는 채팅 데이터 api임
        analysisType: analysisType, // 예절 분석과 타입 분석 구분, ture - 예절 / false - 타입
    }

    if(analysisType) { // 예절 분석
        saveChatData.conversationType = null // 마찬가지
        const detailList = calculateScore(fullChat)
        saveChatData.detailList = detailList
    } else { // 타입 분석
        saveChatData.conversationType = classficationConversataionType(fullChat) // 대화 타입
        saveChatData.detailList = null // 반대 값은 걍 null값 넣음
    }

    const saveFullData = await fullTextModelSave({fullChat: fullChat})
    saveChatData.fullChatId = saveFullData
    const saveLiteData = await textModelSave(saveChatData)
    console.log(saveLiteData)
    return { status : 0, historyKey: saveLiteData._id.toString()}
}

const textTypeClassificationKakao = (line) => { // 문자열 형식에 따라 타입 분류 (카카오톡)
    const generalPattern = /\[(.*?)\] \[(오후|오전) (\d{1,2}:\d{2})\] (.*)/; // 일반 대화 시작
    const filePattern = "파일 :" // 일반 대화에서 파일 구분
    const picturePattern = "사진" // 일반 대화에서 사진 구분
    const emotePattern = "이모티콘" // 일반 대화에서 이모티콘 구분
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

const extractAnalysisNeedText = (splittedList) => {
    const arrayToRequestAnalysis = []
    for(let array of splittedList) {
        const textArrayTemp = []
        for(let text of array) {
            if(text.analysisNeed == true) {
                textArrayTemp.push(text.chatContent)
            }
        }
        arrayToRequestAnalysis.push(textArrayTemp)
    }

    return arrayToRequestAnalysis
}

// const extractExampleNumber = (numberRange) => { // 틀린 텍스트 범위 안에서 난수 뽑기 함수
//     let firstNumber = Math.floor(Math.random() * numberRange);
//     let secondNumber = Math.floor(Math.random() * numberRange);

//     // 숫자 안겹치게 함
//     while (firstNumber === secondNumber) {
//         secondNumber = Math.floor(Math.random() * numberRange);
//     }

//     return { firstNumber, secondNumber }
// }

const requestAnalyzeText = async (splittedList, modelEndpoint) => { // 분석 요청, 얘를 여따 써야하는지 모르겠네, 음성도 여기에 쓰긴 할텐데)

    try { // 이거 감싸야 하나, 최상위에서 에러를 잡긴 하는데, 추후 수정 필요
        const response = await axios.post(`${modelEndpoint}/analysis`, {
            requestArray: splittedList
        }, {
            headers : {
            'Content-Type':'application/json',
            'Authorization': 'Basic ' + base64.encode(NGROK_NAME + ":" + NGROK_PASSWORD)
            }
        })
        return response.data.data
    } catch (error) {
        return null
    }
}

const extractSpeakerArray = (saveArray) => {
    const speaker = []

    for(let text of saveArray) {
        if(!speaker.includes(text.speaker)) {
            speaker.push(text.speaker)
        }
    }

    return speaker
}

const splitArrayBySpeaker = (saveArray, speakerArray) => {
    const list = []

    for(let i = 0; i < speakerArray.length; i++) {
        list.push([])
    }

    for(let text of saveArray) {
        for (let [index, speaker] of speakerArray.entries()) {
            if(text.speaker == speaker) {
                delete text.speaker
                list[index].push(text)
            }
        }
    }
    return list
}

const calculateScore = (fullChat) => { // 점수 계산 함수
    const list = []
    for(let splittedChat of fullChat) { // 대화 대상이 2명
        let totalText = 0
        const standardArray = ["polite", "moral", "grammar", "positive"]
        const notTextCount = [[], [], [], []] // 인덱스만 저장해서 효율을 높이려고 함, 지금 배열 하나 하나 객체가 너무 큼
        const detailInfo = [] // 반환 배열

        for(let [index, text] of splittedChat.chatList.entries()) { // 전체 채팅 리스트를 반복
            if(text.analyzeResult != null) {
                totalText++ // null 값을 가진 대화는 점수 기준에 포함되어선 안됨
                if(text.analyzeResult.isPolite == 0) { // 존댓말
                    notTextCount[0].push(index)
                } 
                if(text.analyzeResult.isMoral != 100) { // 문제 없음 제외
                    notTextCount[1].push(index)
                }
                if(text.analyzeResult.isGrammar == 0) { // 문법
                    notTextCount[2].push(index)
                }
                if(text.analyzeResult.isPositive != 100) { // 긍부정
                    notTextCount[3].push(index)
                }
            }
        }

        let count = 0;
        while(count < 4) {
            let detailScore = 0
            if(totalText != 0) { // 0으로 나누면 안됨
                detailScore = Math.floor(((totalText - notTextCount[count].length) / totalText) * 25)
            }
            
            exampleText = null
            if(detailScore < 25 && notTextCount[count].length >= 1) { // 2개 미만이면 무한 반복임
                exampleText = []
                for(let i of notTextCount[count]) {
                    exampleText.push({
                        isStandard : splittedChat.chatList[i].analyzeResult.isPolite,
                        chatContent : splittedChat.chatList[i].chatContent
                    })
                }
            }

            const detail = {
                label: standardArray[count], // 기준 명
                detailScore: detailScore, // 기준에 따른 점수
                exampleText: exampleText // 예시 배열
            }
            detailInfo.push(detail)
            count++
        }
        let totalScore = 0;
        for(let detail of detailInfo) {
            totalScore += detail.detailScore
        }
        list.push({
            speaker: splittedChat.speaker,
            detailInfo: detailInfo,
            totalScore: totalScore
        })
    }

    return list
}

const defineChatName = (speakerArray) => {
    
    const chatName = (speakerArray.length == 2) ? `${speakerArray[0]}, ${speakerArray[1]}의 대화` : "제목 없음"

    return chatName
}

const classficationConversataionType = (fullChat) => { // 타입 분류 함수

    const typeArray = [] // 일단은 점수 계산을 배껴서 씀, 나중에 모듈화 해야할 듯
    for(let splittedChat of fullChat) { // 대화 대상이 2명
        const list = []
        let totalText = 0
        const standardArray = ["polite", "moral", "grammar", "positive"] // 라벨
        const notTextCount = [0, 0, 0, 0] // 순서대로 polite, moral, grammar, positive 카운트

        for(let text of splittedChat.chatList) { // 전체 채팅 리스트를 반복
            if(text.analyzeResult != null) {
                totalText++ // null 값을 가진 대화는 점수 기준에 포함되어선 안됨
                if(text.analyzeResult.isPolite == 0) { // 존댓말
                    notTextCount[0]++
                } 
                if(text.analyzeResult.isMoral != 100) { // 문제 없음 제외
                    notTextCount[1]++
                }
                if(text.analyzeResult.isGrammar == 0) { // 문법
                    notTextCount[2]++
                }
                if(text.analyzeResult.isPositive != 100) { // 긍부정
                    notTextCount[3]++
                }
            }
        }

        for(let [index, count] of notTextCount.entries()) {
            detailScore = 0
            if(totalText != 0) detailScore = Math.floor(((totalText - count) / totalText) * 25)
            list.push({ label : standardArray[index], score: detailScore })
        }

        let conversationType = 8;

        if (list.every(score => score.score >= 20)) { // 모든 점수가 20점 이상일 경우
            conversationType = 0;
        } else if (list.every(score => score.score <= 5)) { // 모든 점수가 5점 이하일 경우
            conversationType = 7;
        } else { // 나머지
            // 높은 점수 2개씩 뽑아서 분기
            const sortedList = [...list].sort((a, b) => b.score - a.score);
            const highestScores = sortedList.slice(0, 2);

            if ((highestScores[0].label == "positive" && highestScores[1].label == "moral") || (highestScores[0].label == "moral" && highestScores[1].label == "positive")) {
                conversationType = 1; // 불감
            } else if ((highestScores[0].label == "grammar" && highestScores[1].label == "moral") || (highestScores[0].label == "moral" && highestScores[1].label == "grammar")) {
                conversationType = 2; // 불맞
            } else if ((highestScores[0].label == "polite" && highestScores[1].label == "moral") || (highestScores[0].label == "moral" && highestScores[1].label == "polite")) {
                conversationType = 3; // 불존
            } else if ((highestScores[0].label == "grammar" && highestScores[1].label == "polite") || (highestScores[0].label == "polite" && highestScores[1].label == "grammar")) {
                conversationType = 4; // 맞존
            } else if ((highestScores[0].label == "positive" && highestScores[1].label == "grammar") || (highestScores[0].label == "polite" && highestScores[1].label == "grammar")) {
                conversationType = 5; // 맞감
            } else if ((highestScores[0].label == "positive" && highestScores[1].label == "polite") || (highestScores[0].label == "polite" && highestScores[1].label == "positive")) {
                conversationType = 6; // 존감
            }
        }

        typeArray.push({speaker: splittedChat.speaker, type: conversationType})
    }

    return typeArray
}

const mergeList = (splittedList, analyzedList) => {

    for(let i = 0; i < splittedList.length; i++) {
        let count = 0;
        for(let j = 0; j < splittedList[i].length; j++) {
            if(splittedList[i][j].analysisNeed == false) {
                splittedList[i][j] = {
                    ...splittedList[i][j],
                    analyzeResult : null
                    // gramarChat: splittedList[i][j].chatContent,
                    // isPositive: null,
                    // isGrammar: null,
                    // isMoral: null,
                    // isPolite: null
                }
            } else {
                splittedList[i][j] = {
                    ...splittedList[i][j],
                    analyzeResult: {
                        gramarChat: analyzedList[i][count].gramarChat,
                        isPolite: analyzedList[i][count].isPolite,
                        isMoral: analyzedList[i][count].isMoral,
                        isGrammar: analyzedList[i][count].isGrammar,
                        isPositive: analyzedList[i][count].isPositive
                    }
                }
                count++
            }
        }
    }
}

const GPUServerChecking = async (modelEndpoint) => {
    try { // 이거 감싸야 하나, 최상위에서 에러를 잡긴 하는데, 추후 수정 필요
        const response = await axios.post(`${modelEndpoint}/`, {
        }, {
            headers : {
            'Content-Type':'application/json',
            'Authorization': 'Basic ' + base64.encode(NGROK_NAME + ":" + NGROK_PASSWORD)
            }
        })
        return response.data
    } catch (error) {
        return null
    }
}

module.exports = {
    analyzeTextService
}