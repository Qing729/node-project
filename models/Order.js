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
    },
    status: {
        type: Number,
        default: 0
        /*
        0 下了订单，未支付
        1支付完成，未发货
        2.已发货
        3.收到货
        4.已完成，评论
        */
    }
})

// 创建数据模型
module.exports = mongoose.model('Order', schema);

