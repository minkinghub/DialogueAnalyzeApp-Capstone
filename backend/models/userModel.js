const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: String,
    nickname: String,
    kakaoId: String,
    gender: Boolean,
    birth: Date,
}, { versionKey: false })

const userModel = mongoose.model('Users', userSchema, 'users')

const userModelSave = async (data) => {

    const saveData = new userModel(data)

    try {
        const savedUserData = await saveData.save()
        console.log("저장 성공")

        return savedUserData._id
    } catch (error) {
        console.log("데이터 저장 중 오류 발생")
    }
    
}

const userModelLoad = async (data) => {
    const loadData = new userModel(data)

}

async function findByKakaoId(kakaoId) {
    try {
        const user = await userModel.findOne({ kakaoId: kakaoId });
        
        return user
    } catch (err) {
      console.error(err);
    }
  }

async function findByObjectId(id) {

}
module.exports = {
    userModelSave,
    findByKakaoId,
    findByObjectId
}