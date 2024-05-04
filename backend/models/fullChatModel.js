const mongoose = require('mongoose');
const { Schema } = mongoose;

const fullTextSchema = new mongoose.Schema({
    fullChat: Array
}, { versionKey: false })

const fullTextModel = mongoose.model('FullChat', fullTextSchema, 'fullChats')

const fullTextModelSave = async (data) => {
    
    const saveData = new fullTextModel(data)

    try {
        await saveData.save()
        return saveData._id
    } catch (error) {
        console.log("에러 발생")
    }

}

module.exports = {
    fullTextModelSave
}