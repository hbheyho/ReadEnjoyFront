/**
 * @author HB
 * @date 2019/1/7
 * @fileName index.js
 * @Description: 浏览 js
*/
/*引用 index css*/
require("./index.css");
// 引用工具类
var _mm = require("util/mm")

var page = {
    init: function () {
        var swfName = _mm.getUrlParam("swfName") || "";
        // mobi格式还有epub格式不支持浏览
        if (swfName.indexOf("mobi") != -1 || swfName.indexOf("epub") != -1 || swfName != ""){
            // 加载flash插件
            var fp = new FlexPaperViewer(
                'FlexPaperViewer',
                'viewerPlaceHolder', { config : {
                        SwfFile : escape('http://swf.readenjoy.com/' + swfName),
                        Scale : 0.6,
                        ZoomTransition : 'easeOut',
                        ZoomTime : 0.5,
                        ZoomInterval : 0.2,
                        FitPageOnLoad : true,
                        FitWidthOnLoad : true,
                        FullScreenAsMaxWindow : false,
                        ProgressiveLoading : true,
                        MinZoomSize : 0.2,
                        MaxZoomSize : 5,
                        SearchMatchAll : true,
                        InitViewMode : 'SinglePage',
                        ViewModeToolsVisible : true,
                        ZoomToolsVisible : true,
                        NavToolsVisible : true,
                        CursorToolsVisible : true,
                        SearchToolsVisible : true,
                        localeChain: 'en_US'
                    }});
            return null;
        }
        layer.msg("该格式暂不支持浏览哦~");
    }
};
$(function () {
    page.init();
})
