const mongoose = require('mongoose');
const { Schema } = mongoose;

const textSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    opAge: Number,
    dataType: Boolean, 
    analysisType: Boolean,
    conversationType: Number,
    totalScore: Number,
    detailInfo: Array,
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

module.exports = {
    textModelSave
}