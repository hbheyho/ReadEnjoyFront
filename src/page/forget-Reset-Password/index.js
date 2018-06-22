/**
 * @author HB
 * @date 2018/5/22
 * @fileName index.js
 * @Description: forget-Reset-Password  js
*/
/*引用index.css */
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
    data:{
        email:"",
        question:"",
        answer:"",
        token:""
    },
    init:function () {
        this.onLoad();
        this.bindEvent();
    },
    onLoad:function () {
        this.loadStepUsername();  // 加载用户名页面
    },
    bindEvent:function () {
        var _this = this;
        // 加载验证码插件
        var verifyCode = new GVerify("vContainer");
       // 输入用户名后下一步按钮的点击
        $("#email-Button").click(function (e) {
            //验证码验证
            var validecode = verifyCode.validate(document.getElementById("codeInput").value);
            e.preventDefault();
            var email = $.trim($("#email").val());
            //邮箱存在
            if(email){
                if ((/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(email))){
                    _user.getQuestion(email, function (res) {
                        _this.data.email = email;
                        _this.data.question = res;
                        if (validecode) {
                            _this.loadStepQuestion();  // 加载输入密保问题模板
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
        // 输入密码提示问题答案中的按钮点击
        $("#answer-Button").click(function (e) {
            e.preventDefault();
            var answer = $.trim($("#answer").val());
            //密码提示问题答案存在
            if(answer){
                _user.checkAnswer({
                    email: _this.data.email,
                    question: _this.data.question,
                    answer: answer
                },function (res) {
                    _this.data.answer = answer;
                    _this.data.token = res;
                    _this.loadStepPassword();
                },function (errorMsg) {
                    formError.show(errorMsg);
                });
            }else {  //问题答案不存在
                formError.show('请输入密码提示问题答案');
            }
        });
        // 输入新密码后的按钮点击
        $("#reset-Button").click(function (e) {
            var password = $.trim($("#password").val());
            var confirmPsd = $.trim($("#confirmPsd").val());
            //密码不为空切大于8位
            if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/.test(password))){
                 formError.show("请输入正确的密码格式(8-16位数字与密码混合)");
            } else if (password != confirmPsd){
                formError.show("两次输入的密码不一样！");
            } else {
                _user.resetPassword({
                    email: _this.data.email,
                    passwordNew: password,
                    forgetToken: _this.data.token
                },function (res) {
                    window.location.href = "./result.html?type=pass-reset";
                },function (errorMsg) {
                    formError.show(errorMsg);
                });
            }
        });
    },
    // 加载输入用户名的一步
    loadStepUsername:function () {
        $(".step-email").show();
    },
    //加载输入密保答案的一步
    loadStepQuestion:function () {
      // 清除错误提示
      formError.hide();
      //容器切换
       $(".step-email").hide().siblings(".step-question")
       .show().find(".q-name").text(this.data.question);
    },
    //记载输入重置密码的一步
    loadStepPassword:function () {
      // 清除错误提示
      formError.hide();
      //容器切换
        $(".step-question").hide().siblings(".step-password")
            .show();
    }
};
$(function () {
    page.init();
});
