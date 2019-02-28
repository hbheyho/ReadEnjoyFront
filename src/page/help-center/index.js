/**
 * @author HB
 * @date 2018/10/7
 * @fileName index.js
 * @Description:  帮助中心 js
*/
"use strict";
/*引用工具类*/
var _mm = require("util/mm");
/*footer-detail 公共样式*/
require("../common/footer-detail.css");
/*引入help-center css*/
require("./index.css");
/*引用navigation模块*/
require("../common/navigation/index.js");
/*引入footer模块*/
require("../common/footer/index");
$(function () {
    // 禁止图片拖拽
    $('img').on('mousedown',function (e) {
        e.preventDefault()
    });

    // tab 转换
    $(".right-link .tab-item").on("click",function () {
        $(this).addClass("item-active").siblings().removeClass("item-active");
        $(".left-content .main").eq($(this).index()).show().siblings().hide();
    })
});
