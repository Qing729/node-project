var smallImage = $('.small-image').attr('src');
var bigImages = [];
var sizearr = [];
var stylearr = [];
$('.big-image-list img').each(function (index, ele) {
    bigImages.push($(ele).attr('src'));
})
$('.sizelist span').each(function (index, ele) {
    sizearr.push($(ele).children('b').text());
})
$('.stylelist span').each(function (index, ele) {
    stylearr.push($(ele).children('b').text());
})
//上传缩略图
$('#smallInput').on('change', function () {
    //得到缩略图表单
    var smallForm = document.querySelector('#smallForm');
    //创建表单数据对象
    var formData = new FormData(smallForm);
    $.ajax({
        url: '/seller/api/upload',
        type: 'post',
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            console.log('上传成功');
            console.log(data);
            if (data.statusCode == 0) {
                document.querySelector('.small-image').src = data.data.imagesPath[0];
                smallImage = data.data.imagesPath[0];
            }
        },
        fail: function () {
            console.log('上传失败');
        }
    })
})
//上传详情图
$('#bigInput').on('change', function () {
    //得到详情图表单
    var bigForm = document.querySelector('#bigForm');
    //创建表单数据对象
    var formData = new FormData(bigForm);
    $.ajax({
        url: '/seller/api/upload',
        type: 'post',
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            console.log('上传成功');
            console.log(data);
            var html = '';
            for (var i = 0; i < data.data.imagesPath.length; i++) {
                var path = data.data.imagesPath[i];
                html += '<img src="' + path + '"/>';
            }
            document.querySelector('.big-image-list').innerHTML = html;
            bigImages = data.data.imagesPath;
        },
        fail: function () {
            console.log('上传失败');
        }
    })
})
$('#addsize').on('click', function () {
    var size = $('input[name="size"]').val();
    if (size && sizearr.indexOf(size) == -1) {
        $('input[name="size"]').val('');
        sizearr.push(size);
        console.log(sizearr);
        var shtml = "<span><b>" + size + "</b><i class='err'>x</i></span>"
        $(".sizelist").append(shtml);
    }
})
$('#addstyle').on('click', function () {
    var style = $('input[name="style"]').val();
    if (style && stylearr.indexOf(style) == -1) {
        $('input[name="style"]').val('');
        stylearr.push(style);
        console.log(stylearr);
        var chtml = "<span><b>" + style + "</b><i class='err'>x</i></span>"
        $(".stylelist").append(chtml);
    }
})
$('body').on('click', '.err', function () {
    // console.log($(this));
    $(this).parent().remove();
    del(sizearr,$(this));
    del(stylearr,$(this));
})
function del(arr,ele){
    // console.log(arr);
    // console.log(ele);
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == $(ele).prev().text()) {
            arr.splice(i, 1);
            console.log(arr);
            break;
        }
    }
}
//获取 url上的 id
function getUrlById(){
    if(window.location.href.indexOf("?") != -1 && window.location.href.indexOf("=") != -1){
        var str = window.location.search; 
        return str.split('?')[1].split("=")[1]
    }
    return "";
}
$('#confirm').on('click', function () {
    //商品名字 描述 缩略图 详情图 价格 尺码 款式
    var title = $('input[name="title"]').val();
    console.log(title);
    var des = $('#des').val();
    var price = $('input[name="price"]').val();
    $.ajax({
        url: '/seller/api/modify-goods',
        type: 'post',
        data: {
            title: title,
            description: des,
            smallImage: smallImage,
            bigImages: bigImages,
            price: price,
            style: stylearr,
            size: sizearr,
            goodsid:getUrlById()
        },
        success: function (result) {
            console.log('发送完成');
            if (result.statusCode == 0) {
                // console.log(result.message);
                window.location.href = '/seller/goodslist';
            } else {
                console.log(result.message);
            }
        }
    })
})