/**
 * @author HB
 * @date 2018/5/30
 * @fileName indexService.js
 * @Description:  导航逻辑
*/
/*引用工具类*/
var _mm = require("util/mm");

var _indexService = {
   // 加载navigation 信息
    getNavigation: function (resolve,reject) {
        _mm.request({
            url: _mm.getServerUrl("http://localhost:8080/navigation/get_deep_navigation.do"),
            method:"get",
            success:resolve,
            error:reject
        });
    },
    // 加载中部父分类信息
    getMidCategory: function (resolve,reject) {
        _mm.request({
           url: _mm.getServerUrl("http://localhost:8080/category/get_parent_categoty.do"),
           method: "get",
           success: resolve,
           error: reject
        });
    }

};
module.exports = _indexService;