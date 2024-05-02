const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
    name: String,
    gender: Boolean,
    birth: Date,
    signType: Number
}, { versionKey: false })

const testModel = mongoose.model('User', testSchema, 'users')

const testModelSave = async (data) => {
    
    const saveData = new testModel(data)

    try {
        await saveData.save()
        console.log("저장 성공")
        return true
    } catch (error) {
        console.log("에러 발생")
        console.error(error)
    }

}

module.exports = {
    testModelSave
}