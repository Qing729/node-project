const mongoose = require('mongoose');
//创建结构
const schema = new mongoose.Schema({
    username:String,
    password:String,
})
//创建数据模型
module.exports = mongoose.model('Buyer',schema);