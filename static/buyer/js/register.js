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
            $.ajax({
                type: 'post',
                url: '/api/register',
                data: {
                    username: name,
                    password: psd,
                    repassword: repsd
                },
                success: function (result) {
                    console.log(result);
                    if (result.statusCode == 0) {
                        //注册成功，去登录页面
                        window.location.href = '/login';
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