/**
 * @author HB
 * @date 2018/5/30
 * @fileName index.js
 * @Description:  页面导航js
*/
"use strict";
/*引入自身css*/
require("./index.css");
/*引入mm工具类*/
var _mm = require("util/mm");
/*引入页面indexService*/
var _indexService = require("service/indexService");
/*引入页面userService*/
var _user = require("service/userService");
/*引入bookService*/
var _bookService = require("service/bookService");
/*引入navagation模板*/
var tempNavigation = require("./navigation.string");
/*引入userLoginInfo模板*/
var tempUserLoginInfo = require("./userLogin.string");
/*引入navSearchBookList模板*/
var tempNavSearchBookList = require("./navSearch.string");
var page = {
    init:function () {
        this.loadNavigationInfo();
        this.loadUserInfo();
        this.bindEvent();
    },
    bindEvent:function(){
        var _this = this;
        /*导航栏搜索提交*/
        $("#book-search").click(function (e) {
            e.preventDefault();
            _this.navSearchSubmit();
        });
        $("#search-content").keyup(function (e) {
            if (e.keyCode == 13){
                _this.navSearchSubmit();
            }
        });
       // 用户退出登录
       $("body").delegate("#logout-btn",'click',function (e) {
             e.preventDefault();
             _user.logout(function (res) {
                 window.location.href = "./index.html";
             },function (errorMsg) {
                 _mm.errorTips(errorMsg);
             });
        });
    },
    // 导航栏搜索提交
    navSearchSubmit:function(){
    var conditionName = $.trim($("#conditionName").val());
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
        console.log(res);
        searchHtml = _mm.renderHtml(tempNavSearchBookList,{
            SearchbookList:res,
            searchLength:res.length
        });

        $("#index-content").html(searchHtml);
    },function (error) {
        console.log(error);
    });
    },
    // 加载用户信息
    loadUserInfo:function(){
        var userLofinInfoHtml = "";
        _user.getUserInfo(function (data) {
            if (data != undefined) {  // 数据不为空
                userLofinInfoHtml = _mm.renderHtml(tempUserLoginInfo, {
                    userLoginInfo: data
                });
                $("#nav-side").html(userLofinInfoHtml);
            }
        },function () {
            var  data = null;
            userLofinInfoHtml = _mm.renderHtml(tempUserLoginInfo, {
                userLoginInfo: data
            });
            $("#nav-side").html(userLofinInfoHtml);
        });
    },
    // 请求得到navigation数据
    loadNavigationInfo:function () {
        var navigationHtml = "";
        _indexService.getNavigation(function (res) {
            // 对传过来的数据进行排序
            var  temp;
            for(let  i=0; i<res.length;i++) {
                for (let j = i+1;j<res.length;j++){
                    if (res[i].id>res[j].id){
                        temp = res[i];
                        res[i] = res[j];
                        res[j] = temp;
                    }
                }
            }
            // 渲染数据
            navigationHtml = _mm.renderHtml(tempNavigation,{
                list:res
            });
            $("#keyword").html(navigationHtml);
        },function (error) {
            console.log(error);
        })
    }
};
$(function () {
    page.init();
    // 悬浮下拉
    $("body").delegate(".dropdown","mouseover",function () {
        $(this).addClass("open");
    });
    $("body").delegate(".dropdown","mouseout",function () {
        $(this).removeClass("open");
    });
});

