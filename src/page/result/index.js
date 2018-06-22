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

$(function () {
    var type = _mm.getUrlParam("type") || "default";
    $element = $("." + type + "-success");
    // 显示对应的提示元素
    $element.show();
});