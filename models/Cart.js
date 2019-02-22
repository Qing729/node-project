const mongoose = require('mongoose');

// 创建结构
const schema = new mongoose.Schema({
    size: String,
    style: String,
    count: Number,
    goods: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goods'
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller'
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Buyer'
    }
})

// 创建数据模型
module.exports = mongoose.model('Cart', schema);

