/**
 * @author HB
 * @date 2019/1/20
 * @fileName index.js
 * @Description:  用户状态检查
*/
/*引用自身css*/
require("./index.css");
/*引用验证码插件*/
require("util/codeVerify");
/*引用输入框插件*/
require("util/InputJS");
/*引用工具类mm*/
var  _mm = require("util/mm");
/*引用userservice */
var _user = require("service/userService");

/*表单错误提示*/
var formError = {
    show:function (errMsg) {
        $(".error-item").show().find(".tips").text(errMsg);
    },
    hide:function () {
        $(".error-item").hide().find(".tips").text("");
    }
};
var page = {
    init: function () {
        this.onLoad();
        this.bindEvent();
    },
    onLoad:function () {
        this.loadStepEmail();  // 加载邮箱页面
    },
    bindEvent:function () {
      var _this = this;
      // 加载验证码插件
      var verifyCode = new GVerify("vContainer");
    // 输入邮箱后下一步按钮的点击
    $("#email-Button").click(function (e) {
        //验证码验证
        var validecode = verifyCode.validate(document.getElementById("codeInput").value);
        e.preventDefault();
        var email = $.trim($("#email").val());
        //邮箱存在
        if(email){
            if ((/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(email))){
                // 得到当前用户状态
                _user.getUserStatus(email, function (status) {
                    var data = {
                        email: email,
                        status: status
                    };
                    if (validecode) {
                        _this.loadStepStatus(data);  // 加载相应的状态处理模板
                    } else {
                        formError.show("验证码错误！");
                    }
                }, function (errorMsg) {
                    formError.show(errorMsg);
                });
            }else{
                formError.show("邮箱格式错误");
            }
        }else{  // 邮箱不存在
            formError.show("请输入邮箱");
        }
    });
   },
    // 加载输入邮箱的一步
    loadStepEmail:function () {
        $(".step-email").show();
    },
    //加载用户状态一步
    loadStepStatus:function (data) {
        // 清除错误提示
        formError.hide();
        //容器切换
        if (data.status == 0){
            $(".step-email").hide().siblings(".step-notValidateEmail")
                .show().find(".feedback-info").text("(..•˘_˘•..) 你的邮箱"+data.email+"还没验证啊!");
            // 发送邮件
            $("#send-Button").click(function () {
                _user.sendEmail(data.email,0);
                layer.msg("邮件发送成功!");
            });
        }else  if (data.status == 2){ //用户被停用
            $(".step-email").hide().siblings(".step-userSuspend")
                .show();
        }
    /*.find(".q-name").text(this.data.question);*/
    },
};
$(function () {
   page.init();
});