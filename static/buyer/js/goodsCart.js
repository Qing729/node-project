$('body').on('click','#del',function(){
    $(this).parents('tr').remove();
    var dataInfo = $(this).data("info");
    console.log(dataInfo);
    // console.log($(this).attr('data-info'));
    $.ajax({
        url: '/api/goodsCart',
        type: 'post',
        data: {
            cartid:dataInfo
        },
        success: function (result) {
            console.log('发送完成');
            if (result.statusCode == 0) {
                console.log(result.message);             
            } else {
                console.log(result.message);
            }
        }
    })
})