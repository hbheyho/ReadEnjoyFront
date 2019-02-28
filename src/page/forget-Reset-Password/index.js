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
    wayCode:{
        code:""
    },
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
        // 加载选择页面
        this.loadModifyWay();
        // 通过了邮箱验证之后修改密码
        this.modifyPswByEmail();
    },
    bindEvent:function () {
        var _this = this;
        // 选择修改方式
        $("#choose-Button").click(function (e) {
            e.preventDefault();
            var Code = $("#modify-way").val();
            _this.wayCode.code = Code;
            // 加载邮箱验证模板
            _this.loadStepEmail();
        });

        // 加载验证码插件
        var verifyCode = new GVerify("vContainer");
       // 选择修改密码后下一步按钮的点击
        $("#email-Button").click(function (e) {
            //验证码验证
            var validecode = verifyCode.validate(document.getElementById("codeInput").value);
            e.preventDefault();
            var email = $.trim($("#email").val());
            //邮箱存在
            if(email){
                if ((/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(email))){
                    if (_this.wayCode.code == 0){ //邮箱验证（通过是否可以得到用户状态来判断是否由此用户）
                        _user.getUserStatus(email,function () {
                            if (validecode) {
                                _this.loadStepSendEmail(email);  // 加载发送邮件模板
                            } else {
                                formError.show("验证码错误！");
                            }
                        },function (errorMsg) {
                            formError.show(errorMsg);
                        });
                    }else if (_this.wayCode.code == 1){ //密保验证
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
                    }
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
        // 回到选择方式
        $(".back-way").click(function () {
            var _this = this;
            $(".step-email").hide().siblings(".choose-way").show();
        });
        // 回到邮箱
        $(".back-email").click(function () {
            var _this = this;
            $(".step-sendEmail").hide().siblings(".step-email").show();
        });
        // 回到选择方式
        $(".back-email2").click(function () {
            var _this = this;
            $(".step-question").hide().siblings(".step-email").show();
        });
    },
    // 修改密码通过邮箱
    modifyPswByEmail: function(){
        var _this = this;
        // 通过了邮箱验证之后修改密码
        var TokenInfo = _mm.getUrlParam("Token");
        if (TokenInfo == null){
            return;
        }
        // 取出Token以及email并存入
        var AboutToken = new Array();
        AboutToken = TokenInfo.split("|");
        _this.data.email = AboutToken[1];
        _this.data.token = AboutToken[0];
        if (AboutToken !=null){
            $(".choose-way").hide().siblings(".step-password").show();
        } else {
            return;
        }
    },
    // 加载修改密码方式
    loadModifyWay: function(){
        $(".choose-way").show();
    },
    // 加载输入邮箱的一步
    loadStepEmail:function () {
        $(".choose-way").hide().siblings(".step-email").show();
    },
    // 加载发送邮件的一步
    loadStepSendEmail: function(email){
        // 清除错误提示
        formError.hide();
        //容器切换
        $(".step-email").hide().siblings(".step-sendEmail")
            .show();
        // 发送邮件点击
        $("#send-Button").click(function () {
            _user.sendEmail(email,1);
            layer.msg("邮件发送成功!");
        });
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
