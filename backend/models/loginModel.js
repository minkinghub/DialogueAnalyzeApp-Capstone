const mongoose = require('mongoose');

const kakaoSchema = new mongoose.Schema({
    kakaoId: String,
    gender: Boolean,
    birth: Date,
}, { versionKey: false })

const kakaoModel = mongoose.model('Kakaousers', kakaoSchema, 'kakaousers')

const kakaoModelSave = async (data) => {

    const saveData = new kakaoModel(data)

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

async function findByKakaoId(kakaoId) {
    try {
        const user = await kakaoModel.findOne({ kakaoId: kakaoId });
        if(user) {
            return true
        } 
        return false
    } catch (err) {
      console.error(err);
    }
  }
module.exports = {
    kakaoModelSave,
    findByKakaoId
}