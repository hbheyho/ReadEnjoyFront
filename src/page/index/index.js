/**
* 2018-05-14 11:29:53
* 作者:HB
* 文件名:index.js
* 描述: 主页面的js
*/
"use strict";
/*引用工具类*/
var _mm = require("util/mm");
/*引用index css*/
require("./index.css");
/*引用navigation模块*/
require("../common/navigation/index.js");
/*引入footer模块*/
require("../common/footer/index");
/*引用backTop*/
require("util/BackTop");
/*引入indexService*/
var _indexService = require("service/indexService");
/*引入bookService*/
var _bookService = require("service/bookService");
/*引入bookList模板*/
var tempBookList = require("./index.string");
/*引入midSearchBookList模板*/
var tempMidSearchBookList = require("./midSearch.string");
/*引入midcategory模板*/
var tempMidcategory = require("./midCategory.string");
/*引入lazy load*/
require("util/jquery.lazyload.min");
var  page = {
    init: function () {
        this.onLoadBookList();
        this.onLoadMidCategory();
        this.bindEvent();
    },
    bindEvent:function(){
       var _this = this;
       /*中部搜索栏提交*/
       $(".search-btn-a").click(function (e) {
           e.preventDefault();
           _this.midSearchSubmit();
       });
       $(".banner-search").keyup(function (e) {
           if(e.keyCode == 13){
               _this.midSearchSubmit();
           }
       });
    },
    // 中部搜索提交
    midSearchSubmit:function(){
        var conditionName = $.trim($("#searchBan").val());
        var searchHtml = "";
        // 搜索数据(前台传过去的需要是json数据)
        var searchCondition = {
            conditionName:conditionName
        };
        if (conditionName == ""){
            alert("输入不能为空哦");
            return;
        };
        _bookService.getSearchBookList(searchCondition,function (res) {
            searchHtml = _mm.renderHtml(tempMidSearchBookList,{
                SearchbookList:res,
                searchLength:res.length
            });
            $("#bookContent").html(searchHtml);
        },function (error) {
            console.log(error);
        });
    },
    /*加载书籍信息*/
    onLoadBookList: function () {
        var bookInfoHtml = "";
        _bookService.getBookListByDownNumber(function (res) {
             bookInfoHtml = _mm.renderHtml(tempBookList, {
                bookList: res
            });
            $("#bookContent").html(bookInfoHtml);
            // 进行懒加载
            $(".lozad").lazyload({
                placeholder : "images/loading.gif",
                effect: "fadeIn",
                // 参数:threshold,值为数字,代表页面高度.如设置为200,表示滚动条在离目标位置还有50的高度时就开始加载图片,可以做到不让用户察觉.
                threshold: 50
             });
        }, function (error) {
            console.log(error);
        })
    },
    /*加载中部分类信息*/
    onLoadMidCategory:function () {
        var categoryInfoHtml = "";
        _indexService.getMidCategory(function (res) {
           categoryInfoHtml =  _mm.renderHtml(tempMidcategory,{
                categoryList: res
            });
           $(".banner-nav").html(categoryInfoHtml);
        },function (error) {
            console.log(error);
        })

    }
}
$(function () {
    page.init();
});
