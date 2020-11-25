$(function() { //jq提供的入口函数 需要在html页面引用jq文件
    $('#denglu').click(function() { //注册a标签点击事件 先阻止他的默认行为禁止跳转行内阻止javascript:;
        $('.gotoRegister').hide(); //让登录页面隐藏 
        $('.gotoLogin').show(); // 让注册页面显示
    });
    $('#zhuce').click(function() {
        $('.gotoRegister').show();
        $('.gotoLogin').hide();
    });
    let form = layui.form; //使用layui先进行校验表单 


    form.verify({ // layui里校验可以多个 即要满足校验一 也要满足校验2等 校验方法有正则和函数两种html格式中加类名lay-verify="required|pass"等 可以 添加多个校验规则 直接在后面加类名即可
        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repass: function(value) { //value：表单的值、item：表单的DOM对象
            let pwd = $(".gotoLogin input[name=password]").val() //使用属性选择器精确找到 val（）方法是获取到内容
            if (value !== pwd) { // 做判断如果再次输入的密码和之前输入的不一样 则return出去 代码不在执行 
                return "两次密码不一样";
            }
        }

    });
    /* 如果校验通过则通过主页页面发送请求 */
    //给form表单注册submit事件 要阻止它的默认行为
    $('#regiForm').on('submit', function(e) { //当注册页面form表单注册事件时 
        e.preventDefault(); //submit有默认提交功能 阻止默认行为
        /* 收集表单数据 */
        let data = $(this).serialize(); //jq提供的收集表单数据方法 serialize()
        /* 直接发送ajax请求*/
        $.ajax({
            type: "POST", //请求方式 get可忽略不写
            url: "/api/reguser", //已优化的根路径 易出错点 要用字符串的双引号包裹 
            data, //此时已将使用jq里面的方法获取到表单数据 data相当于一个变量 存储表单数据
            success: function(res) { //发送成功后的回调函数 res是服务器返回的内容
                console.log(res);
                if (res.status !== 0) { //做判断 接口文档上有说明 如果返回的不是0 就是请求失败 根据接口文档和返回的数据做if判断
                    return layer.msg('登录失败!' + res.message) //message是服务器响应回来的提示

                }
                layer.msg('注册成功');
                $("#zhuce").click();
                /* 注册成功后触发一下去登录按钮 跳转登录页面 */

            }

        })

    });

    $('#loginForm').on('submit', function(e) { //登录页面注册submit事件
        e.preventDefault(); //先阻止e的默认行为
        let data = $(this).serialize(); //获取到当前内容
        console.log(data);
        //发送ajax请求
        $.ajax({
            type: "POST",
            url: "/api/login",
            data,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！', {

                    time: 2000 //2秒关闭（如果不配置，默认是3秒）
                }, function() {
                    location.href = "index.html"
                });

            }
        })
    })
})