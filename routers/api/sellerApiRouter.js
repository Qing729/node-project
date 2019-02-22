const express = require('express');
const Seller = require('../../models/Seller');
const Goods = require('../../models/Goods');
const multiparty = require('multiparty');

//创建路由对象
const router = express.Router();
//注册 ajax请求处理
router.post('/register', (req, res) => {
    //1.从请求的body取出参数
    // console.log(req.body);
    let { username, password, repassword, logo, banner } = req.body;
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
    Seller.findOne({ username })
        .then((result) => {
            if (result) {
                res.json({
                    statusCode: 3,
                    message: '该用户已存在'
                });
            } else {
                //5.注册该用户
                let seller = new Seller({
                    username,
                    password,
                    logo,
                    banner
                });
                seller.save().then((newSeller) => {
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
    Seller.findOne({ username }).then(seller => {
        if (seller) {
            //判断密码是否一致
            if (seller.password == password) {
                //登录成功
                //将用户id存放在cookies中
                req.cookies.set('SELLERID', seller._id);
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
//上传图片
router.post('/upload', (req, res) => {
    let form = new multiparty.Form();
    form.uploadDir = './static/tmp';
    form.parse(req, (error, fields, files) => {
        if (!error) {
            let arr = files.images.map((item, index) => {
                let path = item.path.replace(/static/, '/public');
                return path;
            })
            res.json({
                statusCode: 0,
                message: '上传成功',
                data: {
                    imagesPath: arr
                }
            })
        } else {
            res.json({
                statusCode: 1,
                message: '上传错误'
            })
        }
    })
})
router.post('/addgoods', (req, res) => {
    //判断是否有参数
    let { title, description, smallImage, bigImages, price, style, size } = req.body;
    console.log(req.body);
    if (!title || !description || !smallImage || !bigImages || !price || !style || !size) {
        res.json({
            statusCode: 1,
            message: '参数不能为空'
        });
        return;
    }
    //保存商品
    let goods = new Goods({
        title,
        description,
        smallImage,
        bigImages,
        price,
        style,
        size,
        seller: req.sellerInfo._id
    });
    goods.save().then(result => {
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
router.post('/modify-goods', (req, res) => {
    //判断是否有参数
    let id = req.body.goodsid;
    let { title, description, smallImage, bigImages, price, style, size } = req.body;
    // console.log(req.body);
    if (!title || !description || !smallImage || !bigImages || !price || !style || !size) {
        res.json({
            statusCode: 1,
            message: '参数不能为空'
        });
        return;
    }
    //更新商品
    Goods.findByIdAndUpdate(id, {
        title,
        description,
        smallImage,
        bigImages,
        price,
        style,
        size,
    })
    .then(result => {
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
})
router.post('/goodslist', (req, res) => {
    //判断是否有参数
    let id = req.body.goodsid;
    if (!id){
        res.json({
            statusCode: 1,
            message: '参数不能为空'
        });
        return;
    }
    //删除商品
    Goods.findByIdAndRemove(id)
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