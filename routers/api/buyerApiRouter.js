const express = require('express');
const Buyer = require('../../models/Buyer');
const Goods = require('../../models/Goods');
const Order = require('../../models/Order');
const Cart = require('../../models/Cart');
//创建路由对象
const router = express.Router();
//注册 ajax请求处理
router.post('/register', (req, res) => {
    //1.从请求的body取出参数
    let { username, password, repassword } = req.body;
    //2.判断参数是否为空
    if (username == '' || password == '' || repassword == '' ||
        username == undefined || password == undefined || repassword == undefined) {
        res.json({
            statusCode: 1,
            message: '输入不能为空'
        });
        return;
    }
    //3.判断参数中密码是否一致
    if (password != repassword) {
        res.json({
            statusCode: 2,
            message: '密码不一致'
        });
        return;
    }
    //4.查询数据库，判断这个用户有没有注册过
    Buyer.findOne({ username })
        .then((result) => {
            if (result) {
                res.json({
                    statusCode: 3,
                    message: '该用户已存在'
                });
            } else {
                //5.注册该用户
                let buyer = new Buyer({
                    username,
                    password
                });
                buyer.save().then((newBuyer) => {
                    //6.响应客户端
                    res.json({
                        statusCode: 0,
                        message: '注册成功'
                    })
                })
            }
        })
})
//登录 ajax请求处理
router.post('/login', (req, res) => {
    let { username, password } = req.body;
    if (username == "" || password == "") {
        res.json({
            statusCode: 1,
            message: '输入不能为空'
        });
        return;
    }
    //查询数据库
    Buyer.findOne({ username }).then(buyer => {
        if (buyer) {
            //判断密码是否一致
            if (buyer.password == password) {
                //登录成功
                //将用户id存放在cookies中
                req.cookies.set('BUYERID', buyer._id);
                //响应客户端
                res.json({
                    statusCode: 0,
                    message: '登录成功'
                });
                return;
            } else {
                res.json({
                    statusCode: 2,
                    message: '密码错误'
                });
                return;
            }
        } else {
            res.json({
                statusCode: 2,
                message: '该用户不存在'
            });
            return;
        }
    })
})
router.post('/goodsDetail', (req, res) => {
    //判断是否有参数
    let { g_id, s_id, b_id, num, style, size } = req.body;
    // console.log(req.body);
    if(!b_id){
        res.json({
            statusCode: 1,
            message: '未登录'
        });
        return;
    }
    if (!g_id || !s_id || !b_id || !num || !style || !size) {
        res.json({
            statusCode: 2,
            message: '参数不能为空'
        });
        return;
    }
    Cart.findOne({ size, style, goods:g_id, seller:s_id, buyer:b_id }).then(result => {
        if (result) {
            console.log(result);
            let id = result._id;
            Cart.findByIdAndUpdate(id, { count:result.count + Number(num) }).then(result => {
                if (result) {
                    res.json({
                        statusCode: 0,
                        message: '更新成功'
                    });
                } else {
                    res.json({
                        statusCode: 2,
                        message: '更新失败，数据库错误'
                    })
                }
            })
        }
        else {
            //保存商品到购物车
            let cart = new Cart({
                size,
                style,
                count: num,
                goods: g_id,
                seller: s_id,
                buyer: b_id
            });
            cart.save().then(result => {
                if (result) {
                    res.json({
                        statusCode: 0,
                        message: '保存成功'
                    });
                } else {
                    res.json({
                        statusCode: 2,
                        message: '保存失败，数据库错误'
                    })
                }
            })
        }
    })    
})
router.post('/goodsCart', (req, res) => {
    //判断是否有参数
    let id = req.body.cartid;
    if (!id){
        res.json({
            statusCode: 1,
            message: '参数不能为空'
        });
        return;
    }
    //删除商品
    Cart.findByIdAndRemove(id)
    .then(result => {
        if (result) {
            res.json({
                statusCode: 0,
                message: '删除成功'
            });
        } else {
            res.json({
                statusCode: 2,
                message: '删除失败，数据库错误'
            })
        }
    })
})
router.post('/buygoods', (req, res) => {
    //判断是否有参数
    let { g_id, s_id, b_id, num, style, size ,status} = req.body;
    // console.log(req.body);
    if(!b_id){
        res.json({
            statusCode: 1,
            message: '未登录'
        });
        return;
    }
    if (!g_id || !s_id  || !num || !style || !size || !status) {
        res.json({
            statusCode: 2,
            message: '参数不能为空'
        });
        return;
    }
     //保存商品到购物车
     let order = new Order({
        size,
        style,
        count: num,
        goods: g_id,
        seller: s_id,
        buyer: b_id,
        status
    });
    order.save().then(result => {
        if (result) {
            res.json({
                statusCode: 0,
                message: '保存成功'
            });
        } else {
            res.json({
                statusCode: 2,
                message: '保存失败，数据库错误'
            })
        }
    })
})    
router.post('/buyerOrder', (req, res) => {
     //判断是否有参数
     let id = req.body.orderid;
     if (!id){
         res.json({
             statusCode: 1,
             message: '参数不能为空'
         });
         return;
     }
     //取消该订单
     Order.findByIdAndRemove(id)
     .then(result => {
         if (result) {
             res.json({
                 statusCode: 0,
                 message: '删除成功'
             });
         } else {
             res.json({
                 statusCode: 2,
                 message: '删除失败，数据库错误'
             })
         }
     })
})
module.exports = router;