/**
 * @author HB
 * @date 2019/1/7
 * @fileName index.js
 * @Description: 浏览 js
*/
/*引用 index css*/
require("./index.css");
// 引用工具类
var _mm = require("util/mm");
/*引用bookService*/
var _bookService = require("service/bookService");
/*引入页面userService*/
var _user = require("service/userService");
var tempBookOutline = require("./bookOutline.string");
var page = {
    init: function () {
        var swfArr = new Array();
        var swfInfo = _mm.getUrlParam("swfName") || "";
        swfArr=swfInfo.split("|");
        this.loadSwf(swfArr[0]);
        this.loadBookVersion(swfArr[1],swfArr[2]);
        this.checkUserLogin();
    },
    loadSwf:function (swfName) {
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
    },
    loadBookVersion: function (bookIsbn,bookUploadname) {
        var bookOutlineHtml = "";
        var searchCondition = {
            bookISBN: bookIsbn
        };
        _bookService.getBookDetail(searchCondition,function (data) {
            bookOutlineHtml = _mm.renderHtml(tempBookOutline,{
                BookDetail: data,
                bookIsbn: bookIsbn,
                bookUploadname: bookUploadname
            });
            $(".left-book").html(bookOutlineHtml);
        },function (errMsg) {
            console.log(errMsg);
        });
    },
    // 下载的用户登录检查
    checkUserLogin:function () {
        var _this = this;
        _user.checkLogin(function (data) {
            if (data != undefined) {
                _this.userName = data.username;
                // 用户评论 登录之后才能评论
                _this.commentVersion();
            }
        }, function () {
            // 下载的登录判断
            $("body").on("click",".down-btn",function () {
                if (_this.userName == undefined){
                    alert("想下载？请登录哦");
                    _mm.doLogin();
                    return false;
                }
            });
        });
    }
};
$(function () {
    page.init();
})
