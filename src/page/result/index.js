/**
 * @author HB
 * @date 2018/5/23
 * @fileName index.js
 * @Description:  result js
*/
/*引用 index css*/
require("./index.css");
/*引用工具类*/
var _mm = require('util/mm.js');
/*引用用户类*/
var _user = require('service/userService');
var page = {
   init: function () {
      this.validateToken();
   },
    // 进行Token验证
    validateToken:function () {
        var  _this = this;
        var type = _mm.getUrlParam("type") || "default";
        $element = $("." + type + "-success");
        var TokenInfo = _mm.getUrlParam("Token");
        // 注册成功页面显示
        if (TokenInfo == null){
            // 显示对应的提示元素
            $element.show();
            return;
        }else{
            // 邮箱验证
            // 取出Token以及email
            var AboutToken = new Array();
            AboutToken = TokenInfo.split("|");
            _user.validateToken(AboutToken,function (data,msg) {
                $element.find("div").text(msg);
                $element.show();
            },function (errMsg) {
                // 验证失败（重新进行验证）
                $element = $(".email-fail");
                $element.show();
                $element.find("div").text(errMsg);
                // 再次验证
                $(".revalidate").click(function () {
                   _user.sendEmail(AboutToken[1]);
                   layer.msg("发送成功!");
                });
            });
        }

    }
};
$(function () {
   page.init();
});
