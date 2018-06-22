/**
 * @author HB
 * @date 2018/6/3
 * @fileName index.js
 * @Description:  书籍详情页js
*/
"use strict";
/*引入detail css*/
require("./index.css");

/*引用navigation模块*/
require("../common/navigation/index.js");
/*引入footer模块*/
require("../common/footer/index");
/*引用工具类*/
var _mm = require("util/mm");
/*引用bookService*/
var _bookService = require("service/bookService");
/*引入页面userService*/
var _user = require("service/userService");
/*引用bookDetail模板引擎*/
var tempBookDetail = require("./bookDetail.string");
/*引用bookDetail模板引擎*/
var tempBookVersion = require("./bookVersion.string");
var page = {
    init:function () {
       var bookIsbn = null;
       // 用于判断用户是否登录
       var userName = null;
       this.loadUserInfo();
       this.loadBookDetailInfo();
       this.uploadBook();
       this.bindEvent();
    },
    bindEvent: function(){
        var _this = this;
       // 用户收藏
      $("body").on("click","#collect-btn",function () {
           // 读取需要录入的书籍版本信息
            var bookVersionId = $(this).find(".hidden-id").text();
           _this.collectBookVersion(bookVersionId);
      });
    },
    // 用户收藏版本信息
    collectBookVersion: function(bookVersionId){
         _bookService.collectBookVersion({
             bookVersionId: bookVersionId
         },function (data,res) {
             layer.msg(res);

         },function (errMsg) {
             alert(errMsg);
             _mm.doLogin();
         });
    },
    // 加载用户信息
    loadUserInfo:function() {
        var _this = this;
        _user.checkLogin(function (data) {
               if (data != undefined) {
                   _this.userName = data.username;
                   console.log(_this.userName);
               }
               // 下载的登录判断
            $("body").on("click","#downLoad-book",function () {
                if (_this.userName == undefined){
                    alert("想下载？请登录哦");
                    _mm.doLogin();
                    return false;
                }
            });
        }, function () {
            _mm.errorTips("用户信息加载失败！");
        });
    },
    /*加载当前书籍的详细信息*/
    loadBookDetailInfo:function () {
        var _this = this;
        var bookISBN = _mm.getUrlParam("bookISBN") || "";
        var bookDetailHtml = "";
        var searchCondition = {
            bookISBN: bookISBN
        };
        _bookService.getBookDetail(searchCondition,function (data) {
            bookDetailHtml = _mm.renderHtml(tempBookDetail,{
                BookDetail: data
            });
            $("#bookDetail-content").html(bookDetailHtml);
            // 当前bookISBN
            _this.bookIsbn = data.bookIsbn;
            // 加载书籍版本信息
            _this.loadBookVersionInfo(data.bookIsbn);
            /*引入社会化分享插件（为了读取书籍信息 放在动态添加之后）*/
            require("node_modules/social-share.js/dist/css/share.min.css");
            require("node_modules/social-share.js/dist/js/social-share.min");
        },function (errMsg) {
            console.log(errMsg);
        });
    },
    // 加载书籍版本信息
    loadBookVersionInfo: function(bookIsbn){
         var bookVersionHtml = "";
        _bookService.getBookVersion({
               bookISBN:  bookIsbn
          }, function (data, msg) {
               bookVersionHtml = _mm.renderHtml(tempBookVersion,{
                   bookVersionList: data,
                   versionNumber : data.length
               });
               $(".version").html(bookVersionHtml);
          }, function (errMsg) {
               console.log(errMsg);
          });
    },
    // 文件上传操作
    uploadBook: function () {
         var _this = this;
        $("body").on("click","#upload-btn",function () {
            if (_this.userName == undefined){
                _mm.errorTips("请登录之后再进行相应的操作！");
                _mm.doLogin();
            } else {
                // 获取上传的内容
                $(".input-fileup").on("change","input[type='file']",function(){
                    var filePath=$(this).val();
                    if(filePath.indexOf("pdf")!=-1 || filePath.indexOf("txt")!=-1 || filePath.indexOf("doc")!=-1 ||
                        filePath.indexOf("epub")!=-1 || filePath.indexOf("mobi")!=-1 || filePath.indexOf("docx")!=-1){
                        // 得到需要上传的文件
                        var upload_file = $("#upload-file").prop("files")[0];
                        // 判断上传文件的大小
                        var fileSize = $("#upload-file").prop("files")[0].size / 1024;
                        if (fileSize < 10240) {
                            $(".fileerrorTip1").html("").hide();
                            // 找到上传文件的文件名
                            var arr=filePath.split('\\');
                            var fileName=arr[arr.length-1];
                            $(".showFileName1").html(fileName);
                            $('#confirm-upload').attr("disabled",false);
                            // 当前上传的文件的ISBN
                            var bookIsbn = _this.bookIsbn;
                            var formData = new FormData();
                            formData.append("bookISBN",bookIsbn);
                            formData.append("upload_file",upload_file);
                            // 文件上传操作
                            $('#confirm-upload').on('click', function(){
                                _bookService.uploadBook(formData, function (data, msg) {
                                    $('#uploadModal').modal('hide');
                                    layer.msg(msg);
                                    window.location.reload();
                                }, function (errorMsg) {
                                    // 后台对文件大小 以及文件类型的验证
                                    $(".showFileName1").html("");
                                    $(".fileerrorTip1").html(errorMsg).show();
                                    $('#confirm-upload').attr("disabled", true);
                                });
                            });
                        }else{
                            $(".showFileName1").html("");
                            $(".fileerrorTip1").html("你上次的文件有点大哦！").show();
                            $('#confirm-upload').attr("disabled",true);
                            return false
                        }
                    }else{
                        $(".showFileName1").html("");
                        $(".fileerrorTip1").html("你上次的好像不是文档哦！").show();
                        $('#confirm-upload').attr("disabled",true);
                        return false
                    }
                });
            }
        });
    }

};
$(function () {
    page.init();


    // 点击一次 收藏+1 再次点击 收藏-1
    var flag = true;
    function collect(){
        var cs = document.getElementById("collectState");
        var cn=document.getElementById("collectNum");
        if (flag == true) {
            flag = false;
            cs.innerText = "已收藏";
            cn.innerHTML=parseInt(cn.innerHTML)+1;
            layer.msg('收藏书籍成功');
        }else{
            flag = true;
            cs.innerText = "收藏";
            cn.innerHTML=parseInt(cn.innerHTML)-1;
            layer.msg('您已成功取消收藏该书籍');
        }

    }

    // 举报 成功提示
    $('.magic-radio').bind('click',function(){
        if (true) {
            $('#confirm').attr("disabled",false);

            $('#confirm').on('click', function(){
                $('#myModal').modal('hide');
                layer.msg('举报成功');
            });
        }
    });

    // 点赞
    $(document).ready(function(){

        $('body').on("click",'.heart',function(){
            var A=$(this).attr("id");
            var B=A.split("like");
            var messageID=B[1];
            var C=parseInt($("#likeCount"+messageID).html());
            $(this).css("background-position","")
            var D=$(this).attr("rel");

            if(D === 'like') {
                $("#likeCount"+messageID).html(C+1);
                $(this).addClass("heartAnimation").attr("rel","unlike");
            }else{
                $("#likeCount"+messageID).html(C-1);
                $(this).removeClass("heartAnimation").attr("rel","like");
                $(this).css("background-position","left");
            }
        });
    });

})