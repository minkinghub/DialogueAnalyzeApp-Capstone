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

async function userModelUpdate(userId, data) {
    try {
        const updatedUser = await userModel.findByIdAndUpdate(userId, {$set: {gender: data.gender, birth: data.birth}}, {new: true})
        return { status: true, data: updatedUser}
    } catch (err) {
        console.log(err)
        return { status: true, data: null}
    } 
}

const userModelLoad = async (data) => {
    const loadData = new userModel(data)

}

async function findOneUserByKakaoId(kakaoId) {
    try {
        const user = await userModel.findOne({ kakaoId: kakaoId });
        
        return user
    } catch (err) {
      console.error(err);
    }
}

async function findOneUserByObjectId(id) {
    try {
        const user = await userModel.findById(id);
        
        return user
    } catch (err) {
      console.error(err);
    }
}

module.exports = {
    userModelSave,
    userModelUpdate,
    findOneUserByKakaoId,
    findOneUserByObjectId
}