var logoPath = '';
var bannerpath = '';
//上传logo事件
$('#logoInput').on('change',function(){
    var logoForm = $('#logo-form')[0];
    var formData = new FormData(logoForm);
    $.ajax({
        url:'/seller/api/upload',
        type:'post',
        data:formData,
        processData:false,//不按jq方式处理
        contentType:false,//识别到form的enctype值
        success:function(data){
            console.log('上传成功'),
            console.log(data);
            if(data.statusCode == 0){
                //设置图片
                document.querySelector('.logo').src = data.data.imagesPath[0];
                //保存图片路径
                logoPath = data.data.imagesPath[0];
            }else{
                alert(data.message);
            }
        },
        fail:function(){
            console.log('上传失败');
        }
    })
})
//上传banner的事件
$('#bannerInput').on('change',function(){
    var bannerForm = $('#banner-form')[0];
    var formData = new FormData(bannerForm);
    $.ajax({
        url:'/seller/api/upload',
        type:'post',
        data:formData,
        processData:false,//不按jq方式处理
        contentType:false,//识别到form的enctype值
        success:function(data){
            console.log('上传成功'),
            console.log(data);
            if(data.statusCode == 0){
                //设置图片
                document.querySelector('.banner').src = data.data.imagesPath[0];
                //保存图片路径
                bannerPath = data.data.imagesPath[0];
            }else{
                alert(data.message);
            }
        },
        fail:function(){
            console.log('上传失败');
        }
    })
})

$("#confirm").on('click', function () {
    //获得输入框中的值
    var name = $("input[name='user']").val();
    var psd = $("input[name='psd']").val();
    var repsd = $("input[name='repsd']").val();
    //判断是否输入为空
    if (name && psd && repsd) {
        //判断密码是否一致
        if (psd == repsd) {
            //发送请求，执行注册
            console.log(111);
            $.ajax({
                type: 'post',
                url: '/seller/api/register',
                data: {
                    username: name,
                    password: psd,
                    repassword: repsd,
                    logo: logoPath,
                    banner: bannerPath
                },
                success: function (result) {
                    console.log(result);
                    if (result.statusCode == 0) {
                        //注册成功，去登录页面
                        window.location.href = '/seller/login';
                    } else {
                        alert(result.message);
                    }
                }
            })
        } else {
            console.log('两次密码不一致');
        }
    } else {
        console.log('输入不能为空');
    }
})