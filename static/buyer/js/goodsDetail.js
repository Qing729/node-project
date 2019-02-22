$('.size li').first().addClass('checked');
$('.style li').first().addClass('checked');
var size = $('.size').children('.checked').text();
var style = $('.style').children('.checked').text();
$('body').on('click','.checksize',function(){
    $(this).addClass('checked').siblings().removeClass('checked');
    size = $('.size').children('.checked').text();
    console.log(size);
})
$('body').on('click','.checkstyle',function(){
    $(this).addClass('checked').siblings().removeClass('checked');
    style = $('.style').children('.checked').text();
    console.log(style);
})
$('#addcart').on('click',function(){
    var g_id=$(this).attr('data-goods');
    var s_id=$(this).attr('data-seller');
    var b_id=$(this).attr('data-buyer');
    // console.log(g_id);
    var cookieArr = JSON.parse($.cookie("Cart") || '[]');
    // var cookiebuyer = $.cookie("BUYERID");
    // console.log(cookiebuyer);
        $.ajax({
        url: '/api/goodsDetail',
        data: {
            g_id: g_id,
            s_id: s_id,
            b_id: b_id,
            num: $(".spinnerExample").val(),
            size: size,
            style: style
        },
        type: 'POST',
        success: function(data){
            if(data.statusCode == 1){
                alert(data.message);
                window.location.href = '/login';
            }
            else if(data.statusCode == 0){
                window.location.href = '/goodsCart';
            }else{
                alert(data.message);
            }
        }
        })
    //     var iscookie = true;//默认没有相同的商品
    //     for (var i = 0; i < cookieArr.length; i++) {
    //     //读取cookie中的数据，如果有同一个商品，修改数量后保存
    //     if (cookieArr[i].g_id == g_id && cookieArr[i].s_id==s_id && cookieArr[i].size==size && cookieArr[i].style==style) {
    //         cookieArr[i].num = parseInt(cookieArr[i].num) + parseInt($(".spinnerExample").val());
    //         iscookie = false;
    //         }
    //     }
    //     if (iscookie == true) {
    //         var saveObj = {
    //             g_id: g_id,
    //             s_id: s_id,
    //             num: $(".spinnerExample").val(),
    //             size: size,
    //             style: style
    //         };
    //         cookieArr.push(saveObj)
    //     }
    //     $.cookie("Cart", JSON.stringify(cookieArr), {expires: 7})  
})
$('#buy').on('click', function(){
        // 让用户选择尺码
        // 让用户选择款式
        // 让用户选择数量
        // 商品id
        // ajax post
        // 不成功，请先登录
        // 成功:生成订单
    var g_id=$(this).attr('data-goods');
    var s_id=$(this).attr('data-seller');
    var b_id=$(this).attr('data-buyer');
    $.ajax({
        url: '/api/buygoods',
        data: {
            g_id: g_id,
            s_id: s_id,
            b_id: b_id,
            num: $(".spinnerExample").val(),
            size: size,
            style: style,
            status:1
        },
        type: 'POST',
        success: function(data){
            if(data.statusCode == 1){
                alert(data.message);
                window.location.href = '/login';
            }
            else if(data.statusCode == 0){
                // 跳转到订单页面， 订单id ： data.data.orderid
                window.location.href = '/buyerOrder';
            }else{
                alert(data.message);
            }
        }
    })

})