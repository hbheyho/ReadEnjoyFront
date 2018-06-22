/**
* 2018-05-19 11:28:45
* 作者:HB
* 文件名:index.js
* 描述:  register页面的js
*/
/*引入注册样式*/
require("./index.css");
/*引用验证码插件*/
require("util/codeVerify");
/*引用输入框插件*/
require("util/InputJS");
/*引用工具类 _mm*/
var _mm = require("util/mm");
/*引入userservice*/
var _user = require("service/userService");
// 表单错误提示
var formError = {
  show:function (errMsg) {
      $(".error-item").show().find(".tips").text(errMsg);
  },
  hide:function () {
        $(".error-item").hide().find(".tips").text("");
    }
 };
var page = {
    init:function(){
       this.bindEvent();
    },
    bindEvent:function(){
        var _this = this;
        // 加载验证码canvas
        var verifyCode = new GVerify("vContainer");
       // 进行username验证
        $("#username").blur(function () {
            var username = $.trim($("#username").val());
            if (!username){
                return;
            }
            // 异步验证用户名是否存在
            _user.checkUsername(username,function (res) {
                formError.hide();
            },function (errMsg) {
                formError.show(errMsg);
            });
        });
        // 进行email验证
        $("#email").blur(function () {
            var email = $.trim($("#email").val());
            if (!email){
                return;
            }
            // 异步验证用户名是否存在
            _user.checkEmail(email,function (res) {
                formError.hide();
            },function (errMsg) {
                formError.show(errMsg);
            });
        });
       //注册按钮提交
       $("#registerButton").click(function(e){
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
    //表单提交
    submit:function(verifyCode){
        var formData = {
            username:$.trim($("#username").val()),
            email:$.trim($("#email").val()),
            password:$.trim($("#password").val()),
            confirmPsd:$.trim($("#confirmPsd").val()),
            question:$.trim($("#question").val()),
            answer:$.trim($("#answer").val())
        };
        //表单验证返回结果
        validateResult = this.formValidate(formData);
        if (validateResult.status) {
            //验证码验证
            var validecode = verifyCode.validate(document.getElementById("codeInput").value);
                _user.register(formData, function (res, msg) {
                   if (validecode) {
                       // 跳转回原来的页面 若没 跳转到主页
                       window.location.href = _mm.getUrlParam("redirect") || "./result.html?type=register";
                   }else {
                       formError.show("验证码错误");
                   }
                }, function (errorMsg) {
                    console.log(errorMsg);
                    formError.show(errorMsg);
                });
        }else{
             formError.show(validateResult.msg);
        }     
    },
    formValidate:function(formData){
        var result = {
           status:false,
           msg:""
        };
        if (!_mm.validate(formData.username,"require")){
            result.msg = "用户名不能为空";
            return result;
        }
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
        // 验证密码长
        if (!_mm.validate(formData.password,"password")){
            result.msg = "请输入正确的密码格式(8-16位数字与密码混合)";
            return result;
        }
        // 验证两次输入的密码是否一致
        if(formData.password !== formData.confirmPsd){
            result.msg = '两次输入的密码不一致';
            return result;
        }
        // 验证密码提示问题是否为空
        if(!_mm.validate(formData.question, 'require')){
            result.msg = '密码提示问题不能为空';
            return result;
        }
        // 验证密码提示问题答案是否为空
        if(!_mm.validate(formData.answer, 'require')){
            result.msg = '密码提示问题答案不能为空';
            return result;
        }
        if(!$("#agree").is(":checked")){
            alert("请阅读并同意相应的用户协议与条款");
            return result;
        }
         //验证通过 返回正确提示
        result.status = true;
        result.msg = "验证通过";
        return result;
    },
}
/*调用init*/
$(function(){
    page.init();
});