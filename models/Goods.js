const mongoose = require('mongoose');

//创建结构
const schema = new mongoose.Schema({
    title:String,
    description:String,
    smallImage:String,
    bigImages:Array,
    price:Number,
    style:Array,
    size:Array,
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Seller'
    }
})
//创建数据模型
module.exports = mongoose.model('Goods',schema);