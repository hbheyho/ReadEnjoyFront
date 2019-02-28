/**
 * @author HB
 * @date 2018/6/3
 * @fileName bookService.js
 * @Description:  书籍操作逻辑
*/
/*引用工具类*/
var _mm = require("util/mm");

var _bookService = {
    //加载书籍信息(通过下载数量)
    getBookListByDownNumber:function (resolve,reject) {
        _mm.request({
            url:_mm.getServerUrl("http://localhost:8080/book/get_book_downNumber.do"),
            method:"get",
            success:resolve,
            error:reject
        });
    },
    // 搜索书籍请求
    getSearchBookList: function (searchCondition,resolve,reject) {
        _mm.request({
            url: _mm.getServerUrl("http://localhost:8080/book/search.do"),
            data: searchCondition,
            method:"POST",
            success: resolve,
            error: reject
        });
    },
    // 加载书籍详细信息
    getBookDetail: function (bookIdCondition,resolve,reject) {
        _mm.request({
            url: _mm.getServerUrl("http://localhost:8080/book/detail.do"),
            data: bookIdCondition,
            method:"POST",
            success: resolve,
            error: reject
        });
    },
    // 书籍上传
    uploadBook: function (file,resolve,reject) {
        _mm.requestAboutFile({
           url:_mm.getServerUrl("http://localhost:8080/book/upload.do"),
           method:"POST",
           data:file,
           success: resolve,
           error: reject
        });
    },
    // 加载书籍版本信息
    getBookVersion: function (bookISBN,resolve,reject) {
        _mm.request({
           url:_mm.getServerUrl("http://localhost:8080/bookVersion/get_bookVersion_list.do"),
           data: bookISBN,
           method: "POST",
           success: resolve,
           error: reject
        });
    },
    // 收藏书籍版本信息
    collectBookVersion: function (bookVersionId,resolve,reject) {
        _mm.requestAboutSeeion({
           url: _mm.getServerUrl("http://localhost:8080/bookVersion/store_user_collection.do"),
           method: "POST",
           data: bookVersionId,
           success: resolve,
           error: reject
        });
    },
    // 分类list(平级获得)
    getCategoryList: function(categoryId,resolve,reject){
        _mm.request({
            url: _mm.getServerUrl("http://localhost:8080/category/get_parent_categoty.do"),
            method:"POST",
            data: {
                categoryId: categoryId
            },
            success: resolve,
            error: reject
        });
    },
    // 分类信息搜索
    getCategoryBookList: function (requestData,resolve,reject) {
        _mm.request({
           url: _mm.getServerUrl("http://localhost:8080/book/get_bookList_categoryId.do"),
            method:"POST",
            data: requestData,
            success: resolve,
            error: reject
        });
    }
};

module.exports = _bookService;