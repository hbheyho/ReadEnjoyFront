/**
 * @author HB
 * @date 2018/6/9
 * @fileName index.js
 * @Description: 个人中心的js
*/
/*导入自身的css*/
require("./index.css");
/*引用工具类 _mm*/
var _mm = require("util/mm");
/*引入页面userService*/
var _user = require("service/userService");
/*引入navigation*/
require("../common/navigation/index");
// 修改头像插件
require("util/HeadportraitUpload");
require("util/HeadportraitUpload.css");
/*引入用户信息模板*/
var tempUserInfo = require("./userInfo.string");
/*引入修改密码模板*/
var tempModifyPass = require("./modifyPassword.string");
/*引入用户内容模板*/
var tempUserContent = require("./userContent.string");
/*引入没有数据模板*/
var tempNoData = require("./noData.string");
/*引入修改头像模板*/
var tempModifyPic = require("./modifyUserPic.string");
/*引入分页组件*/
var Pagination = require("util/pagination/index.js");
var page = {
    // 规定分页页数以及分页大小
    data: {
        listParam: {
            pageNum:  1,
            pageSize:  9,
        }
    },
    init: function () {
         var imgUrl = "";
         this.bindEvent();
         // 加载用户信息
         this.loadUserInfo();
         // 加载修改密码模块
         this.loadModifyPassword();
         // 加载我的收藏模块
         this.loadUserCollect();
         // 加载我的下载模块
         this.loadUserDownload();
         // 加载我的上传模块
         this.loadUserUpload();
    },
    bindEvent: function () {
        // 密码验证
        this.validFrom();
        // 更新用户信息
        this.updateUserInfo();
        // 修改用户密码
        this.updatePassword();
        // 上传用户头像
        this.updateHeadPic();
    },
    // 加载用户信息
    loadUserInfo: function () {
        var _this = this;
        var userInfoHtml = "";
        _user.getUserInfo(function (data) {
            userInfoHtml = _mm.renderHtml(tempUserInfo, {
                    userInfo: data
                });
                _this.imgUrl = data.imageHost + data.headpic;
                $("#user-content").html(userInfoHtml);
                $("body").on("click","#userInfo-btn",function () {
                    $("#user-content").html(userInfoHtml);
                });
              // 加载用户头像
            var headside = "<img src=\"{{imgUrl}}\" class=\"user-heder-img img-circle\" alt=\"头像\"> " +
                " <p class=\"user-name\">{{userName}}</p>";
            // 加载用户名
            headside = _mm.renderHtml(headside,{
                imgUrl:_this.imgUrl,
                userName: data.username
            });
            $(".user-heder").html(headside);
        },function () {
            _mm.errorTips("用户信息加载失败！");
        });
    },
    // 加载修改密码模块
    loadModifyPassword: function(){
        var modifyPassHtml = "";
       $("#modify-password-btn").on("click",function () {
            modifyPassHtml = _mm.renderHtml(tempModifyPass);
           $("#user-content").html(modifyPassHtml);
       });
    },
    // 加载我的收藏模块
    loadUserCollect: function(){
        var _this = this,
            noDataHtml = "",
            listParam  = this.data.listParam,
            title = "收藏记录",
            text = "收藏";
        $("body").on("click","#user-collect-btn",function () {
            // pageNum重置为1
            listParam.pageNum = 1;
            _user.getUserCollect(listParam,function (data) {
                // 不存在数据时
                if (data.list.length == 0){
                    noDataHtml = _mm.renderHtml(tempNoData,{
                        title:title,
                        text: text
                    });
                    $("#user-content").html(noDataHtml);
                }else {
                     // 数据不为空，加载用户的信息(收藏，上传，下载)
                     _this.loadUserOpretionInfo(title,text);
                }
            },function (errMsg) {
                layer.msg(errMsg);
            });
        });
    },
    // 加载用户下载模块
    loadUserDownload: function(){
        var _this = this,
            noDataHtml = "",
            listParam  = this.data.listParam,
            title = "下载记录",
            text = "下载";
        $("body").on("click","#user-download-btn",function () {
            // pageNum重置为1
            listParam.pageNum = 1;
            _user.getUserDownload(listParam,function (data) {
                if (data.list.length == 0){
                    noDataHtml = _mm.renderHtml(tempNoData,{
                        title:title,
                        text:text
                    });
                    $("#user-content").html(noDataHtml);
                }else {
                    // 数据不为空，加载用户的信息(收藏，上传，下载)
                    _this.loadUserOpretionInfo(title,text);
                }
            },function (errMsg) {
                layer.msg(errMsg);
            });
        });
    },
    // 加载我的上传模块
    loadUserUpload: function(){
        var _this = this,
            noDataHtml = "",
            listParam  = this.data.listParam,
            title = "上传记录",
            text = "上传";
    $("body").on("click","#user-upload-btn",function () {
        // pageNum重置为1
        listParam.pageNum = 1;
        _user.getUserUpload(listParam,function (data) {
            if (data.list.length == 0){
                noDataHtml = _mm.renderHtml(tempNoData,{
                    title: title,
                    text: text
                });
                $("#user-content").html(noDataHtml);
            }else {
                // 数据不为空，加载用户的信息(收藏，上传，下载)
                _this.loadUserOpretionInfo(title,text);
            }
        },function (errMsg) {
            layer.msg(errMsg);
        });
    });
    },
    // 加载用户的操作信息(收藏，上传，下载)
    loadUserOpretionInfo: function(title,text){
        var _this = this,
            userContentHtml = "",
            listParam  = this.data.listParam;
        if (text === "收藏") {
            _user.getUserCollect(listParam, function (data) {
                userContentHtml = _mm.renderHtml(tempUserContent, {
                    userContent: data.list,
                    title: title,
                    text: text
                });
                $("#user-content").html(userContentHtml);
                // 加载分页
                _this.loadPagination({
                    hasPreviousPage: data.hasPreviousPage,  // 是否有前一页
                    hasNextPage: data.hasNextPage,  // 是否有下一页
                    prePage: data.prePage,  // 前一页是多少
                    nextPage: data.nextPage,  // 下一页是多少
                    pageNum: data.pageNum,  // 当前第几页
                    pages: data.pages // 一共多少页
                }, title, text);
            }, function (errMsg) {
                layer.msg(errMsg);
            });
        }else if (text === "下载"){
            _user.getUserDownload(listParam,function (data) {
                userContentHtml = _mm.renderHtml(tempUserContent, {
                    userContent: data.list,
                    title: title,
                    text: text
                });
                $("#user-content").html(userContentHtml);
                // 加载分页
                _this.loadPagination({
                    hasPreviousPage : data.hasPreviousPage,  // 是否有前一页
                    hasNextPage     : data.hasNextPage,  // 是否有下一页
                    prePage         : data.prePage,  // 前一页是多少
                    nextPage        : data.nextPage,  // 下一页是多少
                    pageNum         : data.pageNum,  // 当前第几页
                    pages           : data.pages // 一共多少页
                },title,text);
            },function (errMsg) {
                layer.msg(errMsg);
            });
        } else{
            _user.getUserUpload(listParam,function (data) {
                userContentHtml = _mm.renderHtml(tempUserContent, {
                    userContent: data.list,
                    title: title,
                    text: text
                });
                $("#user-content").html(userContentHtml);
                // 加载分页
                _this.loadPagination({
                    hasPreviousPage : data.hasPreviousPage,  // 是否有前一页
                    hasNextPage     : data.hasNextPage,  // 是否有下一页
                    prePage         : data.prePage,  // 前一页是多少
                    nextPage        : data.nextPage,  // 下一页是多少
                    pageNum         : data.pageNum,  // 当前第几页
                    pages           : data.pages // 一共多少页
                },title,text);
            },function (errMsg) {
                layer.msg(errMsg);
            });
        }
    },
    // 加载分页
    loadPagination: function (pageInfo,title,text) {
    var _this = this;
    // 初始化组件
    this.pagination ? '' : (this.pagination = new Pagination());
    this.pagination.render($.extend({},pageInfo,{
        container:$(".pagination"),  // container jQuery容器
        // 用户选择之后的加载
        onSelectPage: function (pageNum) {
            // 对当前页数进行修改 (点击操作)
            _this.data.listParam.pageNum = pageNum;
            _this.loadUserOpretionInfo(title,text);
        }
    }))
    },
    // 更新用户信息
    updateUserInfo: function(){
        $("body").on("click","#userInfo-save",function () {
            var userName = $("#userName").val();
            var signs = $("#signs").val();
            var gender = $("input[name='sex']:checked").val();
            userInfo = {
              username: userName,
              gender: gender,
              signs: signs
            };
            _user.updateUserInfo(userInfo,function (data,res) {
                layer.msg(res);
                setTimeout(function () {
                    window.location.reload();
                },1000)
            },function (errMsg) {
                layer.msg(errMsg);
            });
        });
    },
    // 密码更新
    updatePassword: function () {
        $("body").on("keyup","#passwordConfirm" ,function () {
            var passwordOld = $("#passwordOld").val();
            var passwordNew = $("#passwordNew").val();
            var passwordConfirm = $("#passwordConfirm").val();
            userInfo = {
                passwordOld: passwordOld,
                passwordNew: passwordNew
            };
            if(passwordNew == passwordConfirm) {
                $("#tips").html("<font color='gray'>输入正确</font>");
                $("#password-update").removeAttr("disabled");
                $("body").on("click","#password-update",function () {
                    _user.updatePassword(userInfo,function (data,res) {
                        layer.msg(res);
                        setTimeout(function () {
                            window.location.reload();
                        },1000)
                    },function (errMsg) {
                        layer.msg(errMsg);
                    });
                });
            }else {
                $("#tips").html("<font color='red'>两次密码不相同噢</font>");
                $("#password-update").attr("disabled",true);
            }
        });
    },
    // 更新用户头像
    updateHeadPic: function(){
         var _this = this;
         var modifyUserPicHtml = "";
        $("#modify-head-btn").on("click",function () {
              // 修改头像渲染
              modifyUserPicHtml = _mm.renderHtml(tempModifyPic,{
                  userPic: _this.imgUrl
              });
              $("#user-content").html(modifyUserPicHtml);
              // 文件上传操作
              _this.validImg();
          });
    },
    // 用户头像格式以及大小验证
    validImg: function(){
        $("body").on("click","#upload-btn",function () {
            var upload_img = $("#upload-img").prop("files")[0];
            if (upload_img == undefined){
                layer.msg("你还没选择要修改的头像哦");
                //
                return;
            }else{
                var formData = new FormData();
                formData.append("upload_img",upload_img);
                _user.uploadImg(formData,function (data,res) {
                    layer.msg(res);
                    setTimeout(function () {
                        window.location.reload();
                    },1000)
                },function (errMsg) {
                    layer.msg(errMsg);
                });
            }
        });
    },
    // 验证密码格式
    validFrom: function () {
        $("body").on("keyup","#passwordNew",function () {
            var passwordNew = $("#passwordNew").val();
            if (!_mm.validate(passwordNew,"password")){
                $("#tips").html("<font color='red'>密码格式错误哦</font>");
            }else {
                $("#tips").html("");
            }
        });
    }
};
$(function () {
   page.init();
    // tab 转换
    $(".slider-ul li").click(function(){
        $(this).addClass('tab-active').siblings().removeClass('tab-active');
    });
});
