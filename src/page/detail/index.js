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
/*引用关联搜索模板*/
var tempRelatedSearach = require("./relatedSearch.string");
var page = {
    init:function () {
        /*用户信息加载*/
       this.loadUserInfo();
       /*加载书籍详细信息*/
       this.loadBookDetailInfo();
       /*书籍上传*/
       this.uploadBook();
       this.bindEvent();
    },
    bindEvent: function(){
       var _this = this;
       // 标签点击
       $("body").on("click","#writer-btn",function () {
          var conditonName = $("#writer-btn").text();
          _this.relatedSearchSubmit(conditonName);
       });
        $("body").on("click","#public-btn",function () {
            var conditonName = $("#public-btn").text();
            _this.relatedSearchSubmit(conditonName);
        });
       // 用户收藏
      $("body").on("click","#collect-btn",function () {
           var _this = this;
           // 读取需要录入的书籍版本信息
            var bookVersionId = $(_this).find(".hidden-id").text();
            // 书籍收藏操作
            _bookService.collectBookVersion({
              bookVersionId: bookVersionId
          },function (data,res) {
                layer.msg(res);
                $(_this).children(".fa-star").text("已收藏");
          },function (errMsg) {
                layer.msg(errMsg);
          });
      });
      // 用户举报
      $("body").on("click","#report",function () {
          // 得到版本Id
          var bookVersionId = $(this).parent(".book-version").next(".version-btn-group").find(".hidden-id").text();
         _this.reportBookVersion(bookVersionId);
      });
      // 删除评论
      $("body").on("click",".delete-comment",function () {
          var _this = this;
          // 得到当前commentsId
          var commentsId =  $(_this).next("#hidden-commentId").text();
          _user.deleteUserComments(commentsId,function (data,msg) {
              layer.msg(msg);
              // js移除元素
              var num= $(_this).parents(".mt-10").siblings(".bbpl-a").text().replace(/[^0-9]/ig,"");
              $(_this).parents(".mt-10").siblings(".bbpl-a").text("共" + (parseInt(num)-1).toString() + "条评论");
              $(_this).parents(".mt-10").remove();

          },function (errMsg) {
              layer.msg(errMsg);
          })
      });
    },
    // 关联搜索提交
    relatedSearchSubmit:function(conditionName){
        var searchHtml = "";
        // 搜索数据(前台传过去的需要是json数据)
        var searchCondition = {
            conditionName:conditionName
        };
        if (conditionName == ""){
            alert("参数错误");
            return;
        };
        _bookService.getSearchBookList(searchCondition,function (res) {
            console.log(res);
            searchHtml = _mm.renderHtml(tempRelatedSearach,{
                SearchbookList:res,
                searchLength:res.length,
                conditionName: conditionName
            });
            $("#index-content").html(searchHtml);
        },function (error) {
            console.log(error);
        });
    },
    //加载书籍版本的收藏情况
    loadCollectionStatus: function(){
        // 加载当前用户的收藏情况 比较在此书中用户是否有收藏
        _user.getUserCollectNotPage(function (data) {
            for (var i = 0; i < data.length; i++ ){
                $(".hidden-id").each(function () {
                    if (data[i].userCollectionList[0].bookVersionId == $(this).text()){
                       $(this).prev(".fa-star").text("已收藏");

                       /* $(this).parent(".btn-success").click(function () {
                            alert(22)
                        });*/
                    }
                });
            }
        });
    },
    // 加载用户信息
    loadUserInfo:function() {
        var _this = this;
        _user.checkLogin(function (data) {
            if (data != undefined) {
                _this.userName = data.username;
                // 用户评论 登录之后才能评论
                _this.commentVersion();
            }
        }, function () {
            // 下载的登录判断
            $("body").on("click","#downLoad-book",function () {
                if (_this.userName == undefined){
                    alert("想下载？请登录哦");
                    _mm.doLogin();
                    return false;
                }
            });
            // 评论登录判断
            $("body").on("click", ".commmentBt", function () {
                if (_this.userName == undefined){
                    alert("想评论？请登录哦");
                    _mm.doLogin();
                    return false;
                }
            });
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
         var _this = this;
         var bookVersionHtml = "";
        _bookService.getBookVersion({
               bookISBN:  bookIsbn
          }, function (data, msg) {
               bookVersionHtml = _mm.renderHtml(tempBookVersion,{
                   bookVersionList: data,
                   versionNumber : data.length,
                   bookIsbn: bookIsbn,
                   versionComments: data.versionComments
               });
               $(".version").html(bookVersionHtml);
              //加载书籍版本的收藏情况
              _this.loadCollectionStatus();
              // 加载用户的评论情况
              _this.loadUserCommentsStatus();
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
    },
    // 版本评论操作
    commentVersion: function (e) {
                // 得到要评论书籍的ISBN号
                var bookISBN = _mm.getUrlParam("bookISBN") || "";
                $("body").on("click", ".commmentBt", function () {
                // 得到要评论书籍的版本号
                var bookVersionId = $(this).find(".hidden-id2").text();
                // 得到评论信息
                var comentInfo = $.trim($(this).prev().val());
                if (comentInfo == ""){
                    layer.msg("评论内容不能为空!");
                    return;
                }
                let aboutComment = {
                    commentInfo: comentInfo,
                    bookISBN: bookISBN,
                    bookVersion: bookVersionId
                }
                _user.userComment(aboutComment,function (data,msg) {
                    layer.msg(msg);
                    window.location.reload();
                },function (error) {
                    layer.msg(error)
                })
            });
    },
    //加载当前用户对此书籍的评论情况
    loadUserCommentsStatus: function(){
        // 加载当前用户的评论情况 比较在此书中用户是否有评论
        _user.getUserComments(function (data) {
            for (var i = 0; i < data.length; i++){
                   $(".delete-comment").each(function () {
                       if ($(this).next("#hidden-commentId").text() == data[i].cid){
                           $(this).attr("hidden",false);
                       }
                   });
            }
        });
    },
    // 举报书籍版本
    reportBookVersion: function (bookVersionId) {
        // 举报 成功提示
        $('.magic-radio').bind('click',function(){
            if (true) {
                var reason = $("input[name='radio']:checked").val();
                var listParam = {
                    bookVersionId: bookVersionId,
                    reason: reason
                }
                $('#confirm').attr("disabled",false);
                $('#confirm').on('click', function(){
                    _user.reportBookVersion(listParam,function (data,msg) {
                        $('#reportModal').modal('hide');
                        layer.msg(msg);
                    },function (errMsg) {
                        layer.msg(errMsg);
                    });
                });
            }
        });
    }
};
$(function () {
    page.init();
    //我也要评论
   $("body").on("click",".getComment",function () {
       $(this).parent().next().show();
   });
})