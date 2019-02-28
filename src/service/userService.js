/**
* 2018-05-16 09:01:06
* 作者:HB
* 文件名:userService.js
* 描述:  用户登录逻辑
*/
/*引用工具类*/
var _mm = require("util/mm");
var _user = {
    /*用户登录*/
    login:function (userInfo,resolve,reject) {
        _mm.requestAboutSeeion({
           url : _mm.getServerUrl("http://localhost:8080/user/login.do"),
           data: userInfo,
           method: "post",
           success: resolve,
           error: reject
        });
    },
    /*检查用户名*/
    checkUsername:function (username,resolve,reject) {
      _mm.request({
          url: _mm.getServerUrl("http://localhost:8080/user/check_valid.do"),
          data: {
              type: "username",
              str: username
          },
          method: "post",
          success: resolve,
          error: reject
      })
    },
    /*检查email*/
    checkEmail:function (email,resolve,reject) {
        _mm.request({
            url: _mm.getServerUrl("http://localhost:8080/user/check_valid.do"),
            data: {
                type: "email",
                str: email
            },
            method: "post",
            success: resolve,
            error: reject
        })
    },
    /*用户注册*/
    register:function (userInfo,resolve,reject) {
      _mm.request({
          url: _mm.getServerUrl("http://localhost:8080/user/register.do"),
          data: userInfo,
          method: "post",
          success: resolve,
          error: reject
      })
    },
    // 检查登录状态
    checkLogin : function(resolve, reject){
        _mm.requestAboutSeeion({
            url     : _mm.getServerUrl("http://localhost:8080/user/get_user_info.do"),
            method  : 'post',
            success : resolve,
            error   : reject
        });
    },
    /*获取用户密码提示问题*/
    getQuestion:function (email,resolve,reject) {
        _mm.request({
           url: _mm.getServerUrl("http://localhost:8080/user/forget_get_question.do"),
           data: {
               email: email
           },
           method: "post",
           success: resolve,
           error : reject
        });
    },
    /*检查密码提示问题答案*/
    checkAnswer:function (userInfo,resolve,reject) {
        _mm.request({
           url: _mm.getServerUrl("http://localhost:8080/user/forget_check_answer.do"),
           data: userInfo,
           method: "post",
           success: resolve,
           error: reject
        });
    },
    /*重置密码*/
    resetPassword: function (userInfo,resolve,reject) {
        _mm.request({
            url: _mm.getServerUrl("http://localhost:8080/user/forget_reset_password.do"),
            data: userInfo,
            method: "post",
            success: resolve,
            error: reject
        });
    },
    /*得到用户信息*/
    getUserInfo : function (resolve,reject) {
        _mm.requestAboutSeeion({
           url: _mm.getServerUrl("http://localhost:8080/user/get_information.do"),
           method: "post",
           success: resolve,
           error: reject
        });
    },
    /*更新用户信息*/
    updateUserInfo : function (userInfo,resolve,reject) {
        _mm.requestAboutSeeion({
           url: _mm.getServerUrl("http://localhost:8080/user/update_information.do"),
           data: userInfo,
           method: "post",
           success: resolve,
           error: reject
        });
    },
    /*登录状态下 修改密码*/
    updatePassword : function (userInfo,resolve,reject) {
        _mm.requestAboutSeeion({
           url: _mm.getServerUrl("http://localhost:8080/user/reset_password.do"),
           data: userInfo,
           method: "post",
           success: resolve,
           error: reject
        });
    },
    /*退出登录*/
    logout : function (reslove,reject) {
        _mm.requestAboutSeeion({
            url: _mm.getServerUrl("http://localhost:8080/user/logout.do"),
            method: "post",
            success: reslove,
            error: reject
        });
    },
    /*加载用户收藏书籍信息 --- 1 分类*/
    getUserCollect : function (listParam,reslove,reject) {
        _mm.requestAboutSeeion({
            url: _mm.getServerUrl("http://localhost:8080/bookVersion/get_user_collection.do"),
            method: "post",
            data: listParam,
            success: reslove,
            error: reject
        });
    },
    /*加载用户收藏书籍信息 ---- 2 不分类*/
    getUserCollectNotPage : function (resolve,reject) {
        _mm.requestAboutSeeion({
            url: _mm.getServerUrl("http://localhost:8080/bookVersion/get_user_collection_notPage.do"),
            method: "post",
            success: resolve,
            error: reject
        });
    },
    // *加载用户下载书籍信息*/
    getUserDownload : function (listParam,resolve,reject) {
    _mm.requestAboutSeeion({
        url: _mm.getServerUrl("http://localhost:8080/bookVersion/get_user_download.do"),
        method: "post",
        data: listParam,
        success: resolve,
        error: reject
    });
    },
    // *加载用户上传书籍信息*/
    getUserUpload : function (listParam,resolve,reject) {
        _mm.requestAboutSeeion({
            url: _mm.getServerUrl("http://localhost:8080/bookVersion/get_user_upload.do"),
            method: "post",
            data: listParam,
            success: resolve,
            error: reject
        });
    },
    // 用户头像上传
    uploadImg: function (file,resolve,reject) {
        _mm.requestAboutFile({
            url:_mm.getServerUrl("http://localhost:8080/user/upload_img.do"),
            method:"POST",
            data:file,
            success: resolve,
            error: reject
        });
    },
    //用户版本评论
    userComment: function (comment,resolve,reject) {
        _mm.requestAboutSeeion({
            url:_mm.getServerUrl("http://localhost:8080/bookVersion/inset_version_comments.do"),
            method: "POST",
            data: comment,
            success: resolve,
            error: reject
        })
    },
    // 得到当前用户评论
    getUserComments: function (resolve,reject) {
        _mm.requestAboutSeeion({
            url: _mm.getServerUrl("http://localhost:8080/user/get_User_AllComments.do"),
            method: "POST",
            success: resolve,
            error: reject
        })
    },
    // 删除用户评论
    deleteUserComments: function (commentId,resolve,reject) {
        _mm.requestAboutSeeion({
            url: _mm.getServerUrl("http://localhost:8080/user/delete_User_Comments.do"),
            method: "POST",
            data: {
                commentId: commentId
            },
            success: resolve,
            error: reject
        })
    },
    //用户邮件发送
    sendEmail: function (email,code,resolve,reject) {
        _mm.request({
            url:_mm.getServerUrl("http://localhost:8080/user/validateEmail.do"),
            method: "POST",
            data: {
                email: email,
                code: code
            },
            success: resolve,
            error: reject
        })
    },
    // Token验证
    validateToken: function (AboutToken,resolve,reject) {
        _mm.request({
            url: _mm.getServerUrl("http://localhost:8080/user/validateEmailByToken.do"),
            method: "POST",
            data: {
                email: AboutToken[1],
                Token: AboutToken[0]
            },
            success: resolve,
            error: reject
        })
    },
    // 用户状态检查  ---email
    getUserStatus: function (email, resolve,reject) {
        _mm.request({
            url: _mm.getServerUrl("http://localhost:8080/user/getUserStatus.do"),
            method: "POST",
            data: {
                email: email
            },
            success: resolve,
            error: reject
        })
    },
    // 用户书籍版本举报
    reportBookVersion: function (listParam, resolve,reject) {
        _mm.requestAboutSeeion({
            url: _mm.getServerUrl("http://localhost:8080/bookVersion/report_version.do"),
            method: "POST",
            data: listParam,
            success: resolve,
            error: reject
        })
    },
    // 用户反馈
    feedbackDo: function (feedbackInfo,resolve,reject) {
        _mm.requestAboutSeeion({
            url: _mm.getServerUrl("http://localhost:8080/user/user_feedback.do"),
            method: "POST",
            data: feedbackInfo,
            success: resolve,
            error: reject
        });
    }
}
module.exports = _user;
