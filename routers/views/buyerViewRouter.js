const express = require('express');
const Goods = require('../../models/Goods');
const Seller = require('../../models/Seller');
const Cart = require('../../models/Cart');
const Order = require('../../models/Order');
const url = require('url');

//创建路由对象
const router = express.Router();
 router.get('/login',(req,res)=>{
     res.render('buyer/login',{
         loginActive:'active',
         sellername:req.sellerInfo.username
     });
 })
 router.get('/register',(req,res)=>{
    res.render('buyer/register',{
        regActive:'active',
        sellername:req.sellerInfo.username
    });
})
router.get('/logout',(req,res)=>{
    //退出
    //清除cookies中的BUYERID
    req.cookies.set('BUYERID','');
    //刷新页面（重定向: /）
    res.redirect('/');
})
//买家首页
router.get('/',(req,res)=>{
    res.render('buyer/index',{
        indexActive:'active',
        buyername:req.buyerInfo.username,
        sellername:req.sellerInfo.username
    })
})
//商品列表
router.get('/goodslist',(req,res)=>{
    //查询所有商品 进行页面显示
    //排序 sort
    //查询关键字 keyword .where({title:正则表达式匹配关键字})
    //分页 skie = （page-1）*count limit = count

    //1.取出URL中的参数 取出page count
    let query = url.parse(req.url,true).query;
    let sort = query.sort?{price:query.sort} :{};
    // console.log(sort);
    //2.判断是否有参数，如果没有，page=1 count=4
    let page = Number(query.page || 1);
    let count = Number(query.count || 4);
    //3.计算查询条件 skip=(page-1)*count limit=count
    let skip=(page-1)*count;
    let limit = count;

    //查询总数，计算页面的分页标签
    let pages;
    let pageArr = [];
    Goods.count().then(sum=>{ 
        pages = Math.ceil(sum/count);
        for(let i=1;i<=pages;i++){
            pageArr.push(i);
        }
    })
    //渲染页面 查询数据
    Goods.find().sort(sort).skip(skip).limit(limit).then(result=>{
                // console.log(result);
                res.render('buyer/goodslist',{
                    goodsActive:'active',
                    buyername:req.buyerInfo.username,
                    goodsList:result,
                    sort:query.sort,
                    pageArr,
                    currentPage:page,
                    count:count,
                    isPre:page>1,
                    isNext:page<pages,
                    sellername:req.sellerInfo.username
                })   
        });
})
//商家列表
router.get('/sellerlist',(req,res)=>{
    //查询所有的商家
    Seller.find().then(result=>{
        res.render('buyer/sellerlist',{
            sellerActive:'active',
            buyername:req.buyerInfo.username,
            sellerList:result,
            sellername:req.sellerInfo.username
        });
    })
})
//商家详情页面
router.get('/sellerDetail',(req,res)=>{
    //1.取出URL中的参数 取出page count
    let query = url.parse(req.url,true).query;
    //获得商家id
    let id = query.id;
    let sort = query.sort?{price:query.sort} :{};
    // console.log(sort);
    //2.判断是否有参数，如果没有，page=1 count=4
    let page = Number(query.page || 1);
    let count = Number(query.count || 4);
    //3.计算查询条件 skip=(page-1)*count limit=count
    let skip=(page-1)*count;
    let limit = count;
    let pages;
    let pageArr = [];
    Goods.where({seller:id}).find().count().then(sum=>{ 
        pages = Math.ceil(sum/count);
        for(let i=1;i<=pages;i++){
            pageArr.push(i);
        }
    })
    //查询商家信息
    Seller.findById(id).then(sellerInfo=>{
        //查询该商家的商品
        Goods.where({seller:id}).find().sort(sort).skip(skip).limit(limit).then(result=>{
            res.render('buyer/sellerDetail',{
                sellerActive:'active',
                buyername:req.buyerInfo.username,
                goodsList:result,
                sellerInfo,
                sellername:req.sellerInfo.username,
                sort:query.sort,
                pageArr,
                currentPage:page,
                count:count,
                isPre:page>1,
                isNext:page<pages
           })
        })
    })
})
//商品详情页
router.get('/goodsDetail',(req,res)=>{
    //获得商品id
    let id = url.parse(req.url,true).query.id;
    Goods.findById(id).populate(['seller']).then(result=>{
        // console.log(result);
        res.render('buyer/goodsDetail',{
            goodsActive:'active',
            buyername:req.buyerInfo.username,
            buyer:req.buyerInfo._id,
            goodsInfo:result,
            sellername:req.sellerInfo.username
        })
    })
})
router.get('/goodsCart',(req,res)=>{
        let b_id=req.buyerInfo._id;
    Cart.where({buyer:b_id}).find().populate(['goods']).then(cartinfo => {
        res.render('buyer/goodsCart',{
            goodsActive:'active',
            buyername:req.buyerInfo.username,
            cartList:cartinfo,
            sellername:req.sellerInfo.username
        })
    })
})
router.get('/buyerOrder',(req,res)=>{
    let b_id=req.buyerInfo._id;
    Order.where({buyer:b_id}).find().populate(['goods']).then(orderinfo => {
    res.render('buyer/buyerOrder',{
        goodsActive:'active',
        buyername:req.buyerInfo.username,
        orderList:orderinfo,
        sellername:req.sellerInfo.username
    })
})
})
module.exports = router;