$('#confirm').on('click', function () {
    //获取用户名密码
    var user = $("input[name='user']").val();
    var psd = $("input[name='psd']").val();
    //判断是否为空
    if (user && psd) {
        //发送登录请求
        $.ajax({
            type: 'post',
            url: '/seller/api/login',
            data: {
                username: user,
                password: psd,
            },
            success: function (result) {
                console.log(result);
                if (result.statusCode == 0) {
                    window.location.href = '/seller';
                } else {
                    alert(result.message);
                }
            }
        })
    } else {
        console.log('输入不能为空')
    }
})