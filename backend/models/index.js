const { testModelSave } = require('./testModel');
const { getUserById, signUp } = require('./userDao');

module.exports = {
    getUserById,
    signUp,
    testModelSave
}