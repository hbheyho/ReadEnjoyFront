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
       //反馈类型下拉框选择
        $('.select ul li').on("click", function (e) {
            var _this = $(this);
            $('.select p').text(_this.attr('data-value'));
            $(_this).addClass('selected').siblings().removeClass('selected');
            // 修改文本框提示文字
            var feedbackType = $('.select p').text();
            var placeholder = $('.feed-content textarea').attr('placeholder');
            if (feedbackType === '请选择反馈类型') {
                layer.msg('请先选择反馈类型');
            } else if (feedbackType === '网站反馈') {
                $('.feed-content textarea').attr('placeholder','您对网站的建议 / 您发现的网站bug等等...')
                $('.feed-content textarea').attr("readonly",false)
            } else if (feedbackType === '书籍反馈') {
                $('.feed-content textarea').attr('placeholder','您发现了书籍的信息有误 / 网站没有您想要的书籍等等...')
                $('.feed-content textarea').attr("readonly",false)
            }
            $('.select').toggleClass('open');
            cancelBubble(e);
        });
        $('.select p').on("click", function (e) {
            $('.select').toggleClass('open');
            cancelBubble(e);
        });
        $(document).on('click', function () {
            $('.select').removeClass('open');
        });
        // 反馈提示
        $('.feed-content textarea').on('focus', function(){
            var feedbackType = $('.select p').text();
            if (feedbackType === '请选择反馈类型') {
                layer.msg('请先选择反馈类型');
                $('#feedback-submit').attr("disabled",true);
                $('.feed-content textarea').attr("readonly",true)
            } else {
                $('.feed-content textarea').attr("readonly",false)
                $('#feedback-submit').attr("disabled",false);
            }
        });
        // 点击取消时，清空表单
        $('#cancel').on('click', function(){
            clearContent();
        });
        // 关闭时时，清空表单
        $('#close').on('click', function(){
            clearContent();
        });
        // 反馈确认点击
        $("#feedback-submit").on("click",function () {
            var feedbackInfo = {
                feedbackName: $('.select p').text(),
                feedbackInfo:  $('.feed-content textarea').val()
            }
            _user.feedbackDo(feedbackInfo,function (data,msg) {
                layer.msg(msg);
                $('#myModal').modal('hide');
                clearContent();
            },function (errmsg) {
                layer.msg(errmsg);
                $('#myModal').modal('hide');
                clearContent();
            });
        });
        // 阻止冒泡
        function cancelBubble(event) {
            if (event.stopPropagation) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.returnValue = false;
                event.cancelBubble();
            }
        };
        function clearContent() {
            // 清空下拉框 反馈类型
            $('.select p').text('请选择反馈类型');
            // 清空输入框 反馈内容
            $('.feed-content textarea').val('');
            $('.feed-content textarea').attr("readonly",true);
            $('.feed-content textarea').attr("placeholder","请输入反馈内容...")
        }
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
            // 导航选中
            $(".navigation-btn").each(function () {
                var urlstr = location.href;
                if ((decodeURI(urlstr)).indexOf($(this).attr("href")) > -1 &&
                    $(this).attr("href") != "") {
                    $(this).css("color","#00A6DE");
                }
            });
        },function (error) {
            console.log(error);
        });

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

module.exports = page;

