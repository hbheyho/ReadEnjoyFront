/**
 * @author HB
 * @date 2019/3/3
 * @fileName thx-writers.js
 * @Description:  致谢作家js
 */
"use strict";
/*引入自身css*/
require("./index.css");
/*引用navigation模块*/
require("../common/navigation/index.js");
/*引入footer模块*/
require("../common/footer/index");
/*引入mm工具类*/
var _mm = require("util/mm");
/*引用writerService*/
var _writerService = require("service/writerService");
/*作家列表模板*/
var tempWriterList = require("./writerInfoList.string");
/*年份列表模板*/
var tempYearList = require("./yearList.string");
var page = {
    data: {
        years: {
            newYear: ""
        }
    },
    init:function () {
        /*年份列表加载*/
        this.loadYearList();
        this.bindEvent();
    },
    bindEvent: function(){
        $('body').on("click","#myTabs a",function (e) {
            var year = $(this).attr("aria-controls");
            // 作家列表
            var writerListHTML = ""
            _writerService.getWriterByYears(year, function (data) {
                writerListHTML = _mm.renderHtml(tempWriterList,{
                    writerList: data
                });
                $("#writer-info").html(writerListHTML);
            },function (errMsg) {
                layer.msg(errMsg);
            })
        })
    },
    loadYearList: function () {
        var _this = this;
        /*年份列表 */
        var yearListHTML = ""
        _writerService.getYears(function (data) {
            yearListHTML = _mm.renderHtml(tempYearList,{
                yearList: data
            });
            _this.data.years.newYear = data[0];
            $("#year-list").html(yearListHTML);
            // 第一个a设置active
            $(".year:first").addClass("active");
            /*作家信息加载*/
            _this.loadWriterInfo();
        },function (errMsg) {
            layer.msg(errMsg);
        });
    },
    // 加载作家信息（初次加载）
    loadWriterInfo: function () {
        var _this = this;
        var year = _this.data.years.newYear;
        // 作家列表
        var writerListHTML = ""
        _writerService.getWriterByYears(year, function (data) {
            writerListHTML = _mm.renderHtml(tempWriterList,{
                writerList: data
            });
            $("#writer-info").html(writerListHTML);
        },function (errMsg) {
            layer.msg(errMsg);
        })
    },

};
$(function () {
    page.init();
})