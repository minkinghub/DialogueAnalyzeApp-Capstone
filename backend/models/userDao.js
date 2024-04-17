// const appDataSource = require('./dataSource')

const getUserById = async(kakaoId) => {
    return null;
    // return await appDataSource.query(`
    // SELECT
    //     kakao_id,
    //     account_email,
    //     name,
    //     profile_image
    // FROM users
    // WHERE kakao_id=?`
    // , [kakaoId]
    // );
}

const signUp = async (name) => {
    console.log("name", name)
}

module.exports = {
    getUserById,
    signUp
}