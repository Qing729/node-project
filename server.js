const express = require('express');
const swig = require('swig');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Cookies = require('cookies');

//引入处理html请求和ajax请求的模块
const buyerViewRouter = require('./routers/views/buyerViewRouter');
const sellerViewRouter = require('./routers/views/sellerViewRouter');
const buyerApiRouter = require('./routers/api/buyerApiRouter');
const sellerApiRouter = require('./routers/api/sellerApiRouter');

//引入买家数据表格模型
const Buyer = require('./models/Buyer');
Buyer.find().then(result=>{
   // console.log(result);         
})
//引入卖家数据表格模型
const Seller = require('./models/Seller');
Seller.find().then(result=>{
   // console.log(result);         
})
//引入商品数据表格模型
const Goods = require('./models/Goods');
Goods.find().then(result=>{
   // console.log(result);         
})
const Order = require('./models/Order');
Order.find().then(result=>{
   // console.log(result);         
})

//创建服务器
const server = express();

//html 静态资源 ajax 

//处理html模板页面请求
//配置模板引擎
// 1.配置应用模板
// 参数1：模板引擎的名字，同时也是模板文件的后缀
// 参数2：表示处理模板的方法
server.engine('html',swig.renderFile);
// 2.设置模板文件的目录
server.set('views','./views');
// 3.注册所使用的模板
server.set('view engine','html');

//处理静态资源的请求
server.use('/public',express.static(__dirname+'/static'));

//swig缓存模板设置
swig.setDefaults({cache:false});

//对所有的请求，解析请求body中的参数（post请求）
//用参数 直接使用request.body
server.use(bodyParser.urlencoded());

//统一对每一个请求处理cookies
server.use((request,response,next)=>{
    //处理cookies
    request.cookies = new Cookies(request,response);
    //获得买家id
    let buyerId = request.cookies.get('BUYERID');
    request.buyerInfo = {};
    if(!buyerId){
        //没有登录
        next();
        return;
    }
    //查询数据库
    Buyer.findById(buyerId)
    .then(buyerInfo=>{
        if(buyerInfo){
            request.buyerInfo = buyerInfo;
        }
        next(); //异步
    })
})
server.use((request,response,next)=>{
    //获得卖家id
    let sellerId = request.cookies.get('SELLERID');
    request.sellerInfo = {};
    if(!sellerId){
        //没有登录
        next();
        return;
    }
    //查询数据库
    Seller.findById(sellerId)
    .then(sellerInfo=>{
        if(sellerInfo){
            request.sellerInfo = sellerInfo;
        }
        next(); //异步
    })
})
// server.use((request,response,next)=>{
//     //获得cookie中商品信息
//     let goods = request.cookies.get('Cart');
//     if(!goods){
//         next();
//         return;
//     }
//     console.log(goods);
//     // console.log(goods[0].g_id);
//     // request.goodsInfo = {};
//     // //查询数据库
//     // Goods.findById(goods[0].g_id).populate(['seller'])
//     // .then(goodsInfo=>{
//     //     if(goodsInfo){
//     //         request.goodsInfo = goodsInfo;
//     //     }
//     //     next(); //异步
//     // })
// })
//ajax (get post)
//买家 卖家
//可以get处理html页面的请求
//买家页面请求
server.use('/',buyerViewRouter);
//买家的ajax
server.use('/api',buyerApiRouter);
//卖家页面请求
server.use('/seller',sellerViewRouter);
// //卖家的ajax
server.use('/seller/api',sellerApiRouter);

new Promise((resolve,reject)=>{
    //连接数据库
    mongoose.connect('mongodb://localhost:27019',(error)=>{
        if(error){
            reject();
        }else{
            resolve();
        }
    })
})
.then(
    //resolve 连接数据库成功 启动服务器
    ()=>{
        console.log('连接数据库成功');
        server.listen(8080,'localhost',(error)=>{
            if(error){
                console.log('启动服务器失败')
            }else{
                console.log('启动服务器成功，http://localhost:8080')
            }
        })
    },
    //reject 连接数据库失败
    ()=>{
        console.log('连接数据库失败')
    }
)