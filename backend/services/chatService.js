const { textModelSave } = require('../models')
const { fullTextModelSave } = require('../models')
const FormData = require('form-data');
const sleep = require('sleep-promise');
const axios = require('axios')
const base64 = require('base-64');

const NGROK_NAME = process.env.NGROK_NAME
const NGROK_PASSWORD = process.env.NGROK_PASSWORD
const RETURN_ZERO_CLIENT_ID = process.env.RETURN_ZERO_CLIENT_ID
const RETURN_ZERO_CLIENT_SECRET = process.env.RETURN_ZERO_CLIENT_SECRET

const analyzeTextService = async (userId, content, dataType, fileExtension, modelEndpoint) => {
    const speakerNumber = 2

    const checkGPUserver = await GPUServerChecking(modelEndpoint) // GPU 서버 확인
    if(checkGPUserver == null) return { status : 1 }

    if(dataType == true) {
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
    
        const splittedList = splitArrayBySpeaker(saveArray, speakerArray, dataType);
        const arrayToRequestAnalysis = extractAnalysisNeedText(splittedList)

        const analyzedList = await requestAnalyzeText(arrayToRequestAnalysis, modelEndpoint)
        if(analyzedList == null) return null
    
        mergeList(splittedList, analyzedList, dataType)
    
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
            chatName: defineChatName(speakerArray),
            dataType,
            uploadTime: new Date(),
            speakers: speakerArray,
            dataType: true, // 채팅 데이터와 음성 데이터 구분, 여기는 채팅 데이터
        }
    
        const detailList = calculateScore(fullChat, dataType)
        saveChatData.detailList = detailList
        
        // DB 저장
        const saveFullData = await fullTextModelSave({fullChat: fullChat})
        saveChatData.fullChatId = saveFullData
        const saveLiteData = await textModelSave(saveChatData)
    
        return { status : 0, historyKey: saveLiteData._id.toString()}
    } else {
        const voiceContent = await requestAnalyzeVoice(content, fileExtension, speakerNumber)
        const speakerArray = extractSpeakerArray(voiceContent)

        const splittedList = splitArrayBySpeaker(voiceContent, speakerArray);
        const arrayToRequestAnalysis = extractAnalysisNeedText(splittedList)

        const analyzedList = await requestAnalyzeText(arrayToRequestAnalysis, modelEndpoint)
        if(analyzedList == null) return null

        mergeList(splittedList, analyzedList, dataType)

        splittedList.forEach(speak => {
            console.log(speak)
        })

        const fullChat = [
            {
                speaker: speakerArray[0].toString(),
                chatList: splittedList[0]
            },
            {
                speaker: speakerArray[1].toString(),
                chatList: splittedList[1]
            }
        ]
    
        const saveChatData = {
            userId: userId,
            chatName: defineChatName(speakerArray),
            dataType,
            uploadTime: new Date(),
            speakers: speakerArray,
            dataType: false, // 채팅 데이터와 음성 데이터 구분, 여기는 음성 데이터
        }
    
        const detailList = calculateScore(fullChat, dataType)
        saveChatData.detailList = detailList

        // DB 저장
        const saveFullData = await fullTextModelSave({fullChat: fullChat})
        saveChatData.fullChatId = saveFullData
        const saveLiteData = await textModelSave(saveChatData)
    
        return { status : 0, historyKey: saveLiteData._id.toString()}
    }
}

const textTypeClassificationKakao = (line) => { // 문자열 형식에 따라 타입 분류 (카카오톡)
    const generalPattern = /\[(.*?)\] \[(오후|오전) (\d{1,2}:\d{2})\] (.*)/; // 일반 대화 시작
    const filePattern = "파일 :" // 일반 대화에서 파일 구분
    const picturePattern = "사진" // 일반 대화에서 사진 구분
    const emotePattern = "이모티콘" // 일반 대화에서 이모티콘 구분
    const datePattern = /^-{15}\s+(\d{4})년\s+(\d{1,2})월\s+(\d{1,2})일\s+(\S)요일\s+-{15}\r$/ // 날짜 변경 
    const deletedPattern = "삭제된 메시지입니다." // 삭제된 메세지 구분
    const remittancePattern = /\d+원을 보냈습니다\./; // 송금
    const collectionPattern = /\d+원을 받았습니다\./; // 수금

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
        } else if(match[4] == deletedPattern) {
            type = 6
            text = "삭제된 메시지"
        } else if(match[4].match(remittancePattern)) {
            type = 7
            text = "송금"
        } else if(match[4].match(collectionPattern)) {
            type = 8
            text = "수금"
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
        result = { type: type, text: line }
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


const calculateScore = (fullChat, dataType) => { // 점수 계산 함수
    const list = []
    for(let splittedChat of fullChat) { // 대화 대상이 2명
        let totalText = 0
        const standardArray = ["polite", "moral", "grammar", "positive"]
        const notTextCount = [[], [], [], []] // 인덱스만 저장해서 효율을 높이려고 함, 지금 배열 하나 하나 객체가 너무 큼
        const detailInfo = [] // 반환 배열
        const standardCount = [
            [0, 0], // 반말, 존댓말
            [0, 0, 0, 0, 0, 0], // 불쾌 발언, 순서 대로 문제 없음, 차별, 학대, 폭력, 혐오, 검열
            [0, 0], // 맞춤법 문제 있음, 맞춤법 문제 없음
            [0, 0, 0, 0, 0, 0, 0] // 감정 쪽, 수정 필요
        ]

        for(let [index, text] of splittedChat.chatList.entries()) { // 전체 채팅 리스트를 반복
            if(text.analyzeResult != null) { // null 값을 가진 대화는 점수 기준에 포함되어선 안됨
                totalText++ 
                if(text.analyzeResult.isPolite == 0) { // 반말 감지
                    notTextCount[0].push(index)
                    standardCount[0][0]++
                } else {
                    standardCount[0][1]++
                }
                console.log("Moral : ", text.analyzeResult.isMoral)
                if((text.analyzeResult.isMoral == 100) || (text.analyzeResult.isMoral == 0)) { // 불쾌 발언 미감지
                    standardCount[1][0]++
                    console.log("위쪽 if문")
                } else { // 불쾌 발언 감지
                    console.log("아래쪽 else문")
                    if(text.analyzeResult.isMoral == 1) standardCount[1][1]++
                    else if(text.analyzeResult.isMoral == 2) standardCount[1][2]++
                    else if(text.analyzeResult.isMoral == 3) standardCount[1][3]++
                    else if(text.analyzeResult.isMoral == 4) standardCount[1][4]++
                    else if(text.analyzeResult.isMoral == 5) {
                        standardCount[1][5]++
                        console.log("5번 왔음")
                    }

                    notTextCount[1].push(index)
                }
                if(dataType == true) { // 텍스트
                    if(text.analyzeResult.isGrammar == 0) { // 틀린 문법 감지
                        notTextCount[2].push(index)
                        standardCount[2][0]++
                    } else {
                        standardCount[2][1]++
                    }
                } else { // 음성
                    if(text.analyzeResult.useDisfluency == 0) { // 간투어 감지
                        notTextCount[2].push(index)
                        standardCount[2][0]++
                    } else {
                        standardCount[2][1]++
                    }
                }
                
                let finalPositive = 0
                if((text.analyzeResult.isPositive == 100) || (text.analyzeResult.isPositive == 4)) { // 긍정도인가?
                    standardCount[3][0]++
                    text.analyzeResult.isPositive = finalPositive
                } else { // 이 부분은 수정이 필요할 수 있음
                    if(text.analyzeResult.isPositive == 0)  { // 프론트 측 요구사항으로 중립 통합, 하나씩 뒤로 미룸
                        finalPositive = 1 // 두려움
                    }
                    else if(text.analyzeResult.isPositive == 1) {
                        finalPositive = 2 // 놀람
                    }
                    else if(text.analyzeResult.isPositive == 2) {
                        finalPositive = 3 // 화남
                    }
                    else if(text.analyzeResult.isPositive == 3) {
                        finalPositive = 4 // 슬픔
                    }
                    else {
                        finalPositive = text.analyzeResult.isPositive // 역겨움, 행복함은 중립 뒤여서 변화 없음
                    }
                    text.analyzeResult.isPositive = finalPositive

                    if(finalPositive == 1) standardCount[3][1]++
                    else if(finalPositive == 2) standardCount[3][2]++
                    else if(finalPositive == 3) standardCount[3][3]++
                    else if(finalPositive == 4) standardCount[3][4]++
                    else if(finalPositive == 5) standardCount[3][5]++
                    else if(finalPositive == 6) standardCount[3][6]++

                    notTextCount[3].push(index)
                }
            }
        }

        let count = 0;
        while(count < 4) {
            let detailScore = 0
            if(totalText != 0) { // 0으로 나누면 안됨
                detailScore = Math.floor((notTextCount[count].length / totalText) * 100)
            }
            
            let exampleText = null
            if(detailScore < 100 && notTextCount[count].length >= 1) { // 2개 미만이면 무한 반복임
                exampleText = []
                for(let i of notTextCount[count]) {
                    exampleText.push({
                        chatContent : splittedChat.chatList[i].chatContent,
                        // 이미 이름을 정해놔서 변경할 수가 없네, 일단 지저분하지만 진행
                        ...((count == 0) && {isStandard : splittedChat.chatList[i].analyzeResult.isPolite}), // 존댓말
                        ...((count == 1) && {isStandard : splittedChat.chatList[i].analyzeResult.isMoral}), // 불쾌 발언
                        ...((count == 2 && dataType == true) && {isStandard : splittedChat.chatList[i].analyzeResult.isGrammar}), // 맞춤법
                        ...((count == 2 && dataType == false) && {isStandard : splittedChat.chatList[i].analyzeResult.useDisfluency}), // 간투어
                        ...((count == 3) && {isStandard : splittedChat.chatList[i].analyzeResult.isPositive}) // 감정
                    })
                }
            }
            console.log(standardCount[count])
            const detail = {
                label: standardArray[count], // 기준 명
                standardCount: standardCount[count],
                detailScore: detailScore, // 기준에 따른 점수
                exampleText: exampleText // 예시 배열
            }

            detailInfo.push(detail)
            count++
        }

        list.push({
            speaker: splittedChat.speaker,
            detailInfo: detailInfo
        })
    } // 여기 까지 비율 계산과 틀린 텍스트 추출
    
    
    for(let speaker of list) {
        speaker.conversationType = classficationConversataionType(speaker.detailInfo)
    }

    return list
}

const defineChatName = (speakerArray) => {
    
    const chatName = (speakerArray.length == 2) ? `${speakerArray[0]}, ${speakerArray[1]}의 대화` : "제목 없음"

    return chatName
}

const classficationConversataionType = (calculateScoreList) => { // 타입 분류 함수
    const scoreMapping = {
        polite: { up: 'I', down: 'F' },
        moral: { up: 'U', down: 'N' },
        grammar: { up: 'M', down: 'C' },
        positive: { up: 'E', down: 'L' }
    };

    const initialScores = {
        polite: 'N',
        moral: 'N',
        grammar: 'N',
        positive: 'N'
    };

    for (let detail of calculateScoreList) {
        if (scoreMapping.hasOwnProperty(detail.label)) {
            initialScores[detail.label] = detail.detailScore >= 50 ? scoreMapping[detail.label].up : scoreMapping[detail.label].down;
        }
    }

    const conversationType = initialScores.polite + initialScores.moral + initialScores.grammar + initialScores.positive;
    return conversationType;
}

const mergeList = (splittedList, analyzedList, dataType) => {

    for(let i = 0; i < splittedList.length; i++) {
        let count = 0;
        for(let j = 0; j < splittedList[i].length; j++) {
            if(splittedList[i][j].analysisNeed == false) {
                splittedList[i][j] = {
                    ...splittedList[i][j],
                    analyzeResult : null
                }
            } else {
                splittedList[i][j] = {
                    ...splittedList[i][j],
                    analyzeResult: {
                        correctChat : dataType ? analyzedList[i][count].gramarChat : splittedList[i][j].chatContent,
                        [dataType ? "isPolite" : "useDisfluency"] : dataType ? analyzedList[i][count].isPolite : splittedList[i][j].useDisfluency,
                        isMoral: analyzedList[i][count].isMoral,
                        isGrammar: analyzedList[i][count].isGrammar,
                        isPositive: analyzedList[i][count].isPositive
                    }
                }
                count++
            }
            if(!dataType) { // 음성 데이터일 경우
                splittedList[i][j].chatContent = splittedList[i][j].original_chat_content
                delete splittedList[i][j].original_chat_content
                delete splittedList[i][j].useDisfluency
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

const requestAnalyzeVoice = async (audioFileBuffer, fileExtension, spk_count) => { // 오디오 파일, 파일 확장자, 화자 수
    let returnZeroToken;

    const data = `client_id=${RETURN_ZERO_CLIENT_ID}&client_secret=${RETURN_ZERO_CLIENT_SECRET}`;

    try {
        const response = await axios.post('https://openapi.vito.ai/v1/authenticate', data, {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        returnZeroToken = response.data.access_token;
    } catch (error) {
        console.log(error);
        return null;
    }

    const voiceArray = await requestMultipleReturnZero(returnZeroToken, audioFileBuffer, fileExtension, spk_count, [true, false])
    const results = []

    let useDisfluencyTexts = voiceArray.find(item => item.label == true).speaks
    let notUseDisfluencyTexts = voiceArray.find(item => item.label == false).speaks
    let count = 1
    notUseDisfluencyTexts.forEach(notUseDisfluencyText => {
        const opponentText = useDisfluencyTexts.find(useDisfluencyText => useDisfluencyText.start == notUseDisfluencyText.start)
        if (opponentText) {
            results.push({
              count: count,
              speaker: notUseDisfluencyText.speaker,
              original_chat_content: notUseDisfluencyText.chat_content,
              analysisNeed: true,
              chatContent: opponentText.chat_content,
              useDisfluency: (opponentText.chat_content == notUseDisfluencyText.chat_content) ? true : false
            });
        } else {
            results.push({
              count, count,
              speaker: notUseDisfluencyText.speaker,
              original_chat_content: notUseDisfluencyText.chat_content,
              chatContent: null,
              analysisNeed: false,
              useDisfluency: false
            });
        }
        count++
    })

    return results;
}

const transcribeAudio = async (authToken, audioBuffer, fileExtension, spk_count, useDisfluencyFilter) => {
    const config = {
        use_diarization: true,
        diarization: { spk_count: spk_count },
        use_multi_channel: false,
        use_itn: false,
        use_disfluency_filter: useDisfluencyFilter,
        use_profanity_filter: false,
        use_paragraph_splitter: true,
        paragraph_splitter: {
            max: 50
        }
    };

    const form = new FormData();
    form.append('config', JSON.stringify(config));
    form.append('file', audioBuffer, {
        filename: `audio.${fileExtension}`,
        contentType: `audio/${fileExtension}`
    });

    try {
        const response = await axios.post('https://openapi.vito.ai/v1/transcribe', form, {
            headers: {
                'Authorization': `bearer ${authToken}`,
                ...form.getHeaders()
            }
        });

        const taskId = response.data.id;
        console.log(`작업 ID: ${taskId}`);

        const results = CheckTranscriptionStatus(taskId, authToken, useDisfluencyFilter)
        return results;``
    } catch (error) {
        console.error('Error transcribing audio:', error);
    }
}

const requestMultipleReturnZero = async (authToken, audioBuffer, fileExtension, spk_count, useDisfluencyFilters) => {
    tasks = useDisfluencyFilters.map(filter => transcribeAudio(authToken, audioBuffer, fileExtension, spk_count, filter))
    const results = await Promise.all(tasks)
    return results
}

const CheckTranscriptionStatus = async (taskId, authToken, useDisfluencyFilter) => {
    while (true) {
        try {
            const resp = await axios.get(`https://openapi.vito.ai/v1/transcribe/${taskId}`, {
                headers: { 'Authorization': `bearer ${authToken}` }
            });
            const status = resp.data.status;
            console.log(status)

            if (status === 'completed') {
                const speaks = []
                const result = resp.data.results
                for(let speak of result.utterances) {
                    speaks.push({
                        start: speak.start_at,
                        speaker: "화자" + (speak.spk + 1),
                        chat_content: speak.msg
                    })
                }
                return { label: useDisfluencyFilter, speaks: speaks }
            }
        } catch (error) {
            console.error('Error checking transcription status:', error.response ? error.response.status : error.message);
            return null
        }

        await sleep(5000); // 5초 대기
    }
}

module.exports = {
    analyzeTextService
}