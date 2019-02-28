/**
* 2018-05-14 11:28:45
* 作者:HB
* 文件名:index.js
* 描述:  login页面的js
*/
"use strict";
/*引用login css*/
require("./index.css");
/*引用验证码插件*/
require("util/codeVerify");
/*引用 input js*/
require("util/InputJS");
/*引入mm js工具类*/
var _mm = require("util/mm");
/*引入userService类*/
var _user = require("service/userService");

// 表单错误提示
var formError = {
    show:function (errMsg) {
       $(".error-item").show().find(".tips").text(errMsg);
    },
    hide:function () {
        $(".error-item").hide().find(".tips").text("");
    },
    // 展示账户信息
    showUserInfo: function (errMsg) {
        console.log($(".error-item").show().find(".tips").html(errMsg));
    }
};
var page = {
    init:function () {
       this.bindEvent();
       this.isLogin();
    },
    bindEvent:function(){
        var _this = this;
        // 加载验证码canvas
        var verifyCode = new GVerify("vContainer");

        $("#email,#password").blur(function () {
            var formData = {
                email:$.trim($("#email").val()),
                password:$.trim($("#password").val()),
            };
            var validateResult = _this.formValidate(formData);
            formError.show(validateResult.msg);
        });
        //注册按钮提交
        $("#loginButton").click(function(e){
            //阻止表单默认事件
            event.preventDefault();
            _this.submit(verifyCode);
        });
        //回车键提交
        $(".input-item").keyup(function(e){
            if (e.keyCode == 13) {
                _this.submit(verifyCode);
            }
        });
    },
    // 检查用户是否登录 --若登录 跳转到index.html
    isLogin:function(){
        _user.checkLogin(function (data) {
           if (data != null){
               window.location.href = "./index.html";
           }
        },function () {
        });
    },
    submit:function (verifyCode) {
        var formData = {
            email:$.trim($("#email").val()),
            password:$.trim($("#password").val()),
            agree:$.trim($("input[name='agree']:checked").val())

        },
        validateResult = this.formValidate(formData);
        if (validateResult.status){
            //验证码验证
            var validecode = verifyCode.validate(document.getElementById("codeInput").value);
                _user.login(formData,function (res) {
                    if (validecode) {
                        window.location.href = _mm.getUrlParam("redirect") || "./index.html";
                    } else {
                        formError.show("验证码错误");
                    }
                },function (errorMsg,code) {
                    /*错误信息展示(包括status = 1时)*/
                    if (code == 2){
                        formError.showUserInfo(errorMsg + " <a href=\"./user-status.html\">查看详情</a>");
                    }else {
                        formError.show(errorMsg);
                    }
                });
        }else {
               formError.show(validateResult.msg);
        }
    },
    //表单验证
    formValidate:function (formData) {
        var result = {
            status:false,
            msg:""
        };
        if (!_mm.validate(formData.email,"require")){
            result.msg = "邮箱不能为空";
            return result;
        }
        if (!_mm.validate(formData.email,"email")){
            result.msg = "邮箱格式错误";
            return result;
        }
        if (!_mm.validate(formData.password,"require")){
            result.msg = "密码不能为空";
            return result;
        }
        if (!_mm.validate(formData.password,"password")){
            result.msg = "请输入正确的密码格式(8-16位数字与密码混合)";
            return result;
        }
        //验证通过 返回正确提示
        result.status = true;
        result.msg = "验证通过";
        return result;
    }
}
/*调用init*/
$(function(){
    page.init();
});






