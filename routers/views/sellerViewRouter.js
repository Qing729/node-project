const express = require('express');
const Seller = require('../../models/Seller');
const Goods = require('../../models/Goods');
const Order = require('../../models/Order');
const url = require('url');

//创建路由对象
const router = express.Router();
router.get('/register',(req,res)=>{
    res.render('seller/register',{

    });
})
router.get('/login',(req,res)=>{
    res.render('seller/login',{
       
    });
})
router.get('/logout',(req,res)=>{
    //退出
    //清除cookies中的BUYERID
    req.cookies.set('SELLERID','');
    //刷新页面（重定向: /）
    res.redirect('/');
})

router.use((req,res,next)=>{
    //判断是否是ajax请求
    if(req.url.startsWith('/api')){
        next();
        return;
    }
    //判断卖家是否登录
    if(req.cookies.get('SELLERID')){
        //登录了走下一个函数 响应对应的页面
        next();
    }
    else{
        //没有登录，跳转到登录页面
        res.redirect('/seller/login');
    }
})

router.get('/',(req,res)=>{
    res.render('seller/index',{
        sellername:req.sellerInfo.username
    })
})
router.get('/goodslist',(req,res)=>{
    let sellerId = req.sellerInfo._id;
    //查询这个商家有哪些商品
    Goods.where({seller:sellerId}).find().then(result=>{
        if(result){
            //查询到该商家的商品
            res.render('seller/goodslist',{
                goodslistActive:'active',
                goodsList:result,
            }) 
        }else{
            //没有查询到商品，直接渲染页面
            res.render('seller/goodslist',{
                goodslistActive:'active',
            })  
         }       
     })  
})
router.get('/addgoods',(req,res)=>{
    res.render('seller/addgoods',{
        goodslistActive:'active',
    })
})
router.get('/modify-goods',(req,res)=>{
    let id = url.parse(req.url, true).query.goodsid;
    console.log(id);
    Goods.findById(id).then(result=>{
        // console.log(result);
        res.render('seller/modify-goods',{
            goodslistActive:'active',
            goodsinfo:result,
        })
    })
})
router.get('/orderlist',(req,res)=>{
    let s_id=req.sellerInfo._id;
    Order.where({seller:s_id}).find().populate(['goods']).populate(['buyer']).then(orderinfo => {
        // console.log(orderinfo);
    res.render('seller/orderlist',{
        orderlistActive:'active',
        buyername:req.buyerInfo.username,
        sellername:req.sellerInfo.username,
        orderList:orderinfo,
     })
    })
})
router.get('/sellerinfo',(req,res)=>{
    let id=req.sellerInfo._id;
    Seller.findById(id).then(sellerInfo=>{
            res.render('seller/sellerinfo',{
                sellerinfoActive:'active',
                sellerInfo
           })
    })
})
module.exports = router;