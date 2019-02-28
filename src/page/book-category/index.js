/**
 * @author HB
 * @date 2019/1/25 
 * @fileName index.js
 * @Description:  书籍分类js
*/
/*引用自身css*/
require("./index.css");
/*引入navigation*/
require("../common/navigation/index");
/*引入footer模块*/
require("../common/footer/index");
/*引入lazy load*/
require("util/jquery.lazyload.min");
/*引入分页组件*/
var Pagination = require("util/pagination/index.js");
/*引用工具类*/
var _mm = require("util/mm");
/*引用bookService*/
var _book = require("service/bookService");
/*分类列表模板*/
var tempCategoryList = require("./categoryList.string");
/*子分类列表模板*/
var tempSubCategoryList = require("./subCategoryList.string");
/*加载书籍列表模板*/
var tempBookList = require("./bookInfoList.string");
/*加载数据为空模板*/
var tempNoData = require("./noData.string");
var page = {
    // 规定分页页数以及分页大小
    data: {
        listParam: {
            pageNum:  1,
            pageSize: 4,
            pageNum: 1
        }
    },
    // 分类信息
    categoryInfo: {
      categoryId: "",
      title: "",
      status: ""
    },
    init: function () {
        var _this = this;
        // 得到categoryInfo
        var categoryInfo = _mm.getUrlParam("categoryInfo");
        var cateroryArr = new  Array();
        if (categoryInfo != null){
            cateroryArr = categoryInfo.split("-");
            _this.categoryInfo.categoryId = cateroryArr[0];
            _this.categoryInfo.title = cateroryArr[1]
            _this.categoryInfo.status = cateroryArr[2]
        }
        this.bindEvent();
        // 加载分类条目
        if (cateroryArr[2] != 2){
            this.loadCategoryList();
        }else {
            $(".sort").attr("hidden",true);
            $("#book-box").css("margin-top","80px");
        }
       // 加载分类书籍信息
       this.loadCategoryBookList(cateroryArr[0],cateroryArr[1]);
    },
    bindEvent: function(){
            var _this = this;
            // 类别点击
           $("body").on("click",".sorts-content li",function () {
               // 或前面有分页导航 移除
               $(".pagination").hide();
               _this.data.listParam.pageNum = 1;
               //把之前已有的active去掉
               $('.sorts-active').removeClass('sorts-active');
               $(this).siblings('li').removeClass('sorts-active'); // 删除其兄弟元素的样式
               $(this).addClass('sorts-active'); // 为点击元素添加类名
               var id = $(this).children(".hidden-id").text(); //得到categoryId
               var title = $(this).children(".label-a").text();  // 得到title名
               _this.loadSubCategoryList(id,title);
           });
            // 标签点击
            $("body").on("click",".label-content li",function(){
                // 或前面有分页导航 移除
                $(".pagination").hide();
                _this.data.listParam.pageNum = 1;
                //把之前已有的active去掉
                $('.label-active').removeClass('label-active');
                $(this).siblings('li').removeClass('label-active'); // 删除其兄弟元素的样式
                $(this).addClass('label-active'); // 为点击元素添加类名
                var id = $(this).children(".hidden-id").text(); //得到categoryId
                var title = $(this).children(".label-a").text();  // 得到title名
                _this.loadCategoryBookList(id,title);
            });
    },
    // 加载分类条目信息
    loadCategoryList: function(){
        var _this = this;
        var categoryId = _this.categoryInfo.categoryId;
        // 子分类隐藏
        $("#label-box").attr("hidden",true);
        $(".sort-label").css("min-height","80px");
        var categoriesHTML = "";
        _book.getCategoryList(categoryId,function (data) {
            categoriesHTML = _mm.renderHtml(tempCategoryList,{
                categoryList: data
            });
            $("#category-box").html(categoriesHTML);
        },function (errMsg) {
            layer.msg(errMsg);
        });
    },
    // 加载子分类信息
    loadSubCategoryList: function(id,title){
        var _this = this;
        if (title.indexOf("全部") == 0){
            $("#label-box").attr("hidden",true);
            $(".sort-label").css("min-height","80px");
            _this.loadCategoryBookList(id,title);
        }else {
            // 得到当前id的子分类
            var subCategoriesHTML = "";
            _book.getCategoryList(id,function (data) {
                subCategoriesHTML = _mm.renderHtml(tempSubCategoryList,{
                    subCategoryList: data,
                    parentCategory: id
                });
                $("#label-box").html(subCategoriesHTML);
                $("#label-box").attr("hidden",false);
                // 加载对应分类所拥有书籍
                _this.loadCategoryBookList(id,title);
            },function (errMsg) {
                if (_this.categoryInfo.status == 0){
                    layer.msg(errMsg);
                }
                _this.loadCategoryBookList(id,title);
                $("#label-box").html("");
            })
        }

    },
    // 加载分类书籍信息
    loadCategoryBookList: function (categoryId,title) {
      var _this = this;
      var title = title;
      var requestDate = {
          categoryId: categoryId,
          pageSize: _this.data.listParam.pageSize,
          pageNum: _this.data.listParam.pageNum
      }
      _book.getCategoryBookList(requestDate,function (data) {
          // 当前分类无数据
          if (data.list.length == 0) {
              var noDataHtml = _mm.renderHtml(tempNoData,{
                  title:title
              });
              $("#book-box").html(noDataHtml);
          }else {
              // 分类有数据
              var bookListHtml = _mm.renderHtml(tempBookList,{
                  bookList: data.list,
                  title: title
              });
              $("#book-box").html(bookListHtml);
              // 进行懒加载
              $(".lozad").lazyload({
                  placeholder : "images/loading.gif",
                  effect: "fadeIn",
                  // 参数:threshold,值为数字,代表页面高度.如设置为200,表示滚动条在离目标位置还有50的高度时就开始加载图片,可以做到不让用户察觉.
                  threshold: 50
              });
              // 加载分页
              _this.loadPagination({
                  hasPreviousPage : data.hasPreviousPage,  // 是否有前一页
                  hasNextPage     : data.hasNextPage,  // 是否有下一页
                  prePage         : data.prePage,  // 前一页是多少
                  nextPage        : data.nextPage,  // 下一页是多少
                  pageNum         : data.pageNum,  // 当前第几页
                  pages           : data.pages, // 一共多少页
                  size            : data.size   // 一共有多少数据
              },categoryId,title);
          }
      });
    },
    // 加载分页
    loadPagination: function (pageInfo,categoryId,title) {
        var _this = this;
        // 初始化组件
        this.pagination ? '' : (this.pagination = new Pagination());
        this.pagination.render($.extend({},pageInfo,{
            container:$(".pagination"),  // container jQuery容器
            // 用户选择之后的加载
            onSelectPage: function (pageNum) {
                _this.data.listParam.pageNum = pageNum;
                _this.loadCategoryBookList(categoryId,title);
            }
        }));
        // 需要分页 pagination 显示
        if (pageInfo.size >= _this.data.listParam.pageSize) {
            $(".pagination").show();
        }
    },
};

$(function () {
   page.init();
});