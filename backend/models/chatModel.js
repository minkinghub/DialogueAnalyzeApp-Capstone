const mongoose = require('mongoose');
const { Schema } = mongoose;

const textSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    opAge: Number,
    dataType: Boolean, 
    analysisType: Boolean,
    chatList: Array
}, { versionKey: false })

const textModel = mongoose.model('Chat', textSchema, 'chats')

const textPoliteModelSave = async (data) => {
    
    const saveData = new textModel(data)

    try {
        await saveData.save()
        console.log("저장 성공")
        return true
    } catch (error) {
        console.log("에러 발생")
        console.error(error)
        return false
    }

}

module.exports = {
    textPoliteModelSave
}