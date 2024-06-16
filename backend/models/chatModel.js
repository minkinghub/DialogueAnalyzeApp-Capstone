const mongoose = require('mongoose');
const { Schema } = mongoose;

const exampleTextSchema = new mongoose.Schema({
    isStandard: Number,
    chatContent: String,
}, { _id: false });

const detailInfoSchema = new mongoose.Schema({
    label: String,
    detailScore: Number,
    standardCount: Array,
    exampleText: [exampleTextSchema]
}, { _id: false });

const detailListSchema = new mongoose.Schema({
    speaker: String,
    conversationType: String,
    detailInfo: [detailInfoSchema],
}, { _id: false });

const textSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    chatName: String,
    uploadTime: Date,
    dataType: Boolean,
    detailList: [detailListSchema],
    fullChatId: { type: Schema.Types.ObjectId, ref: 'fullChats' },
}, { versionKey: false })

const textModel = mongoose.model('Chat', textSchema, 'chats')

const textModelSave = async (data) => {
    
    const saveData = new textModel(data)

    try {
        await saveData.save()
        return saveData._id
    } catch (error) {
        console.log("에러 발생")
    }

}

const findOneHistoryByChatId = async (historyKey) => {

    try {
        const history = await textModel.findById(historyKey);
        
        return history
    } catch (err) {
      console.error(err);
    }
}

const findHistoryByUserId = async (userId) => {
    try {
        const historyList = await textModel.find({userId: userId}).select('chatName opAge uploadTime dataType analysisType')

        return historyList
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    textModelSave,
    findOneHistoryByChatId,
    findHistoryByUserId
}